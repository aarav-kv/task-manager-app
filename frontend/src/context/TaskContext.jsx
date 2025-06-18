import { createContext, useState } from "react";
import { List, CalendarDays, FileCode2, Sprout, Dumbbell, Ham, Droplets, CodeSquare, Play, PenLine, Pause } from 'lucide-react'

const TaskContext = createContext();
export default TaskContext

export const TaskProvider = ({ children }) => {
    const [task, setTask] = useState(null);
    const [list, setList] = useState(null);

    const openTaskEditor = (task) => setTask(task);
    const closeTaskEditor = () => setTask(null);

    const openListEditor = (list) => setList(list);
    const closeListEditor = () => setList(null);

    const getListIcon = (icon) => {
        if (icon == 'default') {
            return <List className="icon" />
        } else if (icon == 'FileCode2') {

        } else if (icon == 'Sprout') {

        }
        else if (icon == 'Dumbbell') {

        }
        else if (icon == 'Droplets') {

        }
        else if (icon == 'Ham') {

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
            isTaskEditOpen: task !== null,
            isListEditOpen: list !== null,
        }}>
            {children}
        </TaskContext.Provider>
    );
};