'use client'

import { getFavoritesdappProgram, getFavoritesdappProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useFavoritesdappProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getFavoritesdappProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getFavoritesdappProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['favoritesdapp', 'all', { cluster }],
    queryFn: () => program.account.favoritesdapp.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['favoritesdapp', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ favoritesdapp: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useFavoritesdappProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useFavoritesdappProgram()

  const accountQuery = useQuery({
    queryKey: ['favoritesdapp', 'fetch', { cluster, account }],
    queryFn: () => program.account.favoritesdapp.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['favoritesdapp', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ favoritesdapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['favoritesdapp', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ favoritesdapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['favoritesdapp', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ favoritesdapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['favoritesdapp', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ favoritesdapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
