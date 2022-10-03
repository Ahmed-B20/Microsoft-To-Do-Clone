<template>
    <transition-group name="tasks-transition">
        <li @click.self="openDescription" :class="{complete: task.complete}"
            v-for="(task,index) in returnLists[listId].tasks" :key="task.id" :data-id="index">
            <span :data-id="index" @click="completeTask" class="check">
                <img src="@/assets/design-material/icons/check.png" alt="check" />
            </span>

            <span class="task-main-info">
                <span class="task-name" :class="{complete: task.complete}">
                    {{task.name}}
                </span>

                <span class="info-icons">
                    <span v-if="task.steps.length > 0" class="steps">
                        {{(task.steps.filter((step)=>{return step.complete === true}).length)}} Of {{task.steps.length}}

                        <img src="@/assets/design-material/icons/process.png" alt="task steps" title="task steps">
                    </span>

                    <span class="note" v-if="task.note">
                        Note <img src="@/assets/design-material/icons/notes.png" alt="task notes" title="task notes">
                    </span>
                </span>
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
    props: ['listId', 'toggleShrink'],
    computed: {
        ...mapState(allLists, ['returnLists']),
        ...mapWritableState(allLists, ['lists']),
    },
    data() {
        return {
            importantTask: {},
            shrink: this.toggleShrink,
            taskId: 0,
            oldTaskId: 0,
            stepsCount: 0
        }
    },
    watch: {
        // allTask() {
        //     console.log(this.allTask);
        // }
    },
    methods: {
        openDescription() {

            console.log(event.target.getAttribute('data-id'));

            if (!this.toggleShrink) {
                this.shrink = !this.toggleShrink
                this.$emit('openDescriptionEvent', this.listId, event.target.getAttribute('data-id'), this.shrink)
            } else {
                this.shrink = !this.toggleShrink
                this.$emit('openDescriptionEvent', this.listId, event.target.getAttribute('data-id'), this.shrink)
            }

            // this.shrink = !this.shrink
            // this.$emit('openDescriptionEvent', this.listId, event.target.getAttribute('data-id'), this.shrink)

            // this.taskId = event.target.getAttribute('data-id')

            // if (+this.taskId != +this.oldTaskId) {
            //     this.oldTaskId = event.target.getAttribute('data-id')


            //     this.shrink = true
            //     this.$emit('openDescriptionEvent', this.listId, event.target.getAttribute('data-id'), this.shrink)
            // } else {
            //     this.shrink = false

            //     this.oldTaskId = 0
            //     this.$emit('openDescriptionEvent', this.listId, event.target.getAttribute('data-id'), this.shrink)
            // }
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