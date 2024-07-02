import { getDefaultConfig } from "@rainbow-me/rainbowkit";
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

export const config: ReturnType<typeof getDefaultConfig> = getDefaultConfig({
    appName: "react-dapp-demo",
    projectId: 'a7e8d0307cb18abe347dd1636c9a2bc1',
    chains: [mainnet, polygon, optimism, arbitrum, base, sepolia, localhost, hardhat],
})