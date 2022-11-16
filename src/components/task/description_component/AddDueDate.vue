<template>
    <div v-if="date === 'customDate'" @click="addDueDate(date)">
        <template v-if="pickCustomDate">
            <img @click="addCustomDate" src="@/assets/design-material/icons/plus.png" alt="add custom date">
            <input :class="{ error: errorCustomDateToggle }" class="custom-date" v-model="pickedCustomDate" type="date"
                name="" id="">
        </template>

        <template v-else>
            <img src="@/assets/design-material/icons/custom-date.png" alt="pick a date">
            <span>Pick a Date</span>
        </template>
    </div>

    <div v-else @click="addDueDate(date)">
        <img src="@/assets/design-material/icons/next-week.png" alt="next week">
        <span>{{ date }}</span>
    </div>
</template>

<script>
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'AddDueDate',
    props: ['descriptionTaskList', 'descriptionTaskChildList', 'descriptionTaskIndex', 'taskIndex', 'date'],
    data() {
        return {
            pickCustomDate: false,
            pickedCustomDate: null,
            errorCustomDateToggle: false,
            time: '',
            hours: '',
            minutes: '',
            ampm: '',
            strTime: ''
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists']),
        ...mapWritableState(allLists, ['lists']),
    },
    methods: {
        addDueDate(date) {
            if (!!this.descriptionTaskChildList) {
                if (date === 'today') {
                    this.calcTime(new Date())
                    this.$emit('componentEvent')
                } else if (date === 'tomorrow') {
                    this.calcTime(new Date(new Date().setDate(new Date().getDate() + 1)))
                    this.$emit('componentEvent')
                } else if (date === 'nextWeek') {
                    this.calcTime(new Date(new Date().setDate(new Date().getDate() + 7)))
                    this.$emit('componentEvent')
                } else if (date === 'customDate') {
                    this.pickCustomDate = true
                }
            } else {
                if (date === 'today') {
                    this.calcTime(new Date())
                    this.$emit('componentEvent')
                } else if (date === 'tomorrow') {
                    this.calcTime(new Date(new Date().setDate(new Date().getDate() + 1)))
                    this.$emit('componentEvent')
                } else if (date === 'nextWeek') {
                    this.calcTime(new Date(new Date().setDate(new Date().getDate() + 7)))
                    this.$emit('componentEvent')
                } else if (date === 'customDate') {
                    this.pickCustomDate = true
                }
            }
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
        },
        addCustomDate() {
            if (!!this.pickedCustomDate) {
                if (!!this.descriptionTaskChildList) {
                    this.calcTime(this.pickedCustomDate)
                } else {
                    this.calcTime(this.pickedCustomDate)
                }

                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                this.pickCustomDate = false
                this.$emit('componentEvent')
                this.pickedCustomDate = null
            } else {
                if (!!this.errorCustomDateToggle) {
                    this.errorCustomDateToggle = false
                    setTimeout(() => {
                        this.errorCustomDateToggle = true
                    }, 0)
                } else {
                    setTimeout(() => {
                        this.errorCustomDateToggle = true
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
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueTime = this.time
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueDateName = `${this.time.toDateString().slice(0, 10)} at ${this.strTime}`
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].realDueDateName = time
                this.lists[2].tasks.push(this.lists[this.descriptionTaskList].tasks[this.taskIndex])
            }
        }
    }
}
</script>