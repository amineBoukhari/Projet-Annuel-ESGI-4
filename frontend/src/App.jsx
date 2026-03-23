import { BrowserRouter, Route, Routes } from 'react-router';
import Dashboard from './Pages/Dashboard';
import Layout from './Components/Layouts/Layout';
import Stocks from './Pages/Stocks';

function App() {
  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index path='/' element={<Dashboard />} />
          <Route index path='/stocks' element={<Stocks />} />
        </Route>
      </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
