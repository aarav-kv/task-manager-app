const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const uri = "mongodb+srv://aaravkv13:aaravkv13@studing-cluster.ddfz2.mongodb.net/Todo?retryWrites=true&w=majority&appName=studing-cluster";
const app = express();
const PORT = 5000;
const Task = require('./models/Task');
const List = require('./models/List');
const Clockify = require('./models/Clockify');
const User = require('./models/User')
app.use(express.json());
app.use(cors());

mongoose.connect(uri)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));

//To get all the task for body standalone and list
app.post("/tasks", async (req, res) => {
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

//To get all the task using post.
app.post("/createlistandtask", async (req, res) => {
    try {
        const { listname, task_name, priority, due_date } = req.body;
        console.log(req.body)
        let list = new List({ list_name: listname });
        await list.save()
        let task = null;
        if (task_name != '') {
            task = new Task({ user_id: '6836450a0573505947469f34', title: task_name, priority: priority, due_date: due_date, list_id: list._id });
            await task.save()
        }

        res.status(200).json({ task, list });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

app.get("/list", async (req, res) => {
    let lists = null;
    lists = await List.find();
    let listsWithTasks = await Promise.all(
        lists.map(async list => {
            if (list._id) {
                const listTasks = await Task.find({ list_id: list._id });
                return {
                    list: {
                        name: list.list_name,
                        list_icon: list.list_icon,
                        task: listTasks,
                    }
                };
            }

        })
    );
    const tasks = await Task.find({ list_id: null });
    listsWithTasks = { ...listsWithTasks, tasks: tasks };
    res.status(200).json(listsWithTasks);
});

app.get("/getlist", async (req, res) => {
    try {
        console.log('list getting');
        const lists = await List.find().lean();

        const newTaskList = await Promise.all(
            lists.map(async element => ({
                list_id: element._id,
                list_name: element.list_name,
                list_icon: element.list_icon || 'default',
                task: await Task.find({ list_id: element._id }).lean()
            }))
        );

        res.status(200).json(newTaskList);
    } catch (error) {
        console.error('Error in /getlist:', error);
        res.status(500).json({ message: "Server Error" });
    }
});

app.post("/task-list", async (req, res) => {
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


// app.post('/start-timer', async (req, res) => {
//     const { userId, taskId } = req.body;
//     await Clockify.updateMany({ userId, isRunning: true }, {
//         isRunning: false,
//         endTime: new Date()
//     });
//     const timer = new Timer({
//         userId,
//         taskId,
//         startTime: new Date(),
//         isRunning: true
//     });
//     await timer.save();
//     res.status(200).json({ success: true, timer });
// });


app.post("/clockify/start", async (req, res) => {
    try {
        console.log("starting clockify")

        const { id, user_id, task_id, start_time, end_time, start_date, end_date, description } = req.body;
        const data = { _id: id, user_id, task_id, start_time, end_time, start_date, end_date, description };
        console.log("inserting timer")
        console.log(data)

        const clockify = new Clockify(data);
        await clockify.save()
        res.status(200).json(clockify);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

app.post("/clockify/stop", async (req, res) => {
    try {
        console.log("stoping timer")
        const { id, start_time, end_time, description } = req.body;
        const data = { start_time, end_time, description, is_running: false };
        // 2. Update the specific clockify record
        const specificResult = await Clockify.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        );

        console.log(specificResult)

        res.status(200).json({
            message: "success",
            updatedRecord: specificResult
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});


app.get("/clockify/get", async (req, res) => {
    try {
        const data = await Clockify.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

app.post('/addtask', async (req, res) => {
    console.log("Inserting task....")
    const { title, description, date, list_id, due_date, priority, completed } = req.body;
    const taskVal = { user_id: '6836450a0573505947469f34', title, description, last_modified_date: date, list_id, due_date, priority, completed };
    console.log(taskVal)
    const task = new Task(taskVal);
    await task.save();
    res.json(task);
});

app.delete('/tasks', async (req, res) => {
    try {
        const { checkedTaskIds } = req.body; // Expect an array of IDs
        console.log("Deleting task....")
        await Task.deleteMany({ _id: { $in: checkedTaskIds } });
        res.json({ success: true, message: "Tasks deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting tasks" });
    }
});

app.put('/task', async (req, res) => {
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
