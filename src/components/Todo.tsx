import { useCallback, useState } from "react";
import { Button, Input } from 'antd'
import { formatEther } from "viem";
import { readContract } from "wagmi/actions";
import contractABI from '../artifacts/contracts/TodoContract.sol/TodoContract.json'
import { config } from "../config";
import { useAccount, useBalance, useBlockNumber } from "wagmi";

function Todo() {
    const [msg, setMsg] = useState<string>('')
    const [balance, setBalance] = useState<string>('')
    const [loading, setLoading] = useState<boolean>()
    const { address, isConnected, chainId } = useAccount()
    const { data: balanceData } = useBalance({ address })
    const { data: blockNumber } = useBlockNumber({ watch: true })

    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

    // 读取合约账户余额
    const getBalance = useCallback(async () => {
        try {
            const result = await readContract(config, {
                address: contractAddress,
                abi: contractABI.abi,
                functionName: "getBalance",
            })

            console.log('读取该合约账户余额', result);
            const amount = result?.toString() ? formatEther(result as bigint) || '0.0' : '0.0'
            setBalance(amount)
        } catch (error) {
            console.error(error)
        }
    }, [contractAddress])

    // 读取消息列表
    // const getTodoList = useCallback(async () => {
    //     // setLoading(true)
    // })





    // 监听消息发布
    const handleChange = ()


    return (
        <div className="main">
            <div className="item">
                <span>合约账户余额：<em>{isConnected ? Number(balance) || "0.0" : "0.0"}</em>{balanceData?.symbol}</span>
                <Button type="primary" >我要提款</Button>
            </div>
            <div className="item">
                <span>当前区块高度：{isConnected ? blockNumber?.toString() || '-' : "-"}</span>
            </div>
            <div className="item">
                <Input value={msg} count={{ show: true, max: 50 }} maxLength={50} placeholder="请输入消息内容" onInput={(e) => handleChange(e.target.value)}></Input>
                <Button>{0 ? '确认中...' : '发布消息'}</Button>
            </div>
        </div>
    )
}


export default Todo;