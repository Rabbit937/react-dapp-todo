import { useCallback, useState } from "react";
import { formatEther } from "viem";
import { readContract } from "wagmi/actions";
import contractABI from '../artifacts/contracts/TodoContract.sol/TodoContract.json'

function Todo() {
    const [balance, setBalance] = useState<string>('')
    const [loading, setLoading] = useState<boolean>()

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
    const getTodoList = useCallback(async () => {
        // setLoading(true)
    })





    return (
        <div className="main">
            
        </div>
    )
}


export default Todo;