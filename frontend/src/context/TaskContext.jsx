import { createContext, useState } from "react";
import { List, CalendarDays, FileCode2, Sprout, Dumbbell, Ham, Droplets, CodeSquare, Play, PenLine, Pause } from 'lucide-react'

const TaskContext = createContext();
export default TaskContext

export const TaskProvider = ({ children }) => {
    const [task, setTask] = useState(null);
    const [list, setList] = useState(null);
    const openTaskEditor = (task) => setTask(task);
    const closeTaskEditor = () => setTask(null);
    const [currentlyRunningTimer, setCurrentlyRunningTimer] = useState({})
    const openListEditor = (list) => setList(list);
    const closeListEditor = () => setList(null);

    const getListIcon = (icon) => {
        if (icon == 'default') {
            return <List className="icon" />
        } else if (icon == 'file') {
            return <FileCode2 fill="white" />
        } else if (icon == 'plant') {
            return <Sprout fill="green" stroke="green" />
        }
        else if (icon == 'dumbell') {
            return <Dumbbell fill="red" />
        }
        else if (icon == 'droplet') {
            return <Droplets fill="lightblue" />
        }
        else if (icon == 'meat') {
            return <Ham fill="#985824" />
        }
        else {
            return <List className="icon" />
        }
    }


    return (
        <TaskContext.Provider value={{
            task,
            list,
            openTaskEditor,
            closeTaskEditor,
            openListEditor,
            closeListEditor,
            getListIcon,
            setCurrentlyRunningTimer,
            currentlyRunningTimer,
            isTaskEditOpen: task !== null,
            isListEditOpen: list !== null,
        }}>
            {children}
        </TaskContext.Provider>
    );
};