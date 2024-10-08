use anchor_lang::prelude::*;

declare_id!("8Z2PgtRgp49DtVqA17R3H9AgnHcZ1S7ERs9gDPYdkZYq"); // Replace with your actual program ID after deployment

#[program]
pub mod petition_program {
    use super::*;

    /// Creates a new petition with minimal on-chain data.
    pub fn create_petition(
        ctx: Context<CreatePetition>,
        target_votes: u64,
    ) -> Result<()> {
        let petition = &mut ctx.accounts.petition;
        
        // Ensure petition is only initialized if it doesn't already exist
        if petition.creator == Pubkey::default() {
            petition.creator = *ctx.accounts.creator.key;
            petition.current_votes = 0;
            petition.target_votes = target_votes;

            // Derive the PDA and bump
            let (_pda, bump) = Pubkey::find_program_address(
                &[b"petition", ctx.accounts.creator.key().as_ref()],
                ctx.program_id,
            );
            petition.bump = bump;

            // Deposit initial funds (0.025 SOL) into the petition account
            let lamports_initial = 25_000_000; // 0.025 SOL in lamports

            let transfer_ix = anchor_lang::solana_program::system_instruction::transfer(
                &ctx.accounts.creator.key(),
                &ctx.accounts.petition.key(),
                lamports_initial,
            );

            // Invoke the transfer
            anchor_lang::solana_program::program::invoke(
                &transfer_ix,
                &[
                    ctx.accounts.creator.to_account_info(),
                    ctx.accounts.petition.to_account_info(),
                    ctx.accounts.system_program.to_account_info(),
                ],
            )?;
        }

        Ok(())
    }

    /// Allows a user to vote on a petition.
    pub fn vote(ctx: Context<VotePetition>) -> Result<()> {
        {
            // Perform mutable operations first, including incrementing the votes
            let petition = &mut ctx.accounts.petition;
            
            // Ensure the voter is not the creator
            let voter = &ctx.accounts.voter;
            if voter.key() == petition.creator {
                return Err(PetitionError::CannotVoteOwnPetition.into());
            }
    
            // Check if the voter has already voted
            let vote_account = &mut ctx.accounts.vote_account;
            if vote_account.has_voted {
                return Err(PetitionError::AlreadyVoted.into());
            }
    
            // Mark as voted
            vote_account.has_voted = true;
    
            // Increment the vote count
            petition.current_votes = petition
                .current_votes
                .checked_add(1)
                .ok_or(PetitionError::Overflow)?;
    
            // Transfer 0.005 SOL from voter to petition account using CPI
            let lamports_to_transfer = 5_000_000; // 0.005 SOL in lamports
    
            let ix = anchor_lang::solana_program::system_instruction::transfer(
                &ctx.accounts.voter.key(),
                &ctx.accounts.petition.key(), // immutable borrow happens here
                lamports_to_transfer,
            );
            anchor_lang::solana_program::program::invoke(
                &ix,
                &[
                    ctx.accounts.voter.to_account_info(),
                    ctx.accounts.petition.to_account_info(), // immutable borrow happens here
                ],
            )?;
        } // Mutable borrow ends here
    
        // Now perform any immutable operations
        let petition = &ctx.accounts.petition; // Immutable borrow starts here
        if petition.current_votes >= petition.target_votes {
            // Reward the creator with 0.1 SOL using CPI
            let reward = 100_000_000; // 0.1 SOL in lamports
    
            let ix_reward = anchor_lang::solana_program::system_instruction::transfer(
                &petition.key(), // Immutable borrow happens here
                &ctx.accounts.creator.key(),
                reward,
            );
            anchor_lang::solana_program::program::invoke(
                &ix_reward,
                &[
                    ctx.accounts.petition.to_account_info(), // Immutable borrow happens here
                    ctx.accounts.creator.to_account_info(),
                ],
            )?;
    
            // Emit an event
            emit!(PetitionCompleted {
                petition_id: petition.key(), // Immutable borrow happens here
                creator: petition.creator,
                reward,
            });
        }
    
        Ok(())
    }
    
}

#[derive(Accounts)]
pub struct CreatePetition<'info> {
    #[account(
        init_if_needed, 
        payer = creator,
        space = Petition::LEN,
        seeds = [b"petition", creator.key().as_ref()],
        bump,
    )]
    pub petition: Account<'info, Petition>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VotePetition<'info> {
    #[account(mut)]
    pub petition: Account<'info, Petition>,
    #[account(
        init_if_needed, // Use init_if_needed here too
        payer = voter,
        space = Vote::LEN,
        seeds = [b"vote", petition.key().as_ref(), voter.key().as_ref()],
        bump,
    )]
    pub vote_account: Account<'info, Vote>,
    #[account(mut)]
    pub voter: Signer<'info>,
    /// CHECK: The creator is a read-only account; safe as we only transfer lamports to it
    pub creator: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Petition {
    pub creator: Pubkey,
    pub current_votes: u64,
    pub target_votes: u64,
    pub bump: u8,
}

impl Petition {
    const LEN: usize = 8 + 32 + 8 + 8 + 1 + 7; // discriminator + creator + current_votes + target_votes + bump
}

#[account]
pub struct Vote {
    pub has_voted: bool,
    pub bump: u8,
}

impl Vote {
    const LEN: usize = 8 + 1 + 1 + 6; // discriminator + has_voted + bump
}

#[event]
pub struct PetitionCompleted {
    pub petition_id: Pubkey,
    pub creator: Pubkey,
    pub reward: u64,
}

#[error_code]
pub enum PetitionError {
    #[msg("You cannot vote on your own petition.")]
    CannotVoteOwnPetition,
    #[msg("You have already voted on this petition.")]
    AlreadyVoted,
    #[msg("Vote count overflow.")]
    Overflow,
}
