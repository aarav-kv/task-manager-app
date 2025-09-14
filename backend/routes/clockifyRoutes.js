const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Clockify = require('../models/Clockify');
const List = require('../models/List');
const Task = require('../models/Task');
router.post("/clockify/start", async (req, res) => {
    try {
        console.log("starting clockify")
        console.log(req.body)

        const { user_id, task_id, start_time, end_time, description, is_active } = req.body;
        const data = { user_id, task_id, start_time, end_time, description, is_active };

        const clockify = new Clockify(data);
        await clockify.save()
        res.status(200).json(clockify);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.post("/clockify/pause", async (req, res) => {
    try {
        console.log("pausing timer")
        const { id, start_time, end_time, description, is_paused } = req.body;

        const specificUpdate = await Clockify.findByIdAndUpdate(
            id,
            {
                $set: {
                    start_time,
                    end_time,
                    description,
                    is_paused,
                }
            },
            { new: true }
        );

        res.status(200).json({
            message: "success",
            updatedRecord: specificUpdate
        })
    } catch (ex) {
        console.error("Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
})

router.post("/clockify/stop", async (req, res) => {
    try {
        console.log("stop timer")
        const { id, start_time, end_time, description, elapsed_time } = req.body;

        const updateFields = {
            start_time,
            end_time,
            description,
            is_active: false,
            is_paused: true,
            elapsed_time: elapsed_time
        };

        // console.log(updateFields);

        const specificUpdate = await Clockify.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        );

        res.status(200).json({
            message: "Timer stopped and record updated",
            updatedRecord: specificUpdate
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.post("/clockify/delete", async (req, res) => {
    try {
        console.log("delete timer");
        const { timerID } = req.body; // `id` is the timer ID (_id of the document)

        const specificDelete = await Clockify.deleteOne({ _id: timerID });

        res.status(200).json({
            message: "success",
            deletedCount: specificDelete.deletedCount,
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get("/clockify/get", async (req, res) => {
    try {
        const data = await Clockify.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});


router.get("/clockify/tasks", async (req, res) => {
    try {
        const tasks = await Task.aggregate([
            {
                $lookup: {
                    from: "clockify",
                    localField: "_id",
                    foreignField: "task_id",
                    as: "clockifyData"
                }
            },
            {
                $match: {
                    "clockifyData.0": { $exists: true } // only tasks with clockify
                }
            },
            {
                $lookup: {
                    from: "lists",              // collection name (pluralized by mongoose)
                    localField: "list_id",
                    foreignField: "_id",
                    as: "listData"
                }
            },
            {
                $unwind: {
                    path: "$listData",
                    preserveNullAndEmptyArrays: true // in case some tasks don’t have a list
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    completed: 1,
                    priority: 1,
                    due_date: 1,
                    clockifyData: 1,
                    list_name: "$listData.list_name", // include list name
                    list_icon: "$listData.list_icon"
                }
            }
        ]);

        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});


module.exports = router