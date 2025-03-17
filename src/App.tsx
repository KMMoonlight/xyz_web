import './App.css'
import { request } from "./utils"


function App() {
  const query = () => {
      request.rPost('/api/v1/auth/sendCode', {
          mobilePhoneNumber: "17621702358",
          areaCode: "+86"
      }).then((res) => {
          console.log(res)
      })
  }

  return (
    <>
      <button onClick={query}>
          click
      </button>
    </>
  )
}

export default App
