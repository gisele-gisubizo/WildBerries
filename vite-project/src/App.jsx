import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Components/Home'
import Layout from './Components/Layout'
import './App.css'
import Sidebar from './AdminDashboard/Sidebar'
import DashboardNavbar from './AdminDashboard/Navbar'
import PageDetails from './Components/ProductDetails'; 

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>

        <Routes>

          <Route path='/' element={<Layout />}>
            <Route path='/Home' index element={<Home />} />
              <Route path='/product/:id' element={<PageDetails />} />

          </Route>
          <Route path='/Dashboard' index element={<Sidebar />} />
          <Route path='/Dashboard' index element={<DashboardNavbar />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
