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
    props: ['listId', 'childId', 'taskElementId', 'taskElements', 'selectTask'],
    data() {
        return {
            addToMyDayState: false,
        }
    },
    beforeMount() {
        if (!!this.selectTask.childListId) {
            this.taskName = this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].name
            this.addToMyDayState = this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].addToMyDay
        } else {
            this.taskName = this.lists[this.selectTask.listId].tasks[this.selectTask.id].name
            this.addToMyDayState = this.lists[this.selectTask.listId].tasks[this.selectTask.id].addToMyDay
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists', 'smartList']),
        ...mapWritableState(allLists, ['lists', 'smartList']),
    },
    methods: {
        addToMyDay() {
            if (!!this.selectTask.childListId) {
                this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].addToMyDay = true
                this.lists[0].tasks.push(this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id])

            } else {
                this.lists[this.selectTask.listId].tasks[this.selectTask.id].addToMyDay = true
                this.lists[0].tasks.push(this.lists[this.selectTask.listId].tasks[this.selectTask.id])
            }
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            this.$emit('componentEvent')

            this.addToMyDayState = true
        },
        closeToMyDay() {
            if (!!this.selectTask.childListId) {
                this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].addToMyDay = false


                if (+this.listId === 0) {
                    this.lists[0].tasks.splice(this.taskElementId, 1)
                } else {
                    this.lists[0].tasks.forEach((task, index) => {
                        if (+task.id === +this.taskElementId && +task.listId === +this.listId && +this.childListId === +task.childListId) {
                            this.lists[0].tasks.splice(index, 1)
                        }
                    })
                }
            } else {
                this.lists[this.selectTask.listId].tasks[this.selectTask.id].addToMyDay = false

                if (+this.listId === 0) {
                    this.lists[0].tasks.splice(this.taskElementId, 1)
                } else {
                    this.lists[0].tasks.forEach((task, index) => {
                        if (+task.id === +this.taskElementId && +task.listId === +this.listId) {
                            this.lists[0].tasks.splice(index, 1)
                        }
                    })
                }
            }
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            this.$emit('componentEvent')

            this.addToMyDayState = false
        }
    }
}
</script>