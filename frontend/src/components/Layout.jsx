
import { useEffect } from "react";
import NavigationBar from "./NavigationBar.jsx";
import SideBar from "./SideBar.jsx";
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import MessageHandler from "./MessageHandler.jsx";
const Layout = () => {

    return (
        <>
            <SideBar />
            <div className="main-view-container">
                <NavigationBar />
                <Outlet />
                <MessageHandler />
            </div>
        </>
    );
};

export default Layout;
