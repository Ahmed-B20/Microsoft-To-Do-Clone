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
            this.addToMyDayState = this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].addToMyDay
        } else {
            this.taskName = this.lists[this.listId].tasks[this.taskElementId].name
            this.addToMyDayState = this.lists[this.listId].tasks[this.taskElementId].addToMyDay
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists', 'smartList']),
        ...mapWritableState(allLists, ['lists', 'smartList']),
    },
    methods: {
        addToMyDay() {
            if (!!this.childId) {
                this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].addToMyDay = true
                this.lists[0].tasks.push(this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId])

            } else {
                this.lists[this.listId].tasks[this.taskElementId].addToMyDay = true
                this.lists[0].tasks.push(this.lists[this.listId].tasks[this.taskElementId])
            }
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            this.$emit('componentEvent')

            this.addToMyDayState = true
        },
        closeToMyDay() {
            if (!!this.childId) {
                this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].addToMyDay = false

                this.lists[0].tasks.forEach((task, index) => {
                    if (+task.id === +this.taskElementId && +task.listId === +this.listId && +this.childId === +task.childListId) {
                        this.lists[0].tasks.splice(index, 1)
                    }
                })
            } else {
                this.lists[this.listId].tasks[this.taskElementId].addToMyDay = false

                this.lists[0].tasks.forEach((task, index) => {
                    if (+task.id === +this.taskElementId && +task.listId === +this.listId) {
                        this.lists[0].tasks.splice(index, 1)
                    }
                })
            }
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            this.$emit('componentEvent')

            this.addToMyDayState = false
        }
    }
}
</script>