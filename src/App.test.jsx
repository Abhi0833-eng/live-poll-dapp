import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'

// Mock freighter API
vi.mock('@stellar/freighter-api', () => ({
  requestAccess: vi.fn().mockResolvedValue({}),
  getAddress: vi.fn().mockResolvedValue({ address: 'GBEA2LH5VILCEKQC6M77GXGJ3CPJOOMGEKNMMNXQXMJA42BMPX4YSN72' }),
  signTransaction: vi.fn().mockResolvedValue({ signedTxXdr: 'mockXDR' }),
}))

// Mock stellar SDK
vi.mock('@stellar/stellar-sdk', async () => {
  const actual = await vi.importActual('@stellar/stellar-sdk')
  return {
    ...actual,
    rpc: {
      Server: vi.fn().mockImplementation(() => ({
        getAccount: vi.fn().mockResolvedValue({ id: 'test', sequence: '1' }),
        simulateTransaction: vi.fn().mockResolvedValue({
          result: { retval: actual.nativeToScVal(0, { type: 'u32' }) },
        }),
        sendTransaction: vi.fn().mockResolvedValue({
          status: 'PENDING',
          hash: 'abc123hash',
        }),
      })),
      Api: {
        isSimulationError: vi.fn().mockReturnValue(false),
      },
      assembleTransaction: vi.fn().mockReturnValue({
        build: vi.fn().mockReturnValue({ toXDR: vi.fn().mockReturnValue('mockXDR') }),
      }),
    },
  }
})

describe('Live Poll dApp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Test 1: renders poll title and connect button', () => {
    render(<App />)
    expect(screen.getByText('Live Poll dApp')).toBeInTheDocument()
    expect(screen.getByText('Connect Freighter Wallet')).toBeInTheDocument()
  })

  it('Test 2: shows disconnect button after wallet connects', async () => {
    render(<App />)
    const connectBtn = screen.getByText('Connect Freighter Wallet')
    fireEvent.click(connectBtn)
    await waitFor(() => {
      expect(screen.getByText('Disconnect')).toBeInTheDocument()
    })
  })

  it('Test 3: shows all three poll options', () => {
    render(<App />)
    expect(screen.getByText('Vote YES')).toBeInTheDocument()
    expect(screen.getByText('Vote NO')).toBeInTheDocument()
    expect(screen.getByText('Vote MAYBE')).toBeInTheDocument()
  })

  it('Test 4: connect wallet button calls requestAccess', async () => {
    const { requestAccess } = await import('@stellar/freighter-api')
    render(<App />)
    const connectBtn = screen.getByText('Connect Freighter Wallet')
    fireEvent.click(connectBtn)
    await waitFor(() => {
      expect(requestAccess).toHaveBeenCalled()
    })
  })
})