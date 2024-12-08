#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod favoritesdapp {
    use super::*;

  pub fn close(_ctx: Context<CloseFavoritesdapp>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.favoritesdapp.count = ctx.accounts.favoritesdapp.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.favoritesdapp.count = ctx.accounts.favoritesdapp.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeFavoritesdapp>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.favoritesdapp.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeFavoritesdapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Favoritesdapp::INIT_SPACE,
  payer = payer
  )]
  pub favoritesdapp: Account<'info, Favoritesdapp>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseFavoritesdapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub favoritesdapp: Account<'info, Favoritesdapp>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub favoritesdapp: Account<'info, Favoritesdapp>,
}

#[account]
#[derive(InitSpace)]
pub struct Favoritesdapp {
  count: u8,
}
