import { ConnectButton } from "@rainbow-me/rainbowkit";


export default function Header() {
    return (
        <div className="header">
            <div className="wallet">
                <ConnectButton accountStatus={{
                    smallScreen: 'avatar',
                    largeScreen: 'full'
                }} />
            </div>
        </div>
    )
}