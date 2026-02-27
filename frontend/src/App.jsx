import { BrowserRouter, Route, Routes } from 'react-router'
import Dashboard from './Pages/Dashboard'

function App() {

  return (
    <div>
     <BrowserRouter>
      <Routes>
        <Route index path='/' element={<Dashboard />} />
      </Routes>
     </BrowserRouter>
    </div>
  )
}

export default App
