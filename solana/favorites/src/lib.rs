use anchor_lang::prelude::*;

declare_id!("6qVW6ZgCAPTvxJm78DhbwiQ4RRChjj2tTFpPtEoxy9sZ");

pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod favorites {
    use super::*;

    pub fn set_favorites(
        context: Context<SetFavorites>, 
        number: u64, 
        color: String, 
        hobbies: Vec<String>,
    ) -> Result<()> {
        msg!("Greetings from {}", context.program_id);
        let user_public_key = context.accounts.user.key();

        // msg!("User {user_public_key}'s favorite number is {number}, favorite color is {color} and their hobbies are {hobbies:?}");
        // The issue in your logs is that placeholders like {user_public_key}, {number}, {color}, and {hobbies:?} are not interpolated. In the Solana msg! macro, Rust’s string interpolation using {} is not supported as in println!. Instead, you need to manually format the message.
        msg!(
            "User {}'s favorite number is {}, favorite color is {} and their hobbies are {:?}",
            user_public_key,
            number,
            color,
            hobbies
        );


        context.accounts.favorites.set_inner( Favorites {
            number,
            color,
            hobbies
        });

        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct Favorites {
    pub number: u64,

    #[max_len(50)]
    pub color: String,

    #[max_len(5, 50)]
    pub hobbies: Vec<String>,
}


#[derive(Accounts)]
pub struct SetFavorites<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init_if_needed,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE + Favorites::INIT_SPACE,
        seeds = [b"favorites", user.key().as_ref()],
        bump
    )]
    pub favorites: Account<'info, Favorites>,

    pub system_program: Program<'info, System>,
}