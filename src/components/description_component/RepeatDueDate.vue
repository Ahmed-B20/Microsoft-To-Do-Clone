<template>
    <div v-if="date === 'customDate'" @click="repeatDueDate(date)">
        <template v-if="pickCustomRepeatDate">
            <img @click="addCustomRepeatDate" src="@/assets/design-material/icons/plus.png" alt="add custom date">
            <input :class="{ error: errorCustomRepeatDateToggle }" class="custom-date" v-model="pickedCustomRepeatDate"
                type="date" name="" id="">
        </template>

        <template v-else>
            <img src="@/assets/design-material/icons/custom-date.png" alt="pick a date">
            <span>Custom</span>
        </template>
    </div>

    <div v-else @click="repeatDueDate(date)">
        <img :src="'/src' + src" alt="next week">
        <span>{{ date }}</span>
    </div>
</template>

<script>
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'RepeatDueDate',
    props: ['descriptionTaskList', 'descriptionTaskChildList', 'descriptionTaskIndex', 'taskIndex', 'date'],
    data() {
        return {
            pickCustomRepeatDate: false,
            pickedCustomRepeatDate: null,
            errorCustomRepeatDateToggle: false,
            src: ''
        }
    },
    beforeMount() {
        switch (this.date) {
            case 'daily':
                this.src = '/assets/design-material/icons/tomorrow-repeat.png'
                break;

            case 'weekDays':
                this.src = '/assets/design-material/icons/due-date.png'
                break;
            case 'weekly':
                this.src = '/assets/design-material/icons/next-week.png'
                break;
            case 'monthly':
                this.src = '/assets/design-material/icons/30-days.png'
                break;
            case 'yearly':
                this.src = '/assets/design-material/icons/365.png'
                break;
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists', 'smartList']),
        ...mapWritableState(allLists, ['lists', 'smartList']),
    },
    methods: {
        repeatDueDate(date) {
            if (!!this.descriptionTaskChildList) {
                if (date !== 'customDate') {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].repeatDueDate = new Date()
                    let name = new Date().toString().split(' ')
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].repeatDueDateName = name.slice(0, 4).join(' ')

                    if (!this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueTime) {
                        this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueTime = new Date()
                        this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueDateName = name.slice(0, 4).join(' ')
                    }
                }

                if (date === 'daily') {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].realRepeatDueDateName = 'Daily'
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].realDueDateName = 'ToDay'
                    this.$emit('componentEvent')
                } else if (date === 'weekDays') {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].realRepeatDueDateName = 'WeekDays'
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].realDueDateName = 'Tomorrow'
                    this.$emit('componentEvent')
                } else if (date === 'weekly') {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].realRepeatDueDateName = 'Weekly'
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].realDueDateName = 'NextWeek'
                    this.$emit('componentEvent')
                } else if (date === 'monthly') {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].realRepeatDueDateName = 'Monthly'
                    this.$emit('componentEvent')
                } else if (date === 'yearly') {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].realRepeatDueDateName = 'Yearly'
                    this.$emit('componentEvent')
                } else if (date === 'customDate') {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].realDueDateName = 'CustomDate'
                    this.pickCustomRepeatDate = true
                }

                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].repeatedTask = true
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            } else {
                if (date !== 'customDate') {
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].repeatDueDate = new Date()
                    let name = new Date().toString().split(' ')
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].repeatDueDateName = name.slice(0, 4).join(' ')

                    if (!this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueTime) {
                        this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueTime = new Date()
                        this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueDateName = name.slice(0, 4).join(' ')
                    }
                }

                if (date === 'daily') {
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].realRepeatDueDateName = 'Daily'
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].realDueDateName = 'ToDay'
                    this.$emit('componentEvent')
                } else if (date === 'weekDays') {
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].realRepeatDueDateName = 'WeekDays'
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].realDueDateName = 'Tomorrow'
                    this.$emit('componentEvent')
                } else if (date === 'weekly') {
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].realRepeatDueDateName = 'Weekly'
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].realDueDateName = 'NextWeek'
                    this.$emit('componentEvent')
                }
                else if (date === 'monthly') {
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].realRepeatDueDateName = 'Monthly'
                    this.$emit('componentEvent')
                }
                else if (date === 'yearly') {
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].realRepeatDueDateName = 'Yearly'
                    this.$emit('componentEvent')
                } else if (date === 'customDate') {
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].realDueDateName = 'CustomDate'
                    this.pickCustomRepeatDate = true
                }

                this.lists[this.descriptionTaskList].tasks[this.taskIndex].repeatedTask = true
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            }
        },
        addCustomRepeatDate() {
            console.log('ddd');
            if (!!this.pickedCustomRepeatDate) {
                if (!!this.descriptionTaskChildList) {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].repeatDueDate = new Date()
                    let name = new Date(this.pickedCustomRepeatDate).toString().split(' ')
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].repeatDueDateName = name.slice(0, 4).join(' ')
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].realRepeatDueDateName = 'CustomDate'
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex] = Math.ceil((new Date(this.pickedCustomRepeatDate) - new Date()) / (24 * 60 * 60 * 1000))

                    let dueName = new Date().toString().split(' ')
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueTime = new Date()
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueDateName = dueName.slice(0, 4).join(' ')

                    localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                } else {
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].repeatDueDate = new Date()
                    let name = new Date(this.pickedCustomRepeatDate).toString().split(' ')
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].repeatDueDateName = name.slice(0, 4).join(' ')
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].realRepeatDueDateName = 'CustomDate'
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].repeatedCustomTaskDuration = Math.ceil((new Date(this.pickedCustomRepeatDate) - new Date()) / (24 * 60 * 60 * 1000))

                    let dueName = new Date().toString().split(' ')
                    if (!this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueTime) {
                        this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueTime = new Date()
                        this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueDateName = dueName.slice(0, 4).join(' ')
                    }

                    localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                }
                this.pickCustomRepeatDate = false
                this.$emit('componentEvent')
                this.pickedCustomRepeatDate = null
            } else {
                if (!!this.errorCustomRepeatDateToggle) {
                    this.errorCustomRepeatDateToggle = false
                    setTimeout(() => {
                        this.errorCustomRepeatDateToggle = true
                    }, 0)
                } else {
                    setTimeout(() => {
                        this.errorCustomRepeatDateToggle = true
                    }, 0)
                }
            }
        }
    }
}
</script>