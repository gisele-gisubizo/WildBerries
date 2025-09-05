import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Components/Home'
import Layout from './Components/Layout'
import './App.css'
import Sidebar from './AdminDashboard/Sidebar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>

        <Routes>

          <Route path='/' element={<Layout />}>
            <Route path='/Home' index element={<Home />} />

          </Route>
          <Route path='/Dashboard' index element={<Sidebar />} />

        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
