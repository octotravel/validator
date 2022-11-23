import './App.css'
import { ValidationContext, useProductsContextValue } from './context/validationContext'
import { ReactElement } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeView from './views/homeView';

function App():ReactElement {
  const productContextValue = useProductsContextValue()
  return (
    <ValidationContext.Provider value={productContextValue}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeView />} />
        </Routes>
      </BrowserRouter>
    </ValidationContext.Provider>
  )
}

export default App
