import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import '@rainbow-me/rainbowkit/styles.css'

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
  hardhat,
  localhost
} from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


const config = getDefaultConfig({
  appName: "react-dapp-demo",
  projectId: 'a7e8d0307cb18abe347dd1636c9a2bc1',
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia, localhost, hardhat],
})

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
