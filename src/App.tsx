import './App.css'
import { useAccount } from 'wagmi'
import Header from "./components/Header"
import Todo from './components/Todo'

function App() {
  const { isConnected } = useAccount();
  console.log('isConnected', isConnected)

  return (
    <div className="App">
      <Header />
      <Todo />
    </div>
  )
}

export default App
