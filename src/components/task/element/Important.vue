<template>
    <img v-if="task.important" @click="importantToggle" class="important-toggle"
        src="@/assets/design-material/icons/important-task.png" alt="">

    <img v-else @click="importantToggle('task')" class="important-toggle"
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
                if (+this.listId === 1) {
                    this.lists[1].tasks.splice(this.index, 1)
                } else {
                    if (this.lists[this.listId].listsArray[this.childId].tasks[this.index].important) {
                        this.lists[this.listId].listsArray[this.childId].tasks[this.index].important = false
                        if (!!event.target.getAttribute('src')) {
                            event.target.setAttribute('src', event.target.getAttribute('src').replace('important-task', 'important-hover'))
                        }
                        this.importantTask = this.lists[this.listId].listsArray[this.childId].tasks[this.index]
                        this.lists[this.listId].listsArray[this.childId].tasks.splice(this.index, 1)
                        this.lists[this.listId].listsArray[this.childId].tasks.push(this.importantTask)
                        this.importantTask = {}
                    } else {
                        if (!!event.target.getAttribute('src')) {
                            event.target.setAttribute('src', event.target.getAttribute('src').replace('important-hover', 'important-task'))
                        }
                        this.lists[this.listId].listsArray[this.childId].tasks[this.index].important = true
                        this.importantTask = this.lists[this.listId].listsArray[this.childId].tasks[this.index]
                        this.lists[this.listId].listsArray[this.childId].tasks.splice(this.index, 1)
                        this.lists[this.listId].listsArray[this.childId].tasks.unshift(this.importantTask)
                        this.importantTask = {}
                    }
                }
            } else {
                if (+this.listId === 1) {
                    this.lists[1].tasks.splice(this.index, 1)
                } else {
                    if (this.lists[this.listId].tasks[this.index].important) {
                        this.lists[this.listId].tasks[this.index].important = false
                        if (!!event.target.getAttribute('src')) {
                            event.target.setAttribute('src', event.target.getAttribute('src').replace('important-task', 'important-hover'))
                        }
                        this.importantTask = this.lists[this.listId].tasks[this.index]
                        this.lists[this.listId].tasks.splice(this.index, 1)
                        this.lists[this.listId].tasks.push(this.importantTask)
                        this.importantTask = {}
                    } else {
                        if (!!event.target.getAttribute('src')) {
                            event.target.setAttribute('src', event.target.getAttribute('src').replace('important-hover', 'important-task'))
                        }
                        this.lists[this.listId].tasks[this.index].important = true
                        this.importantTask = this.lists[this.listId].tasks[this.index]
                        this.lists[this.listId].tasks.splice(this.index, 1)
                        this.lists[this.listId].tasks.unshift(this.importantTask)
                        this.importantTask = {}
                    }
                }
            }
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))

            this.$emit('componentEvent')
        },
    }
}
</script>