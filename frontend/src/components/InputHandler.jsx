import { useState, useEffect, useContext, useRef } from "react";
import "../styles/InputHandler.css";
import MoreOption from "./MoreOption.jsx";
import { SidebarContext } from "../context/SideBarContext.jsx";
import AddButton from "./AddButton.jsx"
import Task from "../services/TaskService.js"
import { useMessage } from "../hooks/useMessage.js";
import { X } from "lucide-react";
const InputHandler = ({ pageName, toggle, date, addTaskToView, addTaskToListView, addListView, activeListID }) => {
    const [data, setData] = useState({ taskTitle: "" });
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

    const handleData = (data) => {
        setData(prev => ({ ...prev, ...data }));
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
        const list = { list_name: data.taskTitle, list_icon: data.listIcon == "" ? "defualt" : data.listIcon }
        if (list.list_name == '') {
            message.add('Please enter a list name.', message.TYPE.ERROR);
        } else {
            setData({ taskTitle: "" })
            Task.add_list(list).then((res) => {
                addListView(res.data)
            })
        }
    }
    const addNewTask = async () => {
        const task = { title: data.taskTitle, description: '', completed: false, priority: data.priority, list_name: data.listName, due_date: data.date, list_id: activeListID }
        if (!task.title?.trim()) {
            message.add('Task title cannot be empty', message.TYPE.ERROR);
            return;
        } else {
            if (task.list_name == null || task.list_name == '') {
                // console.log("Adding task", task)
                Task.addTask(task).then((res) => {
                    addTaskToView(res.data)
                })
            } else {
                // console.log('Creating list and adding task in it')
                // console.log(task);
                Task.createListAndAddTask(task).then((res) => {
                    addTaskToListView(res)
                })
            }
            setData({ taskTitle: "" });
            setClearSelection(true)
        }
    };

    return (
        <>
            <div className={`task-input-container ${userTheme} ${(toggle) ? 'active-task-input' : ''}`}>
                <input
                    type="text"
                    placeholder={pageName == "list" ? 'Add a list...' : 'Add a task...'}
                    value={data.taskTitle}
                    onChange={(event) => setData((prev) => { return { ...prev, taskTitle: event.target.value }; })}
                    onKeyDown={handleKeyDown}
                    className="add-task-input"
                />

                <AddButton pageName={pageName} addNewTask={addNewTask} addNewList={addNewList} />
                <MoreOption pageName={pageName} handleData={handleData} onClear={() => { setClearSelection(false) }} clearSelection={clearSelection} />
            </div>
        </>
    );
};

export default InputHandler;