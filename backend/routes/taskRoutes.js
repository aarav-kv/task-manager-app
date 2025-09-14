const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/Task');


router.post('/addtask', async (req, res) => {
    console.log("Inserting task....")
    const { title, description, date, list_id, due_date, priority, completed } = req.body;
    const taskVal = { user_id: '6836450a0573505947469f34', title, description, last_modified_date: date, list_id, due_date, priority, completed };
    // console.log(taskVal)
    const task = new Task(taskVal);
    await task.save();
    res.json(task);
});

router.delete('/tasks', async (req, res) => {
    try {
        const { checkedTaskIds } = req.body; // Expect an array of IDs
        console.log("Deleting task....")
        await Task.deleteMany({ _id: { $in: checkedTaskIds } });
        res.json({ success: true, message: "Tasks deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting tasks" });
    }
});

router.put('/task', async (req, res) => {
    console.log("updating task details..")
    const taskData = req.body.data;
    const { _id, taskName, edited } = taskData;
    try {
        const updatedTask = await Task.updateOne({ _id: _id }, { name: taskName }, { new: true });
        console.log(updatedTask)
        res.json({ success: updatedTask.acknowledged });

        console.log("updating task completed..")
    } catch (error) {
        res.status(500).json({ success: false });
        console.error("Error updating task:", error);
    }
})


router.post("/task-list", async (req, res) => {
    try {
        const { list_id } = req.body;
        const result = await Task.aggregate([
            {
                $lookup: {
                    from: "clockify",
                    localField: "_id",
                    foreignField: "task_id",
                    as: "clockify"
                }
            },
            {
                $match: {
                    list_id: new mongoose.Types.ObjectId(list_id)
                }
            }
        ]);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in /task-list:', error);
        res.status(500).json({ message: "Server Error" });
    }
});


//To get all the task for body standalone and list
router.post("/tasks", async (req, res) => {
    try {
        const { listid } = req.body;
        console.log(listid)
        let tasks = null;
        if (listid == null) {
            console.log('if')
            tasks = await Task.find();

        } else {
            console.log('inside')
            tasks = await Task.find({ listid: new mongoose.Types.ObjectId(listid) });
        }
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});



module.exports = router;