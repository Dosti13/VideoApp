import {Route,Routes} from "react-router-dom"
import './App.css'
import Lobby from "./page/lobby"
import Room from "./page/room"
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Lobby/>} />
        <Route path="/" element={<Room/>} />
      </Routes>
    </>
  )
}

export default App
