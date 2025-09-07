import { useState } from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Home from './Components/Home'
import Layout from './Components/Layout'
import PageDetails from './Components/ProductDetails'; 
import './App.css'
import Sidebar from './AdminDashboard/Sidebar'
import DashboardNavbar from './AdminDashboard/Navbar'
>>>>>>>>> Temporary merge branch 2

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
<<<<<<<<< Temporary merge branch 1
        <Routes>
          {/* Layout wrapper */}
          <Route path='/' element={<Layout />}>
            
            {/* Home page */}
            <Route index element={<Home />} />

            {/* ✅ Page details route */}
            <Route path='/product/:id' element={<PageDetails />} />

          </Route>
        </Routes>
=========

        <Routes>

          <Route path='/' element={<Layout />}>
            <Route path='/Home' index element={<Home />} />

          </Route>
          <Route path='/Dashboard' index element={<Sidebar />} />
          <Route path='/Dashboard' index element={<DashboardNavbar />} />


        </Routes>

>>>>>>>>> Temporary merge branch 2
      </BrowserRouter>
    </>
  );
}

export default App;
