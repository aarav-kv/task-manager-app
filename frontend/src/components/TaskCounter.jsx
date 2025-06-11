import { useState } from "react";

const TaskCounter = ({ count }) => {
    return (
        <>
            <span className="task-counter" > {count}</span>
        </>
    )
}

export default TaskCounter 