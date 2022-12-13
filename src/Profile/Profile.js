import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import * as React from 'react'
import { useDebounce } from 'use-debounce'
import { usePrepareSendTransaction, useSendTransaction,useWaitForTransaction  } from 'wagmi'
import { utils } from 'ethers'
function Profile() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  const [to, setTo] = React.useState('')
  const [debouncedTo] = useDebounce(to, 500)

  const [amount, setAmount] = React.useState('')
  const [debouncedAmount] = useDebounce(amount, 500)

  const { config } = usePrepareSendTransaction({
    request: {
      to: debouncedTo,
      value: debouncedAmount ? utils.parseEther(debouncedAmount) : undefined,
    },
  })
  const { data, sendTransaction } = useSendTransaction(config)
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  if (isConnected)
    return (
      <div>
        Connected to {address}
                <form
                onSubmit={(e) => {
                    e.preventDefault()
                    sendTransaction?.()
                }}
                >
                <input
                    aria-label="Recipient"
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="0xA0Cf…251e"
                    value={to}
                />
                <input
                    aria-label="Amount (filecoin)"
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.05"
                    value={amount}
                />
                  <button disabled={isLoading || !sendTransaction || !to || !amount}>
                    {isLoading ? 'Sending...' : 'Send'}
                     </button>
                    {isSuccess && (
                        <div>
                        Successfully sent {amount} Filecoin to {to}
                        <div>
                            <a href={`https://explorer.glif.io/tx/${data?.hash}/?network=wallabynet`}>Glif Scan</a>
                        </div>
                        </div>
                    )}

                </form>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    )
  return <button onClick={() => connect()}>Connect Wallet</button>
}

export default Profile;