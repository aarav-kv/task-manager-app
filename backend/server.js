const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const uri = "mongodb+srv://aaravkv13:aaravkv13@studing-cluster.ddfz2.mongodb.net/Todo?retryWrites=true&w=majority&appName=studing-cluster";
const app = express();
const PORT = 5000;

// Models
const Task = require('./models/Task');
const List = require('./models/List');

// Middleware
app.use(express.json());
app.use(cors());

// Connect MongoDB
mongoose.connect(uri)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));


// Import and use task routes
const taskRoutes = require('./routes/taskRoutes');
app.use('/', taskRoutes);

// Import and use clockify routes
const clockifyRoutes = require('./routes/clockifyRoutes');
app.use('/', clockifyRoutes);

//To get all the task using post.
app.post("/createlistandtask", async (req, res) => {
    try {
        const { listname, task_name, priority, due_date } = req.body;
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

app.get("/dashboard", async (req, res) => {
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


app.get("/totalcount", async (req, res) => {
    try {
        const now = new Date();
        const allTasks = await Task.find();

        const totalTasks = allTasks.length;
        const completedTasks = allTasks.filter(task => task.completed).length;
        const overdueTasks = allTasks.filter(task =>
            !task.completed && task.due_date && task.due_date < now
        ).length;
        const upcomingTasks = allTasks.filter(task =>
            !task.completed && task.due_date && task.due_date > now
        ).length;

        res.status(200).json({
            stats: {
                totalTasks,
                completedTasks,
                overdueTasks,
                upcomingTasks
            }
        });

    } catch (error) {
        console.error("Error in /totalcount:", error);
        res.status(500).json({ error: "Internal server error" });
    }
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

app.post('/list/delete', async function (req, res) {
    try {
        const { ids } = req.body;
        console.log(ids);

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'No IDs provided' });
        }

        // Delete lists
        const result = await List.deleteMany({ _id: { $in: ids } });

        // Delete tasks that belong to the deleted lists
        const taskResult = await Task.deleteMany({ list_id: { $in: ids } });

        res.json({
            message: 'Deleted successfully',
            deletedLists: result.deletedCount,
            deletedTasks: taskResult.deletedCount
        });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post("/listname", async function (req, res) {
    try {
        const { taskID } = req.body
        const task = await Task.findById(taskID).populate("list_id")
        res.status(200).json(task)
    } catch (error) {
        console.error('Error:', error);
    }
})

app.post('/list/add', async function (req, res) {
    try {
        const { list_name, list_icon } = req.body
        let list = new List({ list_name, list_icon });
        const result = await list.save()
        console.log(result)
        res.json(result);
    } catch (err) {
        console.error('List error:', err);
        res.status(500).json({ message: 'Server error' });
    }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
