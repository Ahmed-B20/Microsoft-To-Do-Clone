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
    props: ['listId', 'childId', 'taskElementId', 'taskElements', 'date'],
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
            console.log('fff');
            if (!!this.childId) {
                // this.lists[2].tasks.forEach((task, index) => {
                //     if (+task.id === +this.taskElementId && +task.listId === +this.listId && +this.childId === +task.childListId) {
                //         this.lists[2].tasks.splice(index, 1)
                //     }
                // })

                if (date === 'today') {
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].dueTime = new Date()
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].dueDateName = 'ToDay'
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].realDueDateName = 'ToDay'

                    this.$emit('componentEvent')

                    this.lists[2].tasks.push(this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId])
                } else if (date === 'tomorrow') {
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].dueTime = new Date(new Date().setDate(new Date().getDate() + 1))
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].dueDateName = 'Tomorrow'
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].realDueDateName = 'Tomorrow'

                    this.$emit('componentEvent')

                    this.lists[2].tasks.push(this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId])
                } else if (date === 'nextWeek') {
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].dueTime = new Date(new Date().setDate(new Date().getDate() + 7))
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].dueDateName = new Date(new Date().setDate(new Date().getDate() + 7)).toString().split(' ')[1] + ' ' + new Date(new Date().setDate(new Date().getDate() + 7)).toString().split(' ')[2]
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].realDueDateName = 'NextWeek'

                    this.$emit('componentEvent')

                    this.lists[2].tasks.push(this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId])
                } else if (date === 'customDate') {
                    this.pickCustomDate = true
                }
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            } else {
                this.lists[2].tasks.forEach((task, index) => {
                    if (+task.id === +this.taskElementId && +task.listId === +this.listId) {
                        this.lists[2].tasks.splice(index, 1)
                    }
                })

                if (date === 'today') {
                    this.lists[this.listId].tasks[this.taskElementId].dueTime = new Date()
                    this.lists[this.listId].tasks[this.taskElementId].dueDateName = 'ToDay'
                    this.lists[this.listId].tasks[this.taskElementId].realDueDateName = 'ToDay'

                    this.$emit('componentEvent')

                    this.lists[2].tasks.push(this.lists[this.listId].tasks[this.taskElementId])
                } else if (date === 'tomorrow') {
                    this.lists[this.listId].tasks[this.taskElementId].dueTime = new Date(new Date().setDate(new Date().getDate() + 1))
                    this.lists[this.listId].tasks[this.taskElementId].dueDateName = 'Tomorrow'
                    this.lists[this.listId].tasks[this.taskElementId].realDueDateName = 'Tomorrow'

                    this.$emit('componentEvent')

                    this.lists[2].tasks.push(this.lists[this.listId].tasks[this.taskElementId])
                } else if (date === 'nextWeek') {
                    this.lists[this.listId].tasks[this.taskElementId].dueTime = new Date(new Date().setDate(new Date().getDate() + 7))
                    this.lists[this.listId].tasks[this.taskElementId].dueDateName = new Date(new Date().setDate(new Date().getDate() + 7)).toString().split(' ')[1] + ' ' + new Date(new Date().setDate(new Date().getDate() + 7)).toString().split(' ')[2]
                    this.lists[this.listId].tasks[this.taskElementId].realDueDateName = 'NextWeek'

                    this.$emit('componentEvent')

                    this.lists[2].tasks.push(this.lists[this.listId].tasks[this.taskElementId])
                } else if (date === 'customDate') {
                    this.pickCustomDate = true
                }

                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            }
        },
        addCustomDate() {
            if (!!this.pickedCustomDate) {
                if (!!this.childId) {
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].dueTime = this.pickedCustomDate
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].dueDateName = new Date(this.pickedCustomDate).toString().split(' ')[1] + ' ' + new Date(this.pickedCustomDate).toString().split(' ')[2]
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].realDueDateName = 'CustomDate'

                    this.lists[2].tasks.push(this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId])
                } else {
                    this.lists[this.listId].tasks[this.taskElementId].dueTime = this.pickedCustomDate
                    this.lists[this.listId].tasks[this.taskElementId].dueDateName = new Date(this.pickedCustomDate).toString().split(' ')[1] + ' ' + new Date(this.pickedCustomDate).toString().split(' ')[2]
                    this.lists[this.listId].tasks[this.taskElementId].realDueDateName = 'CustomDate'

                    this.lists[2].tasks.push(this.lists[this.listId].tasks[this.taskElementId])
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
        }
    }
}
</script>