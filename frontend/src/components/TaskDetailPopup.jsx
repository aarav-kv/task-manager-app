
import { DeleteIcon, TrashIcon, X } from "lucide-react";
import { useState, useEffect } from "react";
import "../styles/taskdetail.css"
const TaskDetailPopup = ({ isOpen, onClose, task, userTheme = "" }) => {
    const [taskTitle, setTaskTitle] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 350);
            return () => clearTimeout(timer);
        }
        console.log(isOpen)
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <div className={`popup-overlay ${isOpen ? 'open' : ''}`}>
            <div className={`task-detail-container ${isOpen ? 'open' : ''} ${userTheme}`}>
                <div className="task-header">
                    <h2 className="task-title">Edit Task</h2>
                    <div className="header-spacer"></div>
                    <div className="traffic-lights">
                        <div className="traffic-light close" onClick={onClose}><X /></div>
                    </div>
                </div>

                <div className="task-content">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            className="task-input"
                            placeholder="Task title"
                            value={taskTitle !== '' ? taskTitle : (task ? task.title : '')}
                            onChange={(e) => setTaskTitle(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            className="task-textarea"
                            placeholder="Add a description..."
                            rows="4"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>List</label>
                            <div className="select-wrapper">
                                <select className="task-select">
                                    <option>📋 Personal</option>
                                    <option>💼 Work</option>
                                    <option>🏠 Home</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group half">
                            <label>Due Date</label>
                            <input type="date" className="task-date" value="2025-09-18" />
                        </div>
                    </div>

                    <div className="priority-section">
                        <label>Priority</label>
                        <div className="priority-buttons">
                            <button className="priority-btn low">Low</button>
                            <button className="priority-btn medium active">Medium</button>
                            <button className="priority-btn high">High</button>
                        </div>
                    </div>
                </div>

                <div className="task-footer">
                    <button className="action-btn delete">
                        <span className="btn-icon"><TrashIcon /></span>
                        Delete Task
                    </button>
                    <div className="primary-actions">
                        <button className="action-btn secondary">Cancel</button>
                        <button className="action-btn primary">Save Task</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailPopup;