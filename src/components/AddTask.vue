<template>
    <div class="add-task">
        <div class="add-task-container" :class="{ error: errorToggle }">
            <span :class="{ active: activeToggle }" ref="addTask" @click="addTaskToList">
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
    props: ['chosenSmartList'],
    inject: ['chosenListId', 'chosenChildIdListId'],
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
        ...mapWritableState(allLists, ['lists', 'smartList']),
    },
    methods: {
        addTaskToList() {
            if (this.inputValue.length > 0) {
                this.errorToggle = false

                this.allLists = this.returnLists || []
                if (!!this.chosenSmartList) {
                    this.chosenList = this.smartList[this.chosenSmartList]
                } else {
                    if (!!this.chosenListId() && !this.chosenChildIdListId()) {
                        this.chosenList = this.allLists[this.chosenListId()]
                    } else {
                        this.chosenList = this.allLists[this.chosenListId()].listsArray[this.chosenChildIdListId()]
                    }
                }

                this.chosenListTasks = this.chosenList.tasks

                this.taskId = this.chosenList.tasks.length

                this.taskObj.name = this.inputValue
                this.taskObj.id = this.taskId
                this.taskObj.listId = this.chosenListId()
                this.taskObj.childListId = this.chosenChildIdListId()
                this.taskObj.complete = false

                if (+this.chosenListId() === 1) {
                    this.taskObj.important = true
                } else {
                    this.taskObj.important = false
                }


                // for now
                let today = new Date();
                let dd = String(today.getDate()).padStart(2, '0');
                let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                let yyyy = today.getFullYear();
                today = mm + '/' + dd + '/' + yyyy;
                // for now

                this.taskObj.sortTime = new Date()
                this.taskObj.addTime = today


                this.taskObj.repeatDueDate = ''
                this.taskObj.repeatDueDateName = ''
                this.taskObj.realRepeatDueDateName = ''
                this.taskObj.repeatedTask = false
                this.taskObj.repeatedCustomTaskDuration = ''

                this.taskObj.remindMe = ''
                this.taskObj.remindMeDate = ''
                this.taskObj.remindMeName = ''

                if (+this.chosenListId() === 0) {
                    this.taskObj.addToMyDay = true
                } else {
                    this.taskObj.addToMyDay = false
                }

                this.taskObj.note = ''
                this.taskObj.noteDate = null
                this.taskObj.noteModified = false
                this.taskObj.modifiedDate = null

                this.taskObj.snooze = false

                if (+this.chosenListId() === 2) {
                    this.taskObj.dueDate = new Date()
                    this.taskObj.dueDateName = 'ToDay'
                    this.taskObj.realDueDateName = 'ToDay'
                } else {
                    this.taskObj.dueDate = ''
                    this.taskObj.dueDateName = ''
                    this.taskObj.realDueDateName = ''
                }

                // switch (this.chosenSmartList) {
                //     case 'important':
                //         this.taskObj.important = true
                //         break;

                //     case 'myDay':
                //         this.taskObj.addToMyDay = true
                //         break;

                //     case 'planned':
                //         this.taskObj.dueDate = new Date()
                //         this.taskObj.dueDateName = 'ToDay'
                //         this.taskObj.realDueDateName = 'ToDay'
                //         break;
                // }


                this.taskObj.steps = []
                this.chosenListTasks.push(this.taskObj)
                this.$refs.taskInput.value = ''
                this.inputValue = ''
                this.taskObj = {}



                this.taskId++
                localStorage.setItem("allListAndTasks", JSON.stringify(this.allLists))
                localStorage.setItem("allSmartLists", JSON.stringify(this.smartList))
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