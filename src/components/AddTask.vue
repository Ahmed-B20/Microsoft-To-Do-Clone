<template>
    <div class="add-task">
        <div class="add-task-container" :class="{error:errorToggle}">
            <span :class="{active:activeToggle}" ref="addTask" @click="addTaskToList">
                <img src="@/assets/design-material/icons/plus.png" alt="add-task" />
            </span>

            <input @keyup.enter="addTaskToList" required placeholder="add task" v-model="inputValue" ref="taskInput"
                type="text">
        </div>
    </div>
</template>

<script>
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'MainContent',
    // props: ['chosenListIdProp'],
    inject: ['chosenListId'],
    data() {
        return {
            inputValue: '',
            activeToggle: false,
            errorToggle: false,
            allLists: [],
            chosenList: [],
            chosenListTasks: [],
            taskObj: {},
            taskId: 0
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists']),
        ...mapWritableState(allLists, ['lists']),
    },
    methods: {
        addTaskToList() {
            if (this.inputValue.length > 0) {
                this.errorToggle = false


                // this.allLists = JSON.parse(localStorage.getItem("allListAndTasks")) || []
                this.allLists = this.returnLists || []
                this.chosenList = this.allLists[this.chosenListId()]

                this.chosenListTasks = this.chosenList.tasks

                this.taskId = this.chosenList.tasks.length

                this.taskObj.name = this.inputValue
                this.taskObj.id = this.taskId
                this.taskObj.complete = false
                this.chosenListTasks.push(this.taskObj)
                this.$refs.taskInput.value = ''
                this.inputValue = ''
                this.taskObj = {}

                this.taskId++
                localStorage.setItem("allListAndTasks", JSON.stringify(this.allLists))
                this.lists = this.allLists

            } else {
                this.errorToggle = true
            }
        }
    },
    watch: {
        inputValue() {
            if (this.inputValue.length > 0) {
                this.activeToggle = true
                this.errorToggle = false

            } else {
                this.activeToggle = false
            }
        }
    }
}
</script>