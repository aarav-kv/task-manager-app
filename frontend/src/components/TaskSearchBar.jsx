import { useEffect, useState, useContext } from "react";
import "../styles/TaskSearchBar.css";
import isMobileView from "../hooks/isMobileView";
import { SidebarContext } from "../context/SideBarContext";

const TaskSearchBar = ({ position }) => {
    const isViewMobile = isMobileView();
    const { isOpen, toggleUserTheme, userTheme, setActiveTab, activeTab } = useContext(SidebarContext)

    const [style, setStyle] = useState({
        left: "5px",
        top: "23px"
    })
    const [showInput, setShowInput] = useState(false);

    let content;
    if (!isViewMobile && position === "sidebar") {
        content = (
            <div className={`task-search-bar ${userTheme} `}>
                <div className="search-container">
                    <i className="fa-solid fa-magnifying-glass search-icon" style={style}></i>
                    <input type="text" placeholder="Search" />
                </div>
            </div>
        );
    } else if (isViewMobile && position === "navbar") {
        content = (
            <div className={`navbar-search ${showInput ? "active" : ""} ${userTheme}`} onClick={() => setShowInput(!showInput)}>

                <input
                    type="text"
                    className="search-input"
                    placeholder="Search task"
                    onClick={(e) => e.stopPropagation()} // Prevents triggering navbar-search click
                    onBlur={(e) => {
                        if (!e.relatedTarget || !e.relatedTarget.classList.contains("icon-container")) {
                            setShowInput(false);
                        }
                    }}
                />
                <span className="icon-container" style={{ width: "20px", height: "20px" }} >
                    <i className={`fa-solid ${showInput ? "fa-times" : "fa-magnifying-glass"} search-icon`}></i>
                </span>
            </div>
        );
    }

    return (
        <>
            {
                content
            }
        </>
    );
};

export default TaskSearchBar;
