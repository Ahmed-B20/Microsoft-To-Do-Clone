<template>
    <img v-if="task.important" :data-id="taskIndex" @click="importantAsideToggle" class="important-toggle"
        src="@/assets/design-material/icons/important-task.png" alt="">

    <img v-else :data-id="taskIndex" @click="importantAsideToggle" class="important-toggle"
        src="@/assets/design-material/icons/important-hover.png" alt="">
</template>

<script>
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'ImportantToggle',
    props: ['taskIndex', 'task','descriptionTaskList','descriptionTaskChildList', 'element'],
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
        importantAsideToggle() {
            this.element.classList.remove('add-animation-x')
            this.element.classList.remove('add-animation')

            if (!!this.descriptionTaskChildList) {
                if (this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].important) {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].important = false
                    event.target.setAttribute('src', event.target.getAttribute('src').replace('important-task', 'important-hover'))
                    this.importantTask = this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex]
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks.splice(this.taskIndex, 1)
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks.push(this.importantTask)
                    this.importantTask = {}
                } else {
                    event.target.setAttribute('src', event.target.getAttribute('src').replace('important-hover', 'important-task'))
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].important = true
                    this.importantTask = this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex]
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks.splice(this.taskIndex, 1)
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks.unshift(this.importantTask)
                    this.importantTask = {}
                }

                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks.forEach((singleTask, index) => {
                    if (singleTask.id == this.task.id) {
                        this.$emit('componentEvent', index)
                    }
                })
            } else {
                console.log(this.taskIndex);
                if (this.lists[this.descriptionTaskList].tasks[this.taskIndex].important) {
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].important = false
                    event.target.setAttribute('src', event.target.getAttribute('src').replace('important-task', 'important-hover'))
                    this.importantTask = this.lists[this.descriptionTaskList].tasks[this.taskIndex]
                    this.lists[this.descriptionTaskList].tasks.splice(this.taskIndex, 1)
                    this.lists[this.descriptionTaskList].tasks.push(this.importantTask)
                    this.importantTask = {}

                } else {
                    event.target.setAttribute('src', event.target.getAttribute('src').replace('important-hover', 'important-task'))
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].important = true
                    this.importantTask = this.lists[this.descriptionTaskList].tasks[this.taskIndex]
                    this.lists[this.descriptionTaskList].tasks.splice(this.taskIndex, 1)
                    this.lists[this.descriptionTaskList].tasks.unshift(this.importantTask)
                    this.importantTask = {}
                }
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                this.lists[this.descriptionTaskList].tasks.forEach((singleTask, index) => {
                    if (singleTask.id == this.task.id) {
                        this.$emit('componentEvent', index)
                    }
                })
            }
        },
    }
}
</script>