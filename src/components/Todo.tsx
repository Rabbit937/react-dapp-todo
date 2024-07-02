import { ReactNode, useCallback, useEffect, useState } from "react";
import { Button, Input, Tooltip, Tag, Table, message } from 'antd'
import { CheckCircleOutlined, SyncOutlined } from '@ant-design/icons'
import { formatEther } from "viem";
import { readContract, writeContract } from "wagmi/actions";
// import contractABI from '../artifacts/contracts/TodoContract.sol/TodoContract.json'
import { config } from "../config";
import { useAccount, useBalance, useBlockNumber, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { formatTxHash, timestampToDate } from '../utils'
import type { TableProps } from 'antd'


interface DataType {
    id: string;
    key: string;
    author: string;
    message: number;
    timestamp: string;
}


const columns: TableProps<DataType>['columns'] = [
    {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        render: (text) => <span>{text.toString()}</span>,
    },
    {
        title: '接收者',
        dataIndex: 'author',
        key: 'author',
    },
    {
        title: '消息',
        dataIndex: 'message',
        key: 'message',
    },
    {
        title: '时间戳',
        dataIndex: 'timestamp',
        key: 'timestamp',
        render: (text) => (<span>{timestampToDate(Number(text))}</span>),
    },
];


function Todo() {
    const [msg, setMsg] = useState<string>('')
    const [balance, setBalance] = useState<string>('')
    const [loading, setLoading] = useState<boolean>()
    const [isLoading, setIsLoading] = useState<boolean>()
    const [todoList, setTodoList] = useState<DataType[]>([])
    const { address, isConnected, chainId } = useAccount()
    const { data: balanceData } = useBalance({ address })
    const { data: blockNumber } = useBlockNumber({ watch: true })
    const [messageApi, contextHolder] = message.useMessage()
    const [isWithdraw, setWithdraw] = useState<boolean>(false)



    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const { data: hash, isPending, writeContractAsync } = useWriteContract()


    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })


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
        setLoading(true)
        setTodoList([]);

        try {
            const result = await readContract(config, {
                address: contractAddress,
                abi: contractABI.abi,
                functionName: 'getTodoList'
            })

            console.log(result);

            console.log()

        } catch (error) {

        }


    }, [contractAddress, messageApi])


    const getWithdraw = async () => {
        setWithdraw(true);
        try {
            const result = await writeContract(config, {
                address: contractAddress,
                abi: contractABI.abi,
                functionName: "withdraw"
            })

            console.log('发起提款', result);


        } catch (error) {

        }
    }


    const publishMsg = async () => {

    }


    // 监听消息发布
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMsg(e.target.value);
    }


    useEffect(() => {
        let timer = undefined;
        if (isConnected && chainId === 1337) {
            timer = setInterval(() => {
                getBalance();
                getTodoList();
            }, 6000)

            getBalance();
            getTodoList();
        } else {
            clearInterval(timer)
        }

        return () => {
            clearInterval(timer);
        }
    }, [getBalance, getTodoList, isConnected, chainId])



    const showTotal: (total: number, range: [number, number]) => ReactNode = (total) => {
        return (
            <div>
                共 {total} 条数据
            </div>
        )
    }


    return (
        <div className="main">
            <div className="item">
                <span>合约账户余额：<em>{isConnected ? Number(balance) || "0.0" : "0.0"}</em>{balanceData?.symbol}</span>
                <Button type="primary" onClick={getWithdraw} loading={isWithdraw}>我要提款</Button>
            </div>
            <div className="item">
                <span>当前区块高度：{isConnected ? blockNumber?.toString() || '-' : "-"}</span>
            </div>
            <div className="item">
                <Input value={msg} count={{ show: true, max: 50 }} maxLength={50} placeholder="请输入消息内容" onInput={handleChange}></Input>
                <Button type='primary' loading={isLoading && isPending} onClick={publishMsg} disabled={!isConnected || !msg}>{isPending ? '确认中...' : '发布消息'}</Button>
            </div>

            {isConnected && chainId === 1337 && hash && (
                <div className="item">
                    <Tooltip title={hash}>
                        <span>交易哈希：{formatTxHash(hash)}</span>
                    </Tooltip>
                </div>
            )}

            {isConnected && chainId === 1337 && isConfirming && (
                <div className='item'>
                    <Tag icon={<SyncOutlined spin />} color="processing">
                        交易确认中...
                    </Tag>
                </div>
            )}

            {isConnected && chainId === 1337 && isConfirmed && (
                <div className='item'>
                    <Tag icon={<CheckCircleOutlined />} color="success">
                        交易已确认
                    </Tag>
                </div>
            )}

            <div className="total">
                <Table loading={loading} columns={columns} dataSource={isConnected && chainId === 1337 ? todoList : []} pagination={{ pageSize: 6, showTotal }} />
            </div>
        </div>
    )
}


export default Todo;