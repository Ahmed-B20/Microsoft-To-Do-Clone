<template>
    <div class="task-description">

        <div class="task-time-and-delete">
            <div class="time">Created on {{task.addTime}}</div>

            <span class="delete">
                <img @click="deleteTask" src="@/assets/design-material/icons/delete.png" alt="">
            </span>
        </div>
    </div>
</template>

<script>
import { allLists } from '@/stores/allLists.js'

import { mapState, mapWritableState } from 'pinia'


export default {
    name: 'DescriptionTask',
    props: ['descriptionTaskList', 'descriptionTaskIndex'],
    beforeMount() {
        this.task = this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex]
    },
    data() {
        return {
            task: {}
        }
    },
    computed: {
        ...mapWritableState(allLists, ['lists']),
    },
    methods: {
        deleteTask() {
            console.log(this.descriptionTaskList);
            console.log(this.descriptionTaskIndex);

            this.lists[this.descriptionTaskList].tasks.splice(this.descriptionTaskIndex, 1)

            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))

            this.$emit('closeDescription', false)
        }
    }
}
</script>