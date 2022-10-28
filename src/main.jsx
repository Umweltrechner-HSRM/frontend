import React from 'react'
import ReactDOM from 'react-dom/client'
import {ChakraProvider} from '@chakra-ui/react'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import App from "./views/App.jsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />
    }
])


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ChakraProvider>
            <RouterProvider router={router} />
        </ChakraProvider>
    </React.StrictMode>,
)
