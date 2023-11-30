import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Result } from './pages/Result';
import { ErrorPage } from './pages/Error';
import { Home } from './pages/Home';

function App() {
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/result' element={<Result />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
