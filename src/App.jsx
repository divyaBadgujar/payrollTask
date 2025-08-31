import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Toaster } from 'react-hot-toast'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </div>
    </>
  )
}

export default App
