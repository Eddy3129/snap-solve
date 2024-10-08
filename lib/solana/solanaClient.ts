// src/lib/solana/solanaClient.ts

import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program, setProvider, Idl } from '@coral-xyz/anchor';
import idl from '@/components/petition_program.json'; // Adjust the path if necessary

// Define your program ID (ensure it matches your on-chain program)
export const PROGRAM_ID = new PublicKey("EuURLmnKvM2ZLtoSry177rtKhfZtPPSJq42hAhdJB1si");

/**
 * Initializes and returns the Anchor Program instance.
 * @param provider - The AnchorProvider instance.
 * @returns The Program instance for your petition program.
 */
export function getProgram(provider: AnchorProvider): Program {
  return new Program(idl as Idl, provider);
}
