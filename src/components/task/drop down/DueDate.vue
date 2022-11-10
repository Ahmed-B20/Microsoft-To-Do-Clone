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
                    this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].dueTime = new Date()
                    this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].dueDateName = 'ToDay'
                    this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].realDueDateName = 'ToDay'

                    this.$emit('componentEvent')

                    this.lists[2].tasks.push(this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id])
                } else if (date === 'tomorrow') {
                    this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].dueTime = new Date(new Date().setDate(new Date().getDate() + 1))
                    this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].dueDateName = 'Tomorrow'
                    this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].realDueDateName = 'Tomorrow'

                    this.$emit('componentEvent')

                    this.lists[2].tasks.push(this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id])
                } else if (date === 'nextWeek') {
                    this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].dueTime = new Date(new Date().setDate(new Date().getDate() + 7))
                    this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].dueDateName = new Date(new Date().setDate(new Date().getDate() + 7)).toString().split(' ')[1] + ' ' + new Date(new Date().setDate(new Date().getDate() + 7)).toString().split(' ')[2]
                    this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].realDueDateName = 'NextWeek'

                    this.$emit('componentEvent')

                    this.lists[2].tasks.push(this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id])
                } else if (date === 'customDate') {
                    this.pickCustomDate = true
                }
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            } else {
                this.lists[2].tasks.forEach((task, index) => {
                    if (+task.id === +this.id && +task.listId === +this.listId) {
                        this.lists[2].tasks.splice(index, 1)
                    }
                })

                if (date === 'today') {
                    this.lists[this.selectTask.listId].tasks[this.selectTask.id].dueTime = new Date()
                    this.lists[this.selectTask.listId].tasks[this.selectTask.id].dueDateName = 'ToDay'
                    this.lists[this.selectTask.listId].tasks[this.selectTask.id].realDueDateName = 'ToDay'

                    this.$emit('componentEvent')

                    this.lists[2].tasks.push(this.lists[this.selectTask.listId].tasks[this.selectTask.id])
                } else if (date === 'tomorrow') {
                    this.lists[this.selectTask.listId].tasks[this.selectTask.id].dueTime = new Date(new Date().setDate(new Date().getDate() + 1))
                    this.lists[this.selectTask.listId].tasks[this.selectTask.id].dueDateName = 'Tomorrow'
                    this.lists[this.selectTask.listId].tasks[this.selectTask.id].realDueDateName = 'Tomorrow'

                    this.$emit('componentEvent')

                    this.lists[2].tasks.push(this.lists[this.selectTask.listId].tasks[this.selectTask.id])
                } else if (date === 'nextWeek') {
                    this.lists[this.selectTask.listId].tasks[this.selectTask.id].dueTime = new Date(new Date().setDate(new Date().getDate() + 7))
                    this.lists[this.selectTask.listId].tasks[this.selectTask.id].dueDateName = new Date(new Date().setDate(new Date().getDate() + 7)).toString().split(' ')[1] + ' ' + new Date(new Date().setDate(new Date().getDate() + 7)).toString().split(' ')[2]
                    this.lists[this.selectTask.listId].tasks[this.selectTask.id].realDueDateName = 'NextWeek'

                    this.$emit('componentEvent')

                    this.lists[2].tasks.push(this.lists[this.selectTask.listId].tasks[this.selectTask.id])
                } else if (date === 'customDate') {
                    this.pickCustomDate = true
                }

                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            }
        },
        addCustomDate() {
            if (!!this.pickedCustomDate) {
                if (!!this.selectTask.childListId) {
                    this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].dueTime = this.pickedCustomDate
                    this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].dueDateName = new Date(this.pickedCustomDate).toString().split(' ')[1] + ' ' + new Date(this.pickedCustomDate).toString().split(' ')[2]
                    this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].realDueDateName = 'CustomDate'

                    this.lists[2].tasks.push(this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id])
                } else {
                    this.lists[this.selectTask.listId].tasks[this.selectTask.id].dueTime = this.pickedCustomDate
                    this.lists[this.selectTask.listId].tasks[this.selectTask.id].dueDateName = new Date(this.pickedCustomDate).toString().split(' ')[1] + ' ' + new Date(this.pickedCustomDate).toString().split(' ')[2]
                    this.lists[this.selectTask.listId].tasks[this.selectTask.id].realDueDateName = 'CustomDate'

                    this.lists[2].tasks.push(this.lists[this.selectTask.listId].tasks[this.selectTask.id])
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