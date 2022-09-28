<template>
    <div class="view-content-container">
        <div class="title">
            <h1>
                <slot name="title"></slot>
            </h1>
        </div>


        <ul class="tasks">
            <slot name="allTask"></slot>
        </ul>


        <div class="add-task">
            <div class="add-task-container" :class="{error:errorToggle}">
                <span :class="{active:activeToggle}" ref="addTask" @click="addTaskToList">
                    <img src="@/assets/design-material/icons/plus.png" alt="add-task" />
                </span>

                <input placeholder="add task" v-model="inputValue" ref="taskInput" type="text">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MainContent',
    props: ['chosenListId', 'tasks'],
    data() {
        return {
            inputValue: '',
            activeToggle: false,
            errorToggle: false,
            allLists: [],
            chosenList: [],
            chosenListTasks: [],
            taskObj: {}
        }
    },
    methods: {
        addTaskToList() {
            if (this.inputValue.length > 0) {
                this.errorToggle = false

                this.allLists = JSON.parse(localStorage.getItem("allListAndTasks")) || []
                this.chosenList = this.allLists[this.chosenListId]
                console.log(this.chosenList);

                this.chosenListTasks = this.chosenList.tasks
                console.log(this.chosenListTask);
                this.taskObj.name = this.inputValue
                this.chosenListTasks.push(this.taskObj)
                this.$refs.taskInput.value = ''
                this.taskObj = {}

                localStorage.setItem("allListAndTasks", JSON.stringify(this.allLists))
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