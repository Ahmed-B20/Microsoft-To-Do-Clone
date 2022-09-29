<template>
    <li :class="{complete: task.complete}" v-for="task in returnLists[listId].tasks" :key="task.id" :data-id="task.id">
        <span :data-id="task.id" @click="completeTask" class="check">
            <img src="@/assets/design-material/icons/check.png" alt="check" />
        </span>
        <span class="task-name" :class="{complete: task.complete}">
            {{task.name}}
        </span>

        <img src="@" alt="">
    </li>
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
    watch: {
        // allTask() {
        //     console.log(this.allTask);
        // }
    },
    methods: {
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