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
    props: ['listId', 'childId', 'taskElementId', 'taskElements'],
    data() {
        return {
            taskElement: '',
            importantTask: {},
        }
    },
    beforeMount() {
        if (!!this.childId) {
            this.taskName = this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].name
        } else {
            this.taskName = this.lists[this.listId].tasks[this.taskElementId].name
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists', 'smartList']),
        ...mapWritableState(allLists, ['lists', 'smartList']),

        returnImportantState() {
            if (!!this.childId) {
                return this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].important
            } else {
                return this.lists[this.listId].tasks[this.taskElementId].important
            }
        }
    },
    methods: {
        importantToggle() {
            this.taskElement = this.taskElements[this.taskElementId]

            this.taskElement.classList.remove('add-animation-x')
            this.taskElement.classList.remove('add-animation')
            if (!!this.childId) {
                if (this.lists[this.listId].listsArray[this.childId].tasks[event.target.getAttribute('data-id') || this.taskElementId].important) {
                    this.lists[this.listId].listsArray[this.childId].tasks[event.target.getAttribute('data-id') || this.taskElementId].important = false
                    if (!!event.target.getAttribute('src')) {
                        event.target.setAttribute('src', event.target.getAttribute('src').replace('important-task', 'important-hover'))
                    }
                    this.importantTask = this.lists[this.listId].listsArray[this.childId].tasks[event.target.getAttribute('data-id') || this.taskElementId]
                    this.lists[this.listId].listsArray[this.childId].tasks.splice(event.target.getAttribute('data-id') || this.taskElementId, 1)
                    this.lists[this.listId].listsArray[this.childId].tasks.push(this.importantTask)
                    this.importantTask = {}
                } else {
                    if (!!event.target.getAttribute('src')) {
                        event.target.setAttribute('src', event.target.getAttribute('src').replace('important-hover', 'important-task'))
                    }
                    this.lists[this.listId].listsArray[this.childId].tasks[event.target.getAttribute('data-id') || this.taskElementId].important = true
                    this.importantTask = this.lists[this.listId].listsArray[this.childId].tasks[event.target.getAttribute('data-id') || this.taskElementId]
                    this.lists[this.listId].listsArray[this.childId].tasks.splice(event.target.getAttribute('data-id') || this.taskElementId, 1)
                    this.lists[this.listId].listsArray[this.childId].tasks.unshift(this.importantTask)
                    this.importantTask = {}
                }
            } else {
                if (this.lists[this.listId].tasks[event.target.getAttribute('data-id') || this.taskElementId].important) {
                    this.lists[this.listId].tasks[event.target.getAttribute('data-id') || this.taskElementId].important = false
                    if (!!event.target.getAttribute('src')) {
                        event.target.setAttribute('src', event.target.getAttribute('src').replace('important-task', 'important-hover'))
                    }
                    this.importantTask = this.lists[this.listId].tasks[event.target.getAttribute('data-id') || this.taskElementId]
                    this.lists[this.listId].tasks.splice(event.target.getAttribute('data-id') || this.taskElementId, 1)
                    this.lists[this.listId].tasks.push(this.importantTask)
                    this.importantTask = {}
                } else {
                    if (!!event.target.getAttribute('src')) {
                        event.target.setAttribute('src', event.target.getAttribute('src').replace('important-hover', 'important-task'))
                    }
                    this.lists[this.listId].tasks[event.target.getAttribute('data-id') || this.taskElementId].important = true
                    this.importantTask = this.lists[this.listId].tasks[event.target.getAttribute('data-id') || this.taskElementId]
                    this.lists[this.listId].tasks.splice(event.target.getAttribute('data-id') || this.taskElementId, 1)
                    this.lists[this.listId].tasks.unshift(this.importantTask)
                    this.importantTask = {}
                }
            }
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))

            this.$emit('componentEvent')
        }
    }
}
</script>