// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import FavoritesdappIDL from '../target/idl/favoritesdapp.json'
import type { Favoritesdapp } from '../target/types/favoritesdapp'

// Re-export the generated IDL and type
export { Favoritesdapp, FavoritesdappIDL }

// The programId is imported from the program IDL.
export const FAVORITESDAPP_PROGRAM_ID = new PublicKey(FavoritesdappIDL.address)

// This is a helper function to get the Favoritesdapp Anchor program.
export function getFavoritesdappProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...FavoritesdappIDL, address: address ? address.toBase58() : FavoritesdappIDL.address } as Favoritesdapp, provider)
}

// This is a helper function to get the program ID for the Favoritesdapp program depending on the cluster.
export function getFavoritesdappProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Favoritesdapp program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return FAVORITESDAPP_PROGRAM_ID
  }
}
