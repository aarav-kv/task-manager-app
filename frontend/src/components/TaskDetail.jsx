import { useState } from "react";
import "../styles/taskdetail.css";
import TaskContext from "../context/TaskContext";
import { useContext } from "react";
import { SidebarContext } from "../context/SideBarContext";
const TaskDetail = ({ taskDetail, openTaskDetail }) => {
    const { userTheme } = useContext(SidebarContext)
    const { task, openTaskEditor, closeTaskEditor } = useContext(TaskContext);
    const [taskTitle, setTaskTitle] = useState('');

    return (
        <div className={`task-detail-container ${task !== null ? "open" : ""} ${userTheme}`}>
            <div className="task-title-wrapper">
                <span className="task-title">Edit:</span>
                <button onClick={() => { closeTaskEditor() }} className="close-button">&times;</button>
            </div>
            <div className="task-detail-wrapper">
                <input
                    type="text"
                    className="task-input"
                    value={taskTitle !== '' ? taskTitle : (task ? task.title : '')}
                    onChange={(e) => setTaskTitle(e.target.value)}
                />
                <textarea className="task-textarea" placeholder="Description" />

                <label>List</label>
                <select className="task-select">
                    <option>Personal</option>
                    <option>Work</option>
                </select>

                <label>Due date</label>
                <input type="date" className="task-date" value={""} />


                {/* <div className="subtasks-section">
                        <label>Subtasks:</label>
                        <button className="add-subtask">+ Add New Subtask</button>
                        {task.subtasks.map((subtask, index) => (
                            <div key={index} className="subtask-item">
                                <input type="checkbox" checked={subtask.completed} />
                                <span>{subtask.text}</span>
                            </div>
                        ))}
                    </div>
         */}
                <div className="task-actions">
                    <button className="delete-task">
                        <i className="fa-solid fa-trash"></i>
                        Delete </button>
                    <button className="save-task">
                        <i className="fa-solid fa-floppy-disk"></i>
                        Save
                    </button>
                </div>
            </div>

        </div>
    );
};

export default TaskDetail;
