import Task from "../services/TaskService.js";
class TimerUtility {

    constructor() {
        if (TimerUtility.instance) {
            return TimerUtility.instance;
        }
        TimerUtility.instance = this;
    }

    init(setCurrentlyRunningTimer, timer) {
        this.elapsedTime = 0;
        this.setCurrentlyRunningTimer = setCurrentlyRunningTimer;
        this.paused = timer ? timer.is_paused : false;
        const today = new Date();
        this.currentTime = today.toLocaleTimeString('en-GB', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
        this.currentDate = today.toLocaleDateString('en-CA');
        this.addedToDb = false;
        this.startTime = "00:00:00";
        this.endTime = "00:00:00";
    }

    toSeconds(timeStr) {
        const [h, m, s] = timeStr.split(':').map(Number);
        return h * 3600 + m * 60 + s;
    }

    fromSeconds(totalSeconds) {
        const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const s = String(totalSeconds % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    }


    formatDate(inputDate) {
        const date = new Date(inputDate);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear().toString().slice(-2);
        return `${day}/${month}/${year}`;
    }

    getStartTime() {
        return this.startTime;
    }

    getEndTime() {
        return this.endTime;
    }

    getElapsedTime() {
        if (!this.timerStartedAt) {
            this.timerStartedAt = new Date()
        }
        return this.fromSeconds(this.elapsedTime)
    }

    incrementElapsedTime() {
        this.elapsedTime = this.elapsedTime + 1
    }

    setTimerPause(value) {
        this.paused = value
    }

    setElapsedTime(time) {
        this.elapsedTime = time;
    }
    setStartTime(startTime, endTime) {
        this.startTime = startTime;

        const startValSeconds = this.toSeconds(startTime);
        const endValSeconds = this.toSeconds(endTime);

        let elapsedSeconds = 0;
        // console.log(this.fromSeconds(startValSeconds))
        // console.log(this.fromSeconds(endValSeconds))
        if (startValSeconds > endValSeconds) {
            // crosses midnight
            elapsedSeconds = (86400 - startValSeconds) + endValSeconds;
        } else {
            elapsedSeconds = endValSeconds - startValSeconds;
        }
        this.elapsedTime = elapsedSeconds;
    }

    setEndTime(startTime, endTime) {
        this.endTime = endTime;

        const startValSeconds = this.toSeconds(startTime);
        const endValSeconds = this.toSeconds(endTime);

        let elapsedSeconds = 0;

        if (startValSeconds > endValSeconds) {
            elapsedSeconds = (86400 - startValSeconds) + endValSeconds;
        } else {
            elapsedSeconds = endValSeconds - startValSeconds;
        }

        this.elapsedTime = elapsedSeconds;
    }

    async startTimer(taskID, uniqueID, startTime = null, endTime = null, selectedDate = null, addedToDb = false) {
        // If both start and end time are '00:00:00'
        const diff = (this.toSeconds(endTime) - this.toSeconds(startTime));
        if (diff == 0) {
            if (startTime === '00:00:00' && endTime === '00:00:00') {
                if (this.currentTime !== '00:00:00') {
                    this.startTime = this.currentTime;
                    this.endTime = this.currentTime;
                }
            }
            // If specific time is passed
            else if (startTime && endTime) {
                this.startTime = startTime;
                this.endTime = endTime;
            }

            // Create Date objects using current date
            const startDateTime = new Date(`${this.currentDate}T${this.startTime}`);
            let endDateTime = new Date(`${this.currentDate}T${this.endTime}`);

            if (endDateTime < startDateTime) {
                endDateTime.setDate(endDateTime.getDate() + 1); // add 1 day if crossing midnight
            }

            // Calculate elapsed seconds
            this.elapsedTime = Math.floor((endDateTime - startDateTime) / 1000);
        } else {
            this.elapsedTime = diff;
        }

        // Safety check
        if (this.elapsedTime === 0 && this.toSeconds(this.currentTime) !== 0) {
            this.elapsedTime = 0;
        }


        this.paused = false;
        if (!addedToDb) {
            const result = await Task.add_timer(
                taskID,
                uniqueID,
                selectedDate,
                this.startTime,
                null,
                this.endTime,
                null,
                null
            );
            this.addedToDb = true;
            return result;
        }

        return true;
    }

    async Run(TimerID = null, TaskID = null) {
        var data = {};
        var temp = null;

        if (localStorage.getItem("timer") != null) {
            temp = JSON.parse(localStorage.getItem("timer"))
            var storedStop = temp.timerStoppedAt;
            var storedElapsed = temp.formatedElapsedTime ? this.toSeconds(temp.formatedElapsedTime) : 0;
            var prevElapsed = 0;

            const stopTimestamp = parseInt(storedStop || "0");
            const savedElapsed = parseInt(storedElapsed);
            const now = Date.now();
            const additionalElapsed = Math.floor((now - stopTimestamp) / 1000);
            prevElapsed = savedElapsed + additionalElapsed;
            this.setElapsedTime(prevElapsed);
        }

        if (typeof this.elapsedTime !== 'number') {
            this.elapsedTime = 0;
        }
        if (!this.intervalID) {
            data = {
                id: TimerID,
                taskID: TaskID,
                paused: this.paused,
                initialElapsedTimer: this.toSeconds(this.getDifference(this.startTime, this.endTime)),
                start_time: this.startTime,
                end_time: this.endTime,
            };

            this.intervalID = setInterval(() => {
                if (!this.paused) {
                    this.incrementElapsedTime()
                    data.formatedElapsedTime = this.fromSeconds(this.elapsedTime);
                    data.timerStoppedAt = Date.now().toString();
                    this.setCurrentlyRunningTimer({ ...data });
                    localStorage.setItem('timer', JSON.stringify(data));
                }
            }, 1000);

        }
    }


    async stopTimer(id) {
        console.log("stoping Timer Frontend")
        var temp = JSON.parse(localStorage.getItem("timer"))
        const currentElapsedStopedInSec = parseInt(this.toSeconds(temp.formatedElapsedTime))
        const initialElapsedTime = parseInt(temp.initialElapsedTimer)
        const currentElapsedStopedAtInDate = parseInt(temp.timerStartedAt)


        const stoppedAt = new Date();
        const diffInSeconds = currentElapsedStopedInSec - initialElapsedTime;

        // Convert original endTime to seconds
        const endTimeInSeconds = this.toSeconds(this.endTime);

        // Add the difference
        const newEndTimeInSeconds = endTimeInSeconds + diffInSeconds;
        // const newEndTimeInSeconds = endTimeInSeconds + currentElapsedStopedInSec;

        // Update the endTime with formatted string
        this.endTime = this.fromSeconds(newEndTimeInSeconds);

        // Now safely use the correct value
        const res = await Task.stop_timer(
            '6836450a0573505947469f34',
            id,
            this.startTime,
            this.endTime,
            null,
            this.elapsedTime
        );


        // Reset internal state
        this.startTime = '00:00:00';
        this.endTime = '00:00:00';
        this.elapsedTime = 0;
        this.addedToDb = false;
        clearInterval(temp.intervalID)
        localStorage.removeItem("timer")
        return res; // ✅ Returns the actual result to the caller

    }

    async deleteTimer(timerID) {
        const res = await Task.delete_timer(
            timerID
        );
    }

    async togglePauseTimer(uniqueID, isPaused) {

        console.log("pausing Timer Frontend")
        if (!this.timerStartedAt) {
            this.timerStartedAt = new Date()
        }

        if (isPaused) {
            const stoppedAt = new Date();
            const diffInSeconds = Math.floor((stoppedAt - this.timerStartedAt) / 1000);

            // Convert original endTime to seconds
            const endTimeInSeconds = this.toSeconds(this.endTime);

            // Add the difference
            const newEndTimeInSeconds = endTimeInSeconds + (diffInSeconds - 1);

            // Update the endTime with formatted string
            this.endTime = this.fromSeconds(newEndTimeInSeconds);
        } else {
            this.timerStartedAt = new Date();
        }
        this.paused = isPaused;
        if (localStorage.getItem("timer") != null) {
            var temp = JSON.parse(localStorage.getItem("timer"))
            temp.paused = this.paused;
            this.setCurrentlyRunningTimer({ ...temp });
            localStorage.setItem('timer', JSON.stringify(temp));
        }
        // Now safely use the correct value
        await Task.pause_timer('6836450a0573505947469f34', uniqueID, this.startTime, this.endTime, null, isPaused);
        return true;
    }



    getDifference(start, end) {
        let startSec = this.toSeconds(start);
        let endSec = this.toSeconds(end);
        let diff = endSec - startSec;
        return this.fromSeconds(diff);
    }

    isValidTime = (time) => {
        return /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(time);
    };

    formatDateToDDMMYY(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = String(date.getFullYear()).slice(-2); // Get last 2 digits
        return `${day}/${month}/${year}`;
    }
}
const timerUtility = new TimerUtility();
export default timerUtility;