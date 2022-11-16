<template>
    <div @click="importantToggle">
        <img v-if="returnImportantState" src="@/assets/design-material/icons/important-task.png" alt="important task">

        <img v-else src="@/assets/design-material/icons/important-hover.png" alt="not important task">

        <span>{{ returnImportantState ? 'Remove Importance' : 'Mark As Important' }}</span>
    </div>
</template>

<script>
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'MarkAsImportant',
    props: ['listId', 'childId', 'taskElementId', 'taskElements', 'selectTask'],
    data() {
        return {
            taskElement: '',
            importantTask: {},
        }
    },
    beforeMount() {
        if (!!this.selectTask.childListId) {
            this.taskName = this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.taskElementId].name
        } else {
            this.taskName = this.lists[this.selectTask.listId].tasks[this.taskElementId].name
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists', 'smartList']),
        ...mapWritableState(allLists, ['lists', 'smartList']),

        returnImportantState() {
            if (!!this.selectTask.childListId) {
                return this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.taskElementId].important
            } else {
                return this.lists[this.selectTask.listId].tasks[this.taskElementId].important
            }
        }
    },
    methods: {
        importantToggle() {
            this.taskElement = this.taskElements[this.taskElementId]

            this.taskElement.classList.remove('add-animation-x')
            this.taskElement.classList.remove('add-animation')
            if (!!this.selectTask.childListId) {
                if (+this.selectTask.listId === 1) {
                    this.lists[1].tasks.splice(this.taskElementId, 1)
                } else {
                    if (this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.taskElementId].important) {
                        this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.taskElementId].important = false
                        if (!!event.target.getAttribute('src')) {
                            event.target.setAttribute('src', event.target.getAttribute('src').replace('important-task', 'important-hover'))
                        }
                        // this.importantTask = this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.taskElementId]
                        // this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks.splice(this.taskElementId, 1)
                        // this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks.push(this.importantTask)
                        // this.importantTask = {}
                    } else {
                        if (!!event.target.getAttribute('src')) {
                            event.target.setAttribute('src', event.target.getAttribute('src').replace('important-hover', 'important-task'))
                        }
                        this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.taskElementId].important = true
                        // this.importantTask = this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.taskElementId]
                        // this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks.splice(this.taskElementId, 1)
                        // this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks.unshift(this.importantTask)
                        // this.importantTask = {}
                    }
                }

            } else {
                if (+this.selectTask.listId === 1) {
                    this.lists[1].tasks.splice(this.taskElementId, 1)
                } else {
                    if (this.lists[this.selectTask.listId].tasks[this.taskElementId].important) {
                        this.lists[this.selectTask.listId].tasks[this.taskElementId].important = false
                        if (!!event.target.getAttribute('src')) {
                            event.target.setAttribute('src', event.target.getAttribute('src').replace('important-task', 'important-hover'))
                        }
                        // this.importantTask = this.lists[this.selectTask.listId].tasks[this.taskElementId]
                        // this.lists[this.selectTask.listId].tasks.splice(this.taskElementId, 1)
                        // this.lists[this.selectTask.listId].tasks.push(this.importantTask)
                        // this.importantTask = {}
                    } else {
                        if (!!event.target.getAttribute('src')) {
                            event.target.setAttribute('src', event.target.getAttribute('src').replace('important-hover', 'important-task'))
                        }
                        this.lists[this.selectTask.listId].tasks[this.taskElementId].important = true
                        // this.importantTask = this.lists[this.selectTask.listId].tasks[this.taskElementId]
                        // this.lists[this.selectTask.listId].tasks.splice(this.taskElementId, 1)
                        // this.lists[this.selectTask.listId].tasks.unshift(this.importantTask)
                        // this.importantTask = {}
                    }
                }

            }
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))

            this.$emit('componentEvent')
        }
    }
}
</script>