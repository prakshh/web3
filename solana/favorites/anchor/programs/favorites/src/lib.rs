#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod favorites {
    use super::*;

  pub fn close(_ctx: Context<CloseFavorites>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.favorites.count = ctx.accounts.favorites.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.favorites.count = ctx.accounts.favorites.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeFavorites>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.favorites.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeFavorites<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Favorites::INIT_SPACE,
  payer = payer
  )]
  pub favorites: Account<'info, Favorites>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseFavorites<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub favorites: Account<'info, Favorites>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub favorites: Account<'info, Favorites>,
}

#[account]
#[derive(InitSpace)]
pub struct Favorites {
  count: u8,
}
