# Live Poll dApp - Stellar Yellow Belt

A live polling dApp built on Stellar testnet using Soroban smart contracts.

## Features
- Connect Freighter wallet
- Vote on-chain using Soroban smart contract
- Real-time vote count display
- 3 error types handled:
  - Wallet not found
  - Transaction rejected by user
  - Insufficient balance
- Transaction status: pending / success / fail

## Tech Stack
- React + Vite
- @stellar/freighter-api v6
- @stellar/stellar-sdk
- Soroban Smart Contract (Rust)
- Stellar Testnet

## Deployed Contract

Contract Address: `CBVY4FQ43ZMDATQHTSFNZQ3UOHIFKLWKMJBFTKKVSV6JYYXOPOWTHXH7`

[View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CBVY4FQ43ZMDATQHTSFNZQ3UOHIFKLWKMJBFTKKVSV6JYYXOPOWTHXH7)

## Contract Transaction Hash

`dff148dea72615c0ee8789fed2c0a074d79340201103b332cd043a4eb7ded300`

[View Transaction](https://stellar.expert/explorer/testnet/tx/dff148dea72615c0ee8789fed2c0a074d79340201103b332cd043a4eb7ded300)

## Setup Instructions

1. Clone the repository:
   git clone https://github.com/Abhi0833-eng/live-poll-dapp.git

2. Install dependencies:
   cd live-poll-dapp
   npm install

3. Run the app:
   npm run dev

4. Open browser:
   http://localhost:5173

## How to Use
1. Install Freighter wallet extension
2. Switch Freighter to Test Net
3. Fund wallet using Friendbot
4. Click "Connect Freighter Wallet"
5. Click any Vote button
6. Confirm transaction in Freighter

## Smart Contract
Contract code is in `contracts/poll/src/lib.rs`

## Network
Stellar Testnet
Soroban RPC: https://soroban-testnet.stellar.org