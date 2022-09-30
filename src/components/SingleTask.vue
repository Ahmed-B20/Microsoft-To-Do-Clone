<template>
    <transition-group name="tasks-transition">
        <li @click.self="openDescription" :class="{complete: task.complete}"
            v-for="(task,index) in returnLists[listId].tasks" :key="task.id" :data-id="task.id">
            <span :data-id="index" @click="completeTask" class="check">
                <img src="@/assets/design-material/icons/check.png" alt="check" />
            </span>
            <span class="task-name" :class="{complete: task.complete}">
                {{task.name}}
            </span>

            <img v-if="task.important" :data-id="index" @click="importantToggle" class="important-toggle"
                src="@/assets/design-material/icons/important-task.png" alt="">

            <img v-else :data-id="index" @click="importantToggle" class="important-toggle"
                src="@/assets/design-material/icons/important-hover.png" alt="">
        </li>
    </transition-group>
</template>

<script>
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'SingleTask',
    props: ['listId'],
    computed: {
        ...mapState(allLists, ['returnLists']),
        ...mapWritableState(allLists, ['lists']),
    },
    data() {
        return {
            importantTask: {},
            shrink: false
        }
    },
    watch: {
        // allTask() {
        //     console.log(this.allTask);
        // }
    },
    methods: {

        openDescription() {
            this.shrink = !this.shrink
            this.$emit('openDescriptionEvent', this.listId, event.target.getAttribute('data-id'), this.shrink)
        },
        importantToggle() {
            // this.lists[this.listId].tasks[event.target.getAttribute('data-id')]


            if (this.lists[this.listId].tasks[event.target.getAttribute('data-id')].important) {
                this.lists[this.listId].tasks[event.target.getAttribute('data-id')].important = false

                event.target.setAttribute('src', event.target.getAttribute('src').replace('important-task', 'important-hover'))

                this.importantTask = this.lists[this.listId].tasks[event.target.getAttribute('data-id')]


                this.lists[this.listId].tasks.splice(event.target.getAttribute('data-id'), 1)


                this.lists[this.listId].tasks.push(this.importantTask)
                this.importantTask = {}

            } else {
                event.target.setAttribute('src', event.target.getAttribute('src').replace('important-hover', 'important-task'))

                this.lists[this.listId].tasks[event.target.getAttribute('data-id')].important = true

                this.importantTask = this.lists[this.listId].tasks[event.target.getAttribute('data-id')]



                this.lists[this.listId].tasks.splice(event.target.getAttribute('data-id'), 1)


                this.lists[this.listId].tasks.unshift(this.importantTask)
                this.importantTask = {}
            }

            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))

        },
        completeTask() {
            if (event.target.tagName === 'SPAN') {
                if (this.lists[this.listId].tasks[event.target.getAttribute('data-id')].complete) {
                    this.lists[this.listId].tasks[event.target.getAttribute('data-id')].complete = false
                } else {
                    this.lists[this.listId].tasks[event.target.getAttribute('data-id')].complete = true
                }
            } else {
                if (this.lists[this.listId].tasks[event.target.parentElement.getAttribute('data-id')].complete) {
                    this.lists[this.listId].tasks[event.target.parentElement.getAttribute('data-id')].complete = false
                } else {
                    this.lists[this.listId].tasks[event.target.parentElement.getAttribute('data-id')].complete = true
                }
            }

            this.completeTaskStatus = !this.completeTaskStatus
            console.log(this.lists);

            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))

        }
    }
}
</script>