import './App.css'
import LoginPage from '@/pages/login/index'
import {Toaster} from "sonner"
import { storage } from '@/utils/index'
import HomePage from '@/pages/home/index'

function App() {

  const isLogin = storage.getStorageItem('XJikeAccessToken') && storage.getStorageItem('XJikeRefreshToken')

  return (
    <>
      { !isLogin ? <LoginPage/> : <HomePage/> }
      <Toaster />
    </>
  )
}

export default App
