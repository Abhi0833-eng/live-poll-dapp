import { useState, useEffect } from "react";
import { requestAccess, getAddress, signTransaction } from "@stellar/freighter-api";
import * as StellarSdk from "@stellar/stellar-sdk";
import "./App.css";

const CONTRACT_ID = "CBVY4FQ43ZMDATQHTSFNZQ3UOHIFKLWKMJBFTKKVSV6JYYXOPOWTHXH7";
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
const RPC_URL = "https://soroban-testnet.stellar.org";

function App() {
  const [publicKey, setPublicKey] = useState("");
  const [votes, setVotes] = useState({ yes: 0, no: 0, maybe: 0 });
  const [txStatus, setTxStatus] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const connectWallet = async () => {
    try {
      setError("");
      await requestAccess();
      const result = await getAddress();
      if (!result.address) throw new Error("Wallet not found or rejected");
      setPublicKey(result.address);
    } catch (err) {
      if (err.message.includes("User declined")) {
        setError("❌ Error: User rejected the connection");
      } else if (err.message.includes("not found")) {
        setError("❌ Error: Freighter wallet not found. Please install it.");
      } else {
        setError("❌ Error: " + err.message);
      }
    }
  };

  const disconnectWallet = () => {
    setPublicKey("");
    setTxStatus("");
    setTxHash("");
    setError("");
  };

  const fetchVotes = async () => {
    try {
      const rpc = new StellarSdk.rpc.Server(RPC_URL);
      for (const option of ["yes", "no", "maybe"]) {
        const result = await rpc.simulateTransaction(
          new StellarSdk.TransactionBuilder(
            await rpc.getAccount("GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN"),
            { fee: "100", networkPassphrase: NETWORK_PASSPHRASE }
          )
            .addOperation(StellarSdk.Operation.invokeContractFunction({
              contract: CONTRACT_ID,
              function: "get_votes",
              args: [StellarSdk.nativeToScVal(option, { type: "symbol" })],
            }))
            .setTimeout(30)
            .build()
        );
        if (result.result) {
          const val = StellarSdk.scValToNative(result.result.retval);
          setVotes(prev => ({ ...prev, [option]: Number(val) }));
        }
      }
    } catch (err) {
      console.error("Fetch votes error:", err);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  const vote = async (option) => {
    if (!publicKey) { setError("❌ Error: Please connect wallet first!"); return; }
    setLoading(true);
    setTxStatus("pending");
    setTxHash("");
    setError("");
    try {
      const rpc = new StellarSdk.rpc.Server(RPC_URL);
      const account = await rpc.getAccount(publicKey);
      const tx = new StellarSdk.TransactionBuilder(account, {
        fee: "100",
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(StellarSdk.Operation.invokeContractFunction({
          contract: CONTRACT_ID,
          function: "vote",
          args: [StellarSdk.nativeToScVal(option, { type: "symbol" })],
        }))
        .setTimeout(30)
        .build();

      const simResult = await rpc.simulateTransaction(tx);
      if (StellarSdk.rpc.Api.isSimulationError(simResult)) {
        throw new Error("Simulation failed: " + simResult.error);
      }

      const preparedTx = StellarSdk.rpc.assembleTransaction(tx, simResult).build();
      const signed = await signTransaction(preparedTx.toXDR(), { networkPassphrase: NETWORK_PASSPHRASE });
      const finalTx = StellarSdk.TransactionBuilder.fromXDR(signed.signedTxXdr || signed, NETWORK_PASSPHRASE);
      const sendResult = await rpc.sendTransaction(finalTx);

      if (sendResult.status === "ERROR") {
        throw new Error("Insufficient balance or transaction error");
      }

      setTxHash(sendResult.hash);
      setTxStatus("success");
      setTimeout(fetchVotes, 3000);
    } catch (err) {
      setTxStatus("error");
      if (err.message.includes("balance")) {
        setError("❌ Error: Insufficient balance to pay fees");
      } else if (err.message.includes("declined") || err.message.includes("rejected")) {
        setError("❌ Error: Transaction rejected by user");
      } else {
        setError("❌ Error: " + err.message);
      }
    }
    setLoading(false);
  };

  const total = votes.yes + votes.no + votes.maybe;
  const pct = (v) => total === 0 ? 0 : Math.round((v / total) * 100);

  return (
    <div className="app">
      <h1>Live Poll dApp</h1>
      <p className="subtitle">Stellar Testnet · Soroban Smart Contract</p>

      {!publicKey ? (
        <button className="btn-connect" onClick={connectWallet}>
          Connect Freighter Wallet
        </button>
      ) : (
        <div className="wallet-info">
          <span className="address">{publicKey.slice(0, 8)}...{publicKey.slice(-8)}</span>
          <button className="btn-disconnect" onClick={disconnectWallet}>Disconnect</button>
        </div>
      )}

      {error && <div className="error-box">{error}</div>}

      <div className="poll-card">
        <h2>Should Stellar be the future of DeFi?</h2>
        <div className="options">
          {["yes", "no", "maybe"].map((opt) => (
            <div key={opt} className="option">
              <div className="option-header">
                <span className="option-label">{opt.toUpperCase()}</span>
                <span className="option-count">{votes[opt]} votes ({pct(votes[opt])}%)</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: pct(votes[opt]) + "%" }}></div>
              </div>
              <button
                className="btn-vote"
                onClick={() => vote(opt)}
                disabled={loading || !publicKey}
              >
                {loading ? "Voting..." : "Vote " + opt.toUpperCase()}
              </button>
            </div>
          ))}
        </div>
        <p className="total">Total votes: {total}</p>
      </div>

      {txStatus === "pending" && <div className="status pending">⏳ Transaction pending...</div>}
      {txStatus === "success" && (
        <div className="status success">
          ✅ Vote submitted!
          <a href={"https://stellar.expert/explorer/testnet/tx/" + txHash} target="_blank" rel="noreferrer">
            View on Explorer
          </a>
        </div>
      )}
      {txStatus === "error" && <div className="status error">❌ Transaction failed</div>}
    </div>
  );
}

export default App;