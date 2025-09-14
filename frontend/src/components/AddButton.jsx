import React, { useEffect, useState } from 'react';

const AddButton = ({ pageName, addNewTask, addNewList }) => {

    return (
        <>
            {
                <button className="add-btn" role="button" onClick={() => {
                    if (pageName == 'today' || pageName === 'tasklist') {
                        addNewTask()
                    } else {
                        addNewList()
                    }
                }
                }>
                    <span className="text">
                        {(pageName == 'calendar' || pageName == 'today' || pageName === 'tasklist') ?
                            'Add task' : 'Add list'}
                    </span>
                </button >
            }
        </>
    );
};

export default AddButton;