import "../styles/Home.css";
import animationData from "../animations/animation.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import isMobileView from "../hooks/isMobileView";
import NavigationBar from '../components/NavigationBar.jsx';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth.js";

const Home = () => {
    const navigate = useNavigate();
    const isMobile = isMobileView();
    const { setSkippedLoggedIn, isAuthenticated } = useAuth()

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", width: "100vw" }}>
                <NavigationBar />
                <div className={`home-container ${isMobile ? "ismobile" : ""}`}>
                    <div className="background-img"></div>
                    <div className={`home-content`}>
                        <h1 className="title">
                            Manage you <span className="word-highlight">Task</span> <br />
                            and get more done
                        </h1>
                        <p className="subtitle">Plan, track, and manage your tasks efficiently.</p>
                        <Link to="/dashboard">
                            <button
                                className="cta-button"
                                onClick={() => {
                                    setSkippedLoggedIn(true);
                                }}
                            >
                                Get Started
                            </button>
                        </Link>
                        {
                            isMobileView() &&
                            <Link to="/signup" className="signin-btn">
                                <button>Sign In</button>
                            </Link>}
                    </div>

                    {/* Right Image Section */}
                    <div className="home-image">
                        <img src="/assets/3dart.png" />
                    </div>
                </div>
            </div >

        </>
    );
};

export default Home;
