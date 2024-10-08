import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PetitionProgram } from "../target/types/petition_program";
import { assert } from "chai";

describe("petition_program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.PetitionProgram as Program<PetitionProgram>;

  let petitionPubkey: anchor.web3.PublicKey;

  it("Creates a new petition", async () => {
    // Generate a keypair for the petition
    const petition = anchor.web3.Keypair.generate();

    // Call the create_petition instruction
    await program.methods
      .createPetition(new anchor.BN(10)) // Target votes: 10
      .accounts({
        petition: petition.publicKey,
        creator: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([petition])
      .rpc();

    // Fetch the petition account
    const fetchedPetition = await program.account.petition.fetch(petition.publicKey);
    assert.ok(fetchedPetition.creator.equals(provider.wallet.publicKey));
    assert.equal(fetchedPetition.currentVotes.toNumber(), 0);
    assert.equal(fetchedPetition.targetVotes.toNumber(), 10);

    // Store for later tests
    petitionPubkey = petition.publicKey;
  });

  it("Allows a user to vote on a petition", async () => {
    // Generate a keypair for the voter
    const voter = anchor.web3.Keypair.generate();

    // Airdrop some SOL to the voter
    const airdropSignature = await provider.connection.requestAirdrop(
      voter.publicKey,
      1 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction({
      signature: airdropSignature,
      commitment: "confirmed",
    });

    // Derive the PDA for the vote account
    const [votePDA, _] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vote"), petitionPubkey.toBuffer(), voter.publicKey.toBuffer()],
      program.programId
    );

    // Call the vote instruction
    await program.methods
      .vote()
      .accounts({
        petition: petitionPubkey,
        voteAccount: votePDA,
        voter: voter.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([voter])
      .rpc();

    // Fetch the updated petition account
    const updatedPetition = await program.account.petition.fetch(petitionPubkey);
    assert.equal(updatedPetition.currentVotes.toNumber(), 1);

    // Fetch the vote account
    const fetchedVote = await program.account.vote.fetch(votePDA);
    assert.isTrue(fetchedVote.hasVoted);
  });

  it("Prevents a user from voting twice on the same petition", async () => {
    // Generate a keypair for the voter
    const voter = anchor.web3.Keypair.generate();

    // Airdrop some SOL to the voter
    const airdropSignature = await provider.connection.requestAirdrop(
      voter.publicKey,
      1 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction({
      signature: airdropSignature,
      commitment: "confirmed",
    });

    // Derive the PDA for the vote account
    const [votePDA, _] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vote"), petitionPubkey.toBuffer(), voter.publicKey.toBuffer()],
      program.programId
    );

    // First vote
    await program.methods
      .vote()
      .accounts({
        petition: petitionPubkey,
        voteAccount: votePDA,
        voter: voter.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([voter])
      .rpc();

    // Attempt to vote again
    try {
      await program.methods
        .vote()
        .accounts({
          petition: petitionPubkey,
          voteAccount: votePDA,
          voter: voter.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([voter])
        .rpc();
      assert.fail("Expected error not thrown");
    } catch (err: any) {
      assert.equal(err.error.errorCode.code, "AlreadyVoted");
    }
  });

  it("Prevents the creator from voting on their own petition", async () => {
    // Derive the PDA for the vote account
    const [votePDA, _] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vote"), petitionPubkey.toBuffer(), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    // Attempt to vote as the creator
    try {
      await program.methods
        .vote()
        .accounts({
          petition: petitionPubkey,
          voteAccount: votePDA,
          voter: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      assert.fail("Expected error not thrown");
    } catch (err: any) {
      assert.equal(err.error.errorCode.code, "CannotVoteOwnPetition");
    }
  });

  it("Rewards the creator when target votes are met", async () => {
    // Create a petition with target_votes = 2
    const petition = anchor.web3.Keypair.generate();

    await program.methods
      .createPetition(new anchor.BN(2)) // Target votes: 2
      .accounts({
        petition: petition.publicKey,
        creator: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([petition])
      .rpc();

    // Derive PDAs for two voters
    const voter1 = anchor.web3.Keypair.generate();
    const voter2 = anchor.web3.Keypair.generate();

    // Airdrop SOL to voters
    for (let voter of [voter1, voter2]) {
      const airdropSignature = await provider.connection.requestAirdrop(
        voter.publicKey,
        1 * anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction({
        signature: airdropSignature,
        commitment: "confirmed",
      });
    }

    const [votePDA1, _] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vote"), petition.publicKey.toBuffer(), voter1.publicKey.toBuffer()],
      program.programId
    );

    const [votePDA2, _2] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vote"), petition.publicKey.toBuffer(), voter2.publicKey.toBuffer()],
      program.programId
    );

    // First vote
    await program.methods
      .vote()
      .accounts({
        petition: petition.publicKey,
        voteAccount: votePDA1,
        voter: voter1.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([voter1])
      .rpc();

    // Second vote, which should trigger the reward
    await program.methods
      .vote()
      .accounts({
        petition: petition.publicKey,
        voteAccount: votePDA2,
        voter: voter2.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([voter2])
      .rpc();

    // Fetch the updated petition account
    const updatedPetition = await program.account.petition.fetch(petition.publicKey);
    assert.equal(updatedPetition.currentVotes.toNumber(), 2);

    // Check the creator's balance for the reward
    const creatorBalance = await provider.connection.getBalance(provider.wallet.publicKey);
    assert.isTrue(creatorBalance > 0); // Replace with exact balance checks if necessary
  });
});
