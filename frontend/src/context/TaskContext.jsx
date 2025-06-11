import { createContext, useState } from "react";
const TaskContext = createContext();
export default TaskContext

export const TaskProvider = ({ children }) => {
    const [task, setTask] = useState(null);
    const [list, setList] = useState(null);

    const openTaskEditor = (task) => setTask(task);
    const closeTaskEditor = () => setTask(null);

    const openListEditor = (list) => setList(list);
    const closeListEditor = () => setList(null);

    return (
        <TaskContext.Provider value={{
            task,
            list,
            openTaskEditor,
            closeTaskEditor,
            openListEditor,
            closeListEditor,
            isTaskEditOpen: task !== null,
            isListEditOpen: list !== null,
        }}>
            {children}
        </TaskContext.Provider>
    );
};