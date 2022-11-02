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
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists', 'smartList']),
        ...mapWritableState(allLists, ['lists', 'smartList']),
    },
    methods: {
        addDueDate(date) {
            if (!!this.descriptionTaskChildList) {
                if (date === 'today') {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueTime = new Date()
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueDateName = 'ToDay'
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].realDueDateName = 'ToDay'
                    this.$emit('componentEvent')

                    this.smartList.planned.tasks.push(this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex])
                } else if (date === 'tomorrow') {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueTime = new Date(new Date().setDate(new Date().getDate() + 1))
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueDateName = 'Tomorrow'
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].realDueDateName = 'Tomorrow'
                    this.$emit('componentEvent')

                    this.smartList.planned.tasks.push(this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex])
                } else if (date === 'nextWeek') {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueTime = new Date(new Date().setDate(new Date().getDate() + 7))
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueDateName = new Date(new Date().setDate(new Date().getDate() + 7)).toString().split(' ')[1] + ' ' + new Date(new Date().setDate(new Date().getDate() + 7)).toString().split(' ')[2]
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].realDueDateName = 'NextWeek'
                    this.$emit('componentEvent')

                    this.smartList.planned.tasks.push(this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex])
                } else if (date === 'customDate') {
                    this.pickCustomDate = true
                }
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                localStorage.setItem("allSmartLists", JSON.stringify(this.smartList))
            } else {
                if (date === 'today') {
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueTime = new Date()
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueDateName = 'ToDay'
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].realDueDateName = 'ToDay'
                    this.$emit('componentEvent')

                    this.smartList.planned.tasks.push(this.lists[this.descriptionTaskList].tasks[this.taskIndex])
                } else if (date === 'tomorrow') {
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueTime = new Date(new Date().setDate(new Date().getDate() + 1))
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueDateName = 'Tomorrow'
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].realDueDateName = 'Tomorrow'
                    this.$emit('componentEvent')

                    this.smartList.planned.tasks.push(this.lists[this.descriptionTaskList].tasks[this.taskIndex])
                } else if (date === 'nextWeek') {
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueTime = new Date(new Date().setDate(new Date().getDate() + 7))
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueDateName = new Date(new Date().setDate(new Date().getDate() + 7)).toString().split(' ')[1] + ' ' + new Date(new Date().setDate(new Date().getDate() + 7)).toString().split(' ')[2]
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].realDueDateName = 'NextWeek'
                    this.$emit('componentEvent')

                    this.smartList.planned.tasks.push(this.lists[this.descriptionTaskList].tasks[this.taskIndex])
                } else if (date === 'customDate') {
                    this.pickCustomDate = true
                }

                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                localStorage.setItem("allSmartLists", JSON.stringify(this.smartList))
            }
        },
        addCustomDate() {
            if (!!this.pickedCustomDate) {
                if (!!this.descriptionTaskChildList) {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueTime = this.pickedCustomDate
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueDateName = new Date(this.pickedCustomDate).toString().split(' ')[1] + ' ' + new Date(this.pickedCustomDate).toString().split(' ')[2]
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].realDueDateName = 'CustomDate'

                    this.smartList.planned.tasks.push(this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex])
                } else {
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueTime = this.pickedCustomDate
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueDateName = new Date(this.pickedCustomDate).toString().split(' ')[1] + ' ' + new Date(this.pickedCustomDate).toString().split(' ')[2]
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].realDueDateName = 'CustomDate'

                    this.smartList.planned.tasks.push(this.lists[this.descriptionTaskList].tasks[this.taskIndex])
                }

                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                localStorage.setItem("allSmartLists", JSON.stringify(this.smartList))
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
        }
    }
}
</script>