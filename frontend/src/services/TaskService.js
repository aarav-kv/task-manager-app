import axios from "axios";

class TaskService {

    constructor() {
        // this.hostname = "https://todo-list-app-backend-tk2j.onrender.com"
        this.hostname = "http://localhost:5000"
        this.taskList = JSON.parse(localStorage.getItem("tasks")) || [];
    }

    async get(tabid, list_id) {
        if (tabid == "today") {
            const response = await axios.post(`${this.hostname}/tasks`);
            this.taskList = response.data;
            return response.data;
        }
        else if (tabid === "list") {
            const response = await axios.get(`${this.hostname}/getlist`);
            return response.data;
        }
        else if (tabid == "dashboard") {
            //This is used for dashboard
            console.log("inside tasklist")
            const response = await axios.get(`${this.hostname}/list`);
            return Object.values(response.data);
        } else if (tabid == 'tasklist') {
            const response = await axios.post(`${this.hostname}/task-list`, { list_id: list_id });
            return Object.values(response.data);
        }
    }

    async createListAndAddTask(task) {
        // const date = new Date();
        // console.log(task)
        const response = await axios.post(
            `${this.hostname}/createlistandtask`,
            { listname: task.list_name, task_name: task.title, priority: task.priority, due_date: task.due_date }
        )
        return response.data
    }

    async add_timer(task_id, date, start_time, end_time, description, is_running) {
        let data = { user_id: '6836450a0573505947469f34', date: date, task_id: task_id, start_time: start_time, end_time: end_time, description: description };
        console.log(data)
        const response = await axios.post(`${this.hostname}/clockify/start`,
            data
        )
        return response;
    }

    async stop_timer(id, start_time, end_time, description, is_running) {
        console.log(start_time)
        console.log(end_time)
        console.log(description);
        const response = await axios.post(`${this.hostname}/clockify/stop`,
            { user_id: '6836450a0573505947469f34', id: id, start_time: start_time, end_time: end_time, description: description, is_running }
        )
        return response;
    }

    async update_timer(id, end_time) {
        console.log(end_time)
        const response = await axios.post(`${this.hostname}/clockify/update`,
            { user_id: '6836450a0573505947469f34', id: id, end_time: end_time }
        )
        return response;
    }

    async get_user(username, password) {
        const response = await axios.post(`${this.hostname}/get-user`,
            { username: username, password: password }
        )
    }


    async addTask(task) {
        // this.taskList.push(task);
        // localStorage.setItem("tasks", JSON.stringify(this.taskList));
        console.log(task)
        const response = await axios.post(`${this.hostname}/addtask`, task)

        // Return the values get from server. not from the front end.
        // console.log(response);
        // return task;
    }

    async addList(task) {
        // this.taskList.push(task);
        // localStorage.setItem("tasks", JSON.stringify(this.taskList));
        console.log(task)
        const response = await axios.post(`${this.hostname}/addtask`, task)

        // Return the values get from server. not from the front end.
        // console.log(response);
        // return task;
    }

    async update(updatedTask) {
        this.taskList = this.taskList.map(task =>
            task.id === updatedTask.id ? updatedTask : task
        );
        localStorage.setItem("tasks", JSON.stringify(this.taskList));
        return updatedTask;
    }

    async delete(taskId) {
        this.taskList = this.taskList.filter(task => task.id !== taskId);
        localStorage.setItem("tasks", JSON.stringify(this.taskList));
    }
}

const Task = new TaskService();
export default Task;

