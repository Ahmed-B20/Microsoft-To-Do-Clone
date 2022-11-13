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
        <img src="@/assets/design-material/icons/date.png" alt="">
        <span>{{ date }}</span>
    </div>
</template>

<script>
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'DueDate',
    props: ['listId', 'childId', 'taskElementId', 'taskElements', 'date', 'selectTask'],
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
        ...mapState(allLists, ['returnLists', 'smartList']),
        ...mapWritableState(allLists, ['lists', 'smartList']),
    },
    methods: {
        addDueDate(date) {
            if (!!this.selectTask.childListId) {
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
                if (!!this.selectTask.childListId) {
                    this.calcTime(this.pickedCustomDate)
                } else {
                    this.calcTime(this.pickedCustomDate)
                }

                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                this.pickCustomDate = false
                this.pickedCustomDate = null

                this.$emit('componentEvent')
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
                    if (+task.id === +this.selectTask.id && +task.listId === +this.selectTask.listId && +task.childListId === +this.selectTask.childListId) {
                        this.lists[2].tasks.splice(index, 1)
                    }
                })

                this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].dueTime = this.time
                this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].dueDateName = `${this.time.toDateString().slice(0, 10)} at ${this.strTime}`
                this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].realDueDateName = time
                this.lists[2].tasks.push(this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id])
            } else {
                this.lists[2].tasks.forEach((task, index) => {
                    if (+task.id === +this.selectTask.id && +task.listId === +this.selectTask.listId) {
                        this.lists[2].tasks.splice(index, 1)
                    }
                })

                this.lists[this.selectTask.listId].tasks[this.selectTask.id].dueTime = this.time
                this.lists[this.selectTask.listId].tasks[this.selectTask.id].dueDateName = `${this.time.toDateString().slice(0, 10)} at ${this.strTime}`
                this.lists[this.selectTask.listId].tasks[this.selectTask.id].realDueDateName = time
                this.lists[2].tasks.push(this.lists[this.selectTask.listId].tasks[this.selectTask.id])
            }

        }
    }
}
</script>