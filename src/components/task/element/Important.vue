<template>
    <img v-if="task.important" :data-id="index" @click="importantToggle" class="important-toggle"
        src="@/assets/design-material/icons/important-task.png" alt="">

    <img v-else :data-id="index" @click="importantToggle('task')" class="important-toggle"
        src="@/assets/design-material/icons/important-hover.png" alt="">
</template>

<script>
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'Important',
    props: ['listId', 'childId', 'taskElementId', 'task', 'index'],
    data() {
        return {
            taskElement: '',
            importantTask: {},
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists', 'smartList']),
        ...mapWritableState(allLists, ['lists', 'smartList']),
    },
    methods: {
        importantToggle() {
            this.taskElement = event.target.parentElement

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
        },
    }
}
</script>