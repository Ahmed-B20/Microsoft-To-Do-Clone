<template>
    <div v-if="date === 'customDate'" @click="remindDueDate(date)">
        <template v-if="pickCustomRemindDate">
            <img @click="addCustomRemindDate" src="@/assets/design-material/icons/plus.png" alt="add custom date">
            <input :class="{ error: errorCustomRemindDateToggle }" class="custom-date" v-model="pickedCustomRemindDate"
                type="datetime-local" name="" id="">
        </template>

        <template v-else>
            <img src="@/assets/design-material/icons/custom-remind-date.png" alt="pick a date">
            <span>Pick a date and time</span>
        </template>
    </div>

    <div v-else @click="remindDueDate(date)">
        <img src="@/assets/design-material/icons/remind-today.png" alt="due date">
        <span>{{ dueDate }}</span>
    </div>
</template>

<script>
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'RemindDueDate',
    props: ['descriptionTaskList', 'descriptionTaskChildList', 'descriptionTaskIndex', 'taskIndex', 'date'],
    data() {
        return {
            pickedCustomRemindDate: null,
            errorCustomRemindDateToggle: false,
            pickCustomRemindDate: false,
            dueDate: '',
            time: '',
            hours: '',
            minutes: '',
            ampm: '',
            strTime: ''
        }
    },
    beforeMount() {
        switch (this.date) {
            case 'toDay':
                this.dueDate = 'Later today'
                break;

            case 'tomorrow':
                this.dueDate = 'Tomorrow'
                break;
            case 'nextWeek':
                this.dueDate = 'Next Week'
                break;
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists', 'smartList']),
        ...mapWritableState(allLists, ['lists', 'smartList']),
    },
    methods: {
        remindDueDate(date) {
            if (!!this.descriptionTaskChildList) {
                if (date === 'toDay') {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMe = 'toDay'
                    let time = new Date(new Date().setDate(new Date().getDate()) + 2 * 60 * 60 * 1000)
                    let hours = time.getHours()
                    let minutes = time.getMinutes()
                    let ampm = hours >= 12 ? 'pm' : 'am';
                    hours = hours % 12;
                    hours = hours ? hours : 12;
                    minutes = minutes < 10 ? '0' + minutes : minutes;
                    let strTime = hours + ':' + minutes + ' ' + ampm;

                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMeDate = time
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMeName = `toDay at ${strTime}`
                    this.$emit('componentEvent', false)
                    this.sendMessage(time)
                } else if (date === 'tomorrow') {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMe = 'tomorrow'
                    let time = new Date(new Date().setDate(new Date().getDate() + 1) + 2 * 60 * 60 * 1000)
                    let hours = time.getHours()
                    let minutes = time.getMinutes()
                    let ampm = hours >= 12 ? 'pm' : 'am';
                    hours = hours % 12;
                    hours = hours ? hours : 12;
                    minutes = minutes < 10 ? '0' + minutes : minutes;
                    let strTime = hours + ':' + minutes + ' ' + ampm;

                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMeDate = time
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMeName = `tomorrow at ${strTime}`
                    this.$emit('componentEvent', false)
                    this.sendMessage(time)
                } else if (date === 'nextWeek') {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMe = 'nextWeek'
                    let time = new Date(new Date().setDate(new Date().getDate() + 7) + 2 * 60 * 60 * 1000)
                    let hours = time.getHours()
                    let minutes = time.getMinutes()
                    let ampm = hours >= 12 ? 'pm' : 'am';
                    hours = hours % 12;
                    hours = hours ? hours : 12;
                    minutes = minutes < 10 ? '0' + minutes : minutes;
                    let strTime = hours + ':' + minutes + ' ' + ampm;

                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMeDate = time
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMeName = `${time.toDateString().slice(0, 10)} at ${strTime}`
                    this.$emit('componentEvent', false)
                    this.sendMessage(time)
                } else if (date === 'customDate') {
                    this.pickCustomRemindDate = true
                }
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            } else {
                if (date === 'toDay') {
                    let time = new Date(new Date().setDate(new Date().getDate()) + 2 * 60 * 60 * 1000)
                    let hours = time.getHours()
                    let minutes = time.getMinutes()
                    let ampm = hours >= 12 ? 'pm' : 'am';
                    hours = hours % 12;
                    hours = hours ? hours : 12;
                    minutes = minutes < 10 ? '0' + minutes : minutes;
                    let strTime = hours + ':' + minutes + ' ' + ampm;

                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMe = 'toDay'
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMeDate = time
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMeName = `toDay at ${strTime}`
                    this.$emit('componentEvent', false)
                    this.$emit('test', false)

                    this.sendMessage(time)
                } else if (date === 'tomorrow') {
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMe = 'tomorrow'
                    let time = new Date(new Date().setDate(new Date().getDate() + 1) + 2 * 60 * 60 * 1000)
                    let hours = time.getHours()
                    let minutes = time.getMinutes()
                    let ampm = hours >= 12 ? 'pm' : 'am';
                    hours = hours % 12;
                    hours = hours ? hours : 12;
                    minutes = minutes < 10 ? '0' + minutes : minutes;
                    let strTime = hours + ':' + minutes + ' ' + ampm;
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMeDate = time
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMeName = `tomorrow at ${strTime}`
                    this.$emit('componentEvent', false)
                    this.sendMessage(time)
                } else if (date === 'nextWeek') {
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMe = 'nextWeek'
                    let time = new Date(new Date().setDate(new Date().getDate() + 7) + 2 * 60 * 60 * 1000)
                    let hours = time.getHours()
                    let minutes = time.getMinutes()
                    let ampm = hours >= 12 ? 'pm' : 'am';
                    hours = hours % 12;
                    hours = hours ? hours : 12;
                    minutes = minutes < 10 ? '0' + minutes : minutes;
                    let strTime = hours + ':' + minutes + ' ' + ampm;

                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMeDate = time
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMeName = `${time.toDateString().slice(0, 10)} at ${strTime}`
                    this.$emit('componentEvent', false)
                    this.sendMessage(time)
                } else if (date === 'customDate') {
                    this.pickCustomRemindDate = true
                }
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            }
        },
        sendMessage(time) {
            const worker = new Worker('../src/worker.js')
            worker.postMessage(time)
            worker.onmessage = (time) => {
                this.$emit('componentEvent', true)
            }
        },
        addCustomRemindDate() {
            if (!!this.pickedCustomRemindDate) {
                if (!!this.descriptionTaskChildList) {
                    let time = new Date(this.pickedCustomRemindDate)
                    let hours = time.getHours()
                    let minutes = time.getMinutes()
                    let ampm = hours >= 12 ? 'pm' : 'am';
                    hours = hours % 12;
                    hours = hours ? hours : 12;
                    minutes = minutes < 10 ? '0' + minutes : minutes;
                    let strTime = hours + ':' + minutes + ' ' + ampm;

                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMe = 'CustomDate'
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMeDate = time
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMeName = `${time.toDateString().slice(0, 10)} at ${strTime}`

                    this.sendMessage(time)
                    localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                } else {
                    let time = new Date(this.pickedCustomRemindDate)
                    let hours = time.getHours()
                    let minutes = time.getMinutes()
                    let ampm = hours >= 12 ? 'pm' : 'am';
                    hours = hours % 12;
                    hours = hours ? hours : 12;
                    minutes = minutes < 10 ? '0' + minutes : minutes;
                    let strTime = hours + ':' + minutes + ' ' + ampm;

                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMe = 'CustomDate'
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMeDate = time
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMeName = `${time.toDateString().slice(0, 10)} at ${strTime}`

                    this.sendMessage(time)
                    localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                }
                this.pickCustomRemindDate = false
                this.$emit('componentEvent', false)
                this.pickedCustomRemindDate = null
            } else {
                if (!!this.errorCustomRemindDateToggle) {
                    this.errorCustomRemindDateToggle = false
                    setTimeout(() => {
                        this.errorCustomRemindDateToggle = true
                    }, 0)
                } else {
                    setTimeout(() => {
                        this.errorCustomRemindDateToggle = true
                    }, 0)
                }
            }
        },
        calcTime(time) {
            this.time = new Date(time)
            this.hours = this.time.getHours()
            this.minutes = this.time.getMinutes()
            this.ampm = this.hours >= 12 ? 'pm' : 'am';
            this.hours = this.hours % 12;
            this.hours = this.hours ? this.hours : 12;
            this.minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
            this.strTime = this.hours + ':' + this.minutes + ' ' + this.ampm;

            if (!!this.descriptionTaskChildList) {
                this.lists[2].tasks.forEach((task, index) => {
                    if (+task.id === +this.taskIndex && +task.listId === +this.descriptionTaskList && +task.childListId === +this.descriptionTaskChildList) {
                        this.lists[2].tasks.splice(index, 1)
                    }
                })

                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMe = time
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMeDate = this.time
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMeName = `${this.time.toDateString().slice(0, 10)} at ${this.strTime}`

                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueTime = this.time
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueDateName = `${this.time.toDateString().slice(0, 10)} at ${this.strTime}`
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].realDueDateName = time

                this.lists[2].tasks.push(this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex])
            } else {
                this.lists[2].tasks.forEach((task, index) => {
                    if (+task.id === +this.taskIndex && +task.listId === +this.descriptionTaskList) {
                        this.lists[2].tasks.splice(index, 1)
                    }
                })

                this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMe = time
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMeDate = this.time
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMeName = `${this.time.toDateString().slice(0, 10)} at ${this.strTime}`

                this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueTime = this.time
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueDateName = `${this.time.toDateString().slice(0, 10)} at ${this.strTime}`
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].realDueDateName = time

                this.lists[2].tasks.push(this.lists[this.descriptionTaskList].tasks[this.taskIndex])
            }

        }
    }
}
</script>