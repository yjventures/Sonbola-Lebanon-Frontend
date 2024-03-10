import './App.css'
import { RouterProvider } from 'react-router-dom'
import { routes } from './routes/routes'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { requestPermission, onMessageListener } from './firebase';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  const queryClient = new QueryClient()

  const [message, setmessage] = useState('')

  useEffect(() => {
    requestPermission()

    onMessageListener()
      .then(payload => {
        console.log('payload', payload)
        setmessage(message + 1)
      })
      .catch(err => console.log('failed: ', err))

  }, [])


  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        autoClose={4000}
        position="bottom-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <RouterProvider router={routes} />
    </QueryClientProvider>
  )
}

export default App
