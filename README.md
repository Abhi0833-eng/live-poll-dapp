## Live Demo
https://live-poll-orange-belt.vercel.app

## Test Results
4/4 tests passing
✓ Test 1: renders poll title and connect button
✓ Test 2: shows disconnect button after wallet connects
✓ Test 3: shows all three poll options
✓ Test 4: connect wallet button calls requestAccess

## Demo Video
https://youtu.be/-ra5e-_lZc8


# Live Poll dApp - Stellar Orange Belt

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

dff148dea72615c0ee8789fed2c0a074d79340201103b332cd043a4eb7ded300

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

## Network
Stellar Testnet
Soroban RPC: https://soroban-testnet.stellar.org

## Screenshot 

**Freight**
https://github.com/Abhi0833-eng/live-poll-dapp/blob/8ca0af0ceb3d96e728742b4fe2d4382fad4a930f/screenshot/freight%20connect.png

**Poll Submitted**
https://github.com/Abhi0833-eng/live-poll-dapp/blob/8ca0af0ceb3d96e728742b4fe2d4382fad4a930f/screenshot/poll%20the%20section.png

**Vote Submitted**
https://github.com/Abhi0833-eng/live-poll-dapp/blob/8ca0af0ceb3d96e728742b4fe2d4382fad4a930f/screenshot/vote%20submitted.png
