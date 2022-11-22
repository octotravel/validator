import './App.css'
import HomeView from './views/homeView'
import { ValidationContext, useProductsContextValue } from './context/validationContext'
import { ReactElement } from 'react'

function App():ReactElement {
  const productContextValue = useProductsContextValue()
  return (
    <ValidationContext.Provider value={productContextValue}>
      <HomeView />
    </ValidationContext.Provider>
  )
}

export default App
