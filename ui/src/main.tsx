import React from 'react'
import ReactDOM from "react-dom/client"
import {LocalToastProvider} from 'react-local-toast'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'
import All from './All'
import Difference from './Difference'
import './index.css'
import MySet from './MySet'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/">
            <Route path="" element={<MySet/>}/>
            <Route path="all" element={<All/>}/>
            <Route path="difference" element={<Difference/>}/>
        </Route>
    )
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
