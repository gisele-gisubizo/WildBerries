import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Layout from './Components/Layout';
import PageDetails from './Components/ProductDetails'; 
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Layout wrapper */}
          <Route path='/' element={<Layout />}>
            
            {/* Home page */}
            <Route index element={<Home />} />

            {/* ✅ Page details route */}
            <Route path='/product/:id' element={<PageDetails />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
