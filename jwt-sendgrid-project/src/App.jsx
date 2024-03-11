import './App.css'
import Login from './components/identity/Login'
import Register from './components/identity/Register'
import ResendVerifciation from './components/identity/ResendVerifciation'

function App() {

  return (
    <>
      <Register />
      <Login />
      <ResendVerifciation />
    </>
  )
}

export default App
