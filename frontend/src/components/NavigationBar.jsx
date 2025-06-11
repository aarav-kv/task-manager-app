import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NavigationBar.css";
import CustomHamburger from "./CustomHamburger.jsx";
import { useGreeting } from "../hooks/useGreetingService.js";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import isMobileView from "../hooks/isMobileView.js";
import { SidebarContext } from "../context/SideBarContext.jsx";
import { List, CalendarDays, FileCode2, Sprout, Dumbbell, Ham, Droplets, ListTodo, House, ChartLine, Hourglass, ChevronLeft, Search, UserPlus, Bell } from 'lucide-react';
import TaskContext from "../context/TaskContext.jsx";
import InviteMemberModal from "./InviteMemberModal.jsx";

const NavigationBar = () => {
    const { isAuthenticated } = useAuth();
    const { message, icon } = useGreeting();
    const [hasNotification, setHasNotification] = useState(false)
    const { userTheme, activeTab, nav, setNav, pageName, setPageName, setActiveTab } = useContext(SidebarContext);
    const navigate = useNavigate();
    const { closeTaskEditor, closeListEditor, isTaskEditOpen, isListEditOpen } = useContext(TaskContext);

    // New state for search and invite modal
    const [searchQuery, setSearchQuery] = useState('');
    const [showInviteModal, setShowInviteModal] = useState(false);

    let capitalized = '';

    if (nav.title != null) {
        capitalized = nav.title
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    } else {
        capitalized = "Today"
    }

    const getIcon = () => {
        if (nav.icon && nav.icon !== '') {
            switch (nav.icon) {
                case 'list':
                    return <List className="navTitleIcon" />;
                case 'calendardays':
                    return <CalendarDays className="navTitleIcon" />;
                case 'filecode2':
                    return <FileCode2 className="navTitleIcon" />;
                case 'sprout':
                    return <Sprout className="navTitleIcon" />;
                case 'dumbbell':
                    return <Dumbbell className="navTitleIcon" />;
                case 'ham':
                    return <Ham className="navTitleIcon" />;
                case 'droplets':
                    return <Droplets className="navTitleIcon" />;
                default:
                    return <List className="icon" />;
            }
        } else {
            switch (nav.title.toLowerCase()) {
                case 'today':
                    return <House className="navTitleIcon" />;
                case 'list':
                    return <ListTodo className="navTitleIcon" />;
                case 'dashboard':
                    return <ChartLine className="navTitleIcon" />;
                case 'calendar':
                    return <CalendarDays className="navTitleIcon" />;
                case 'clockify':
                    return <Hourglass className="navTitleIcon" />;
                default:
                    return null;
            }
        }
    };

    const paddingLeftZero = { paddingLeft: '0px' };
    const paddingLeftFifty = { paddingLeft: '50px' };

    const goBack = () => {
        setPageName("list");
        setActiveTab("list");
        setNav({ title: "List" });
        closeTaskEditor();
        closeListEditor();
        navigate("/list");
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        // Implement search functionality here
        // You can add debouncing or call search API
    };

    const handleInviteMember = () => {
        setShowInviteModal(true);
    };

    return (
        <>
            {isAuthenticated && <CustomHamburger />}
            <div className={`nav-container  ${!isAuthenticated ? "home" : ""}  ${userTheme}`} style={(pageName == "tasklist") ? paddingLeftZero : paddingLeftFifty}>
                {!isAuthenticated ? (
                    <div className="nav-login">
                        <div className="title-icon">
                            <img src="/assets/ToDo_icon.png" style={{ width: "22px", height: "22px", marginRight: "15px", marginTop: "-3px", transform: "scale(0.9, 0.7)" }} />
                            <span style={{ fontSize: "25px", fontWeight: "700", marginTop: "-5px", color: "#191919" }}>Task Manager</span>
                        </div>
                        {!isMobileView() &&
                            <Link to="/signup" className="signin-btn">
                                <button>Sign In</button>
                            </Link>}
                    </div>
                ) : (
                    <>

                        <div className="nav-left-section">
                            {(pageName === 'tasklist') && (
                                <span className="nav-back-btn-container">
                                    <ChevronLeft className="back-btn" onClick={goBack} />
                                </span>
                            )}
                            <div>
                                {getIcon()}
                            </div>
                            <div className="nav-title-wrapper" >
                                <span className="nav-title" style={(pageName == "tasklist") ? { color: "gray", fontSize: "20px" } : {}}>{capitalized}</span>
                            </div>
                        </div>
                        <div className="nav-center-section">
                            <div className="search-container">
                                <Search className="search-icon" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search tasks, lists..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="search-input"
                                />
                            </div>
                        </div>

                        <div className="nav-right-section">
                            {
                                (pageName == "tasklist") &&
                                <button
                                    className="invite-btn"
                                    onClick={handleInviteMember}
                                    title="Invite Member"
                                >
                                    <UserPlus size={18} />
                                    <span>Invite</span>
                                </button>
                            }

                            <div className="bell-wrapper">
                                <Bell className="bell-icon" />
                                {hasNotification && <span className="bell-notification-dot"></span>}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Invite Member Modal */}
            {showInviteModal && (
                <InviteMemberModal
                    isOpen={showInviteModal}
                    onClose={() => setShowInviteModal(false)}
                />
            )}
        </>
    );
};

export default NavigationBar;