import { useState } from 'react';

const ListDashboard = ({ groupedTask, idx }) => {
    const [open, isOpen] = useState(false);
    return (
        <span className="taskcard-dashboard list" key={idx}>
            <span className="header">
                <i className="fa-solid fa-list-ul"></i>
                <label
                    style={{
                        margin: "0 10px",
                        fontSize: "13px",
                        width: "100%",
                        paddingBottom: "3px",
                    }}
                    onClick={() => { isOpen(prev => !prev) }}
                >
                    {groupedTask.list.name}
                </label>
                <i className={`fa-solid fa-angle-down ${open ? 'open' : ''}`}></i>
            </span>

            <span className={`listcontent ${open ? 'open' : ''}`}>
                {groupedTask.list.task && groupedTask.list.task.map((subtask) => (
                    <span className={`taskcard-dashboard ${subtask.priority}`} key={subtask._id}>
                        <span
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                                height: "30px",
                                lineHeight: "30px",
                            }}
                        >
                            <input
                                type="checkbox"
                                id={`cbx-${subtask._id}`}
                                checked={subtask.completed || false}
                                onChange={() => { /* handle complete toggle */ }}
                            />
                            <label
                                style={{
                                    margin: "0 10px",
                                    fontSize: "13px",
                                    width: "100%",
                                }}
                                className={subtask.completed ? "task-completed" : ""}
                                onClick={() => { /* handle click on subtask name */ }}
                            >
                                {subtask.name}
                            </label>
                        </span>
                    </span>
                ))}
            </span>
        </span>
    );
};

export default ListDashboard;

