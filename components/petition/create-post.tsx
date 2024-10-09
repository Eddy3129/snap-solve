'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import styled from 'styled-components';
import { supabase } from '@/lib/supabase';
import LocationSearchInput from '@/components/LocationSearchInput';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { SystemProgram, PublicKey } from '@solana/web3.js';
import { Program, Idl, AnchorProvider, setProvider } from '@coral-xyz/anchor';
import idl from '../petition_program.json';
import * as anchor from '@coral-xyz/anchor';

// Styled Components
const ImageUploadArea = styled.div`
  margin-top: 20px;
  padding: 20px;
  border: 2px dashed #8b5cf6;
  border-radius: 8px;
  text-align: center;
  color: #d8b4fe;
`;

const ImagePreview = styled.img`
  width: 100px;
  height: 100px;
  margin-top: 10px;
  border-radius: 8px;
`;

const FileNameDisplay = styled.div`
  color: #d8b4fe;
  margin-top: 10px;
`;

// Interface for location suggestions
interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

const CreatePetitionForm: React.FC = () => {
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const publicKey = anchorWallet?.publicKey;  // This is the creator's public key

  const [latitude, setLatitude] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  // Form field states
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [targetVotes, setTargetVotes] = useState<number>(100); // Set an initial target votes

  // File for image upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (formMessage) {
      alert(formMessage);
    }
  }, [formMessage]);

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    setLocation(suggestion.display_name);
    setLatitude(suggestion.lat);
    setLongitude(suggestion.lon);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const { data, error } = await supabase.storage
          .from('images')
          .upload(`public/${file.name}`, file);

        if (error) throw new Error('Error uploading image');

        const { data: publicUrlData } = supabase.storage
          .from('images')
          .getPublicUrl(`public/${file.name}`);
        
        setImageURL(publicUrlData.publicUrl || '');
        setImageName(file.name);
      } catch (error: any) {
        alert(`Error uploading image: ${error.message}`);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!publicKey) {
      alert('Please connect your wallet.');
      return;
    }

    if (!title || !description || !location || !latitude || !longitude || !imageURL) {
      alert('Please fill in all required fields and upload an image.');
      return;
    }

    if (!anchorWallet) {
      alert('Wallet not connected');
      return;
    }

    try {
      // Initialize Anchor provider
      const provider = new AnchorProvider(connection, anchorWallet, {
        preflightCommitment: 'processed',
      });
      setProvider(provider); // Sets the default provider for Anchor

      // Instantiate Program with correct program ID
      const programId = new PublicKey("xnvDsEDqnUh22BRpicSSSJHKjKtBJpPa1j1esc8tpww");
      const program = new Program(idl as Idl, provider);

      // Derive the PDA for the petition account using the creator's public key
      const [petitionPDA, bump] = await PublicKey.findProgramAddressSync(
        [Buffer.from("petition"), publicKey.toBuffer()], // Use creator's public key for PDA
        program.programId
      );

      const targetVotesBN = new anchor.BN(targetVotes);

      // Send the create_petition transaction
      const tx = await program.methods
        .createPetition(targetVotesBN)
        .accounts({
          petition: petitionPDA,
          creator: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log('Transaction signature:', tx);

      // Save petition details to Supabase
      const { error: dbError } = await supabase
        .from('petitions')
        .insert([
          {
            title,
            description,
            location,
            latitude: parseFloat(latitude || '0'),
            longitude: parseFloat(longitude || '0'),
            image: imageURL,
            createdAt: new Date().toISOString(),  // Save the current timestamp
            votes: 0,  // Initially 0 votes
            target: targetVotes,  // Use the target from form
            petition_id: petitionPDA.toString(),  // Use the petition's PDA as petition_id
            transaction_hash: tx,  // Store the transaction signature
            creator: publicKey.toBase58(),  // Store the creator's public key in Supabase
          },
        ]);

      if (dbError) throw dbError;

      setFormMessage('Petition created successfully!');
    } catch (error: any) {
      setFormMessage(`Error creating petition: ${error.message}`);
    }
  };

  return (
    <div className="w-full bg-black rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-center text-purple-300 mb-8">Create A Petition</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-purple-300 mb-1">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-purple-500 rounded-md text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-purple-300 mb-1">
            Short description of what happened...
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Describe your situation..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-purple-500 rounded-md text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-purple-300 mb-1">
            Location
          </label>
          <LocationSearchInput onLocationSelect={handleLocationSelect} />
        </div>

        {/* Target Votes */}
        <div>
          <label htmlFor="targetVotes" className="block text-sm font-medium text-purple-300 mb-1">
            Target Votes
          </label>
          <input
            id="targetVotes"
            name="targetVotes"
            type="number"
            placeholder="Enter target votes"
            value={targetVotes}
            onChange={(e) => setTargetVotes(Number(e.target.value))}
            className="w-full px-3 py-2 bg-gray-800 border border-purple-500 rounded-md text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
        </div>

        {/* Image Upload */}
        <ImageUploadArea>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            id="image-upload"
            required
          />
          <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
            Click to upload an image (or drag and drop)
          </label>

          {/* Display Image and Name */}
          {imageURL && (
            <>
              <ImagePreview src={imageURL} alt="Uploaded image" />
              {imageName && <FileNameDisplay>Uploaded: {imageName}</FileNameDisplay>}
            </>
          )}
        </ImageUploadArea>

        {/* Submit Button */}
        <div>
          <Button type="submit" className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-green-400">
            Post Petition
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePetitionForm;
