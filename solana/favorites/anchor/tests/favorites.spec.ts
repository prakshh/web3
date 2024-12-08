import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Favorites} from '../target/types/favorites'

describe('favorites', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Favorites as Program<Favorites>

  const favoritesKeypair = Keypair.generate()

  it('Initialize Favorites', async () => {
    await program.methods
      .initialize()
      .accounts({
        favorites: favoritesKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([favoritesKeypair])
      .rpc()

    const currentCount = await program.account.favorites.fetch(favoritesKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Favorites', async () => {
    await program.methods.increment().accounts({ favorites: favoritesKeypair.publicKey }).rpc()

    const currentCount = await program.account.favorites.fetch(favoritesKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Favorites Again', async () => {
    await program.methods.increment().accounts({ favorites: favoritesKeypair.publicKey }).rpc()

    const currentCount = await program.account.favorites.fetch(favoritesKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Favorites', async () => {
    await program.methods.decrement().accounts({ favorites: favoritesKeypair.publicKey }).rpc()

    const currentCount = await program.account.favorites.fetch(favoritesKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set favorites value', async () => {
    await program.methods.set(42).accounts({ favorites: favoritesKeypair.publicKey }).rpc()

    const currentCount = await program.account.favorites.fetch(favoritesKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the favorites account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        favorites: favoritesKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.favorites.fetchNullable(favoritesKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
