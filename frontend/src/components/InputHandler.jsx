import { useState, useEffect, useContext, useRef } from "react";
import "../styles/InputHandler.css";
import MoreOption from "./MoreOption.jsx";
import { SidebarContext } from "../context/SideBarContext.jsx";
import AddButton from "./AddButton.jsx"
import Task from "../services/TaskService.js"
import { useMessage } from "../hooks/useMessage.js";
import { X } from "lucide-react";
const InputHandler = ({ pageName, toggle, date, addTaskToView, addTaskToListView }) => {
    const [taskData, setTaskData] = useState({ taskTitle: "" });
    const [clearSelection, setClearSelection] = useState(false);
    const { userTheme } = useContext(SidebarContext);
    let message = useMessage();

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            if (pageName == 'list') {
                addNewList();

            } else {
                addNewTask();
            }
        }
    };

    const setData = (data) => {
        setTaskData(prev => ({ ...prev, ...data }));
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "High":
                return "#ff5252"; // Red
            case "Medium":
                return "#ffc107"; // Yellow
            case "Low":
                return "#4caf50"; // Green
            default:
                return "#b7b7b7"; // Default gray
        }
    };
    const addNewList = async () => {
        console.log(pageName)
        console.log(taskData)
    }
    const addNewTask = async () => {
        const task = { title: taskData.taskTitle, description: '', completed: false, priority: taskData.priority, list_name: taskData.listName, due_date: taskData.date }
        if (task.title == '' && task.list_name == '') {
            if (pageName == 'list') {
                message.add('Please enter a list name.', message.TYPE.ERROR);
            } else {
                message.add('Please write a task before adding.', message.TYPE.ERROR);
            }
        } else {
            if (task.list_name == null || task.list_name == '') {
                // console.log("Adding task", task)
                Task.addTask(task);
                addTaskToView(task)
            } else {
                // console.log('Creating list and adding task in it')
                // console.log(task);
                let data = await Task.createListAndAddTask(task);
                addTaskToListView(data)
            }
            setTaskData({ taskTitle: "" });
            setClearSelection(true)
        }
    };

    return (
        <>
            <div className={`task-input-container ${userTheme} ${(toggle) ? 'active-task-input' : ''}`}>
                <input
                    type="text"
                    placeholder={pageName == "list" ? 'Add a list...' : 'Add a task...'}
                    value={taskData.taskTitle}
                    onChange={(event) => setTaskData((prev) => { return { ...prev, taskTitle: event.target.value }; })}
                    onKeyDown={handleKeyDown}
                    className="add-task-input"
                />

                <AddButton pageName={pageName} addNewTask={addNewTask} addNewList={addNewList} />
                <MoreOption pageName={pageName} setData={setData} onClear={() => { setClearSelection(false) }} clearSelection={clearSelection} />
            </div>
        </>
    );
};

export default InputHandler;