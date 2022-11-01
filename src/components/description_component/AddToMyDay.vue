<template>
    <div class="task-box add-to-my-day" @click="addToMyDay" v-if="!addToMyDayState">
        <img src="@/assets/design-material/icons/sun.png" alt="added to my day">
        <span>Add to my day</span>
    </div>

    <div class="task-box add-to-my-day" @click="closeToMyDay" v-else>
        <img src="@/assets/design-material/icons/sun.png" alt="remove from my day">
        <span>Remove from my day</span>
    </div>
</template>

<script>
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'AddToMyDayToggle',
    props: ['descriptionTaskList', 'descriptionTaskChildList', 'taskIndex', 'descriptionTaskIndex'],
    data() {
        return {
            addToMyDayState: false,
        }
    },
    beforeMount() {
        if (!!this.descriptionTaskChildList) {
            this.addToMyDayState = this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].addToMyDay
        } else {
            this.addToMyDayState = this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].addToMyDay
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists', 'smartList']),
        ...mapWritableState(allLists, ['lists', 'smartList']),
    },
    methods: {
        addToMyDay() {
            if (!!this.descriptionTaskChildList) {
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].addToMyDay = true
                this.smartList.myDay.tasks.push(this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex])
                // this.smartList.myDay.tasks[this.smartList.myDay.tasks.length] = this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex]
            } else {
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].addToMyDay = true
                this.smartList.myDay.tasks.push(this.lists[this.descriptionTaskList].tasks[this.taskIndex])
                // this.smartList.myDay.tasks[this.smartList.myDay.tasks.length] = this.lists[this.descriptionTaskList].tasks[this.taskIndex]
            }
            localStorage.setItem("allSmartLists", JSON.stringify(this.smartList))
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            this.addToMyDayState = true
        },
        closeToMyDay() {
            if (!!this.childId) {
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].addToMyDay = false
                this.smartList.myDay.tasks.splice(this.taskIndex, 1)
            } else {
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].addToMyDay = false
                this.smartList.myDay.tasks.splice(this.taskIndex, 1)
            }
            localStorage.setItem("allSmartLists", JSON.stringify(this.smartList))
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            this.addToMyDayState = false
        }
    }
}
</script>