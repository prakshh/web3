import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Favoritesdapp} from '../target/types/favoritesdapp'

describe('favoritesdapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Favoritesdapp as Program<Favoritesdapp>

  const favoritesdappKeypair = Keypair.generate()

  it('Initialize Favoritesdapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        favoritesdapp: favoritesdappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([favoritesdappKeypair])
      .rpc()

    const currentCount = await program.account.favoritesdapp.fetch(favoritesdappKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Favoritesdapp', async () => {
    await program.methods.increment().accounts({ favoritesdapp: favoritesdappKeypair.publicKey }).rpc()

    const currentCount = await program.account.favoritesdapp.fetch(favoritesdappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Favoritesdapp Again', async () => {
    await program.methods.increment().accounts({ favoritesdapp: favoritesdappKeypair.publicKey }).rpc()

    const currentCount = await program.account.favoritesdapp.fetch(favoritesdappKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Favoritesdapp', async () => {
    await program.methods.decrement().accounts({ favoritesdapp: favoritesdappKeypair.publicKey }).rpc()

    const currentCount = await program.account.favoritesdapp.fetch(favoritesdappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set favoritesdapp value', async () => {
    await program.methods.set(42).accounts({ favoritesdapp: favoritesdappKeypair.publicKey }).rpc()

    const currentCount = await program.account.favoritesdapp.fetch(favoritesdappKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the favoritesdapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        favoritesdapp: favoritesdappKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.favoritesdapp.fetchNullable(favoritesdappKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
