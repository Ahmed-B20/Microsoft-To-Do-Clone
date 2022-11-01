<template>
    <div @click="addToMyDay" v-if="!addToMyDayState">
        <img src="@/assets/design-material/icons/sun.png" alt="added to my day">
        <span>Add to my day</span>
    </div>

    <div @click="closeToMyDay" v-else>
        <img src="@/assets/design-material/icons/sun.png" alt="">
        <span>Remove from my day</span>
    </div>
</template>

<script>
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'AddToMyDay',
    props: ['listId', 'childId', 'taskElementId', 'taskElements'],
    data() {
        return {
            addToMyDayState: false,
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
    },
    methods: {
        addToMyDay() {
            if (!!this.childId) {
                this.lists[this.listId].listsArray[this.childId].tasks[this.taskIndex].addToMyDay = true
                this.smartList.myDay.tasks.push(this.lists[this.listId].listsArray[this.childId].tasks[this.taskIndex])
            } else {
                this.lists[this.listId].tasks[this.taskElementId].addToMyDay = true
                this.smartList.myDay.tasks.push(this.lists[this.listId].tasks[this.taskElementId])
            }
            localStorage.setItem("allSmartLists", JSON.stringify(this.smartList))
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            this.$emit('componentEvent')
        },
        closeToMyDay() {
            if (!!this.childId) {
                this.lists[this.listId].listsArray[this.childId].tasks[this.taskIndex].addToMyDay = false
                this.smartList.myDay.tasks.push(this.lists[this.listId].listsArray[this.childId].tasks[this.taskIndex])
            } else {
                this.lists[this.listId].tasks[this.taskElementId].addToMyDay = false
                this.smartList.myDay.tasks.push(this.lists[this.listId].tasks[this.taskElementId])
            }
            localStorage.setItem("allSmartLists", JSON.stringify(this.smartList))
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            this.$emit('componentEvent')
        }
    }
}
</script>