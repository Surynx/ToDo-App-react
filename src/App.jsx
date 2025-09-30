import TodoList from "./components/TodoList"
import './App.css'
import { Toaster } from "react-hot-toast"
import Heading from "./components/Heading"



function App() {


  return (
    <>
      <Toaster
        position="top-left"
        reverseOrder={false}
      />
      <Heading></Heading>
      <TodoList></TodoList>
    </>
  )
}

export default App
