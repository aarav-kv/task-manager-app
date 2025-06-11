import { useContext, useEffect, useState } from 'react';
import './App.css';
import NavigationBar from './components/NavigationBar.jsx';
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home.jsx"
import SignUp from "./pages/SignUp.jsx"
import { useAuth } from './hooks/useAuth.js';
import { Navigate } from "react-router-dom";
import { SidebarContext } from './context/SideBarContext.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Layout from './components/Layout.jsx';
import Calendar from './pages/Calendar.jsx'
import List from './pages/List.jsx'
import Today from './pages/Today.jsx'
import Clockify from './pages/Clockify.jsx'
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
function App() {
  // console.log(useAuth())
  const { isLoggedIn, isSkippedLoggedIn, setLoggedIn, setSkippedLoggedIn, logout } = useAuth()
  const isAuthenticated = (isLoggedIn || isSkippedLoggedIn) ? true : false;
  const { userTheme, toggleUserTheme } = useContext(SidebarContext)
  useEffect(() => {
    if (!isAuthenticated) {
      if (userTheme == "dark") {
        toggleUserTheme()
      }
    }
  })

  // console.log("aPp.jsx", isAuthenticated)

  return (
    <>
      <Routes>
        <Route path='/' element={
          isAuthenticated ? < Layout /> : <Home />
        }>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/clockify' element={<Clockify />} />
          <Route path='/calendar' element={<Calendar />} />
          <Route path='/list' element={<List />} />
          <Route path='/today' element={<Today />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
