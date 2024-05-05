import './App.css'
import Main from './pages/Main'
import TaskCreate from './pages/TaskCreate'
import TaskEdit from './pages/TaskEdit'
import Login from './pages/Login'
import Register from './pages/Register'
import { BrowserRouter, Route, Routes } from 'react-router-dom'


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />}/>
        <Route path='/task' element={<TaskCreate />}/>
        <Route path='/task/:taskId/' element={<TaskEdit />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
