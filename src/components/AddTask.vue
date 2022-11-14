<template>
    <div class="add-task">
        <div class="add-task-container" :class="{ error: errorToggle }">
            <template v-if="+listId !== 4">
                <span :class="{ active: activeToggle }" ref="addTask" @click="addTaskToList">
                    <img src="@/assets/design-material/icons/plus.png" alt="add-task" />
                </span>

                <input @keypress.enter="addTaskToList" required placeholder="add task" v-model="inputValue"
                    ref="taskInput" type="text">
            </template>

            <template v-else>
                <input @keyup="SearchForTask" required placeholder="Search For Task" v-model="inputValue"
                    ref="taskInput" type="text">

                <span :class="{ active: activeToggle }" @click="SearchForTask($event)">
                    <img src="@/assets/design-material/icons/search.png" alt="task-search" />
                </span>
            </template>
        </div>
    </div>
</template>

<script>
import { statistics } from '@/stores/statistics.js'
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'MainContent',
    props: ['chosenSmartList', 'listId'],
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
        ...mapWritableState(allLists, ['lists']),
        ...mapWritableState(statistics, ['statistics']),
    },
    methods: {
        addTaskToList() {
            if (this.inputValue.length > 0) {
                this.errorToggle = false

                this.allLists = this.returnLists || []
                if (!!this.chosenListId() && !this.chosenChildIdListId()) {
                    this.chosenList = this.allLists[this.chosenListId()]
                } else {
                    this.chosenList = this.allLists[this.chosenListId()].listsArray[this.chosenChildIdListId()]
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

                this.taskObj.steps = []
                this.chosenListTasks.push(this.taskObj)
                this.$refs.taskInput.value = ''
                this.inputValue = ''
                this.taskObj = {}


                this.statistics.allTasks.allTasks++
                localStorage.setItem("allListAndTasksStatistics", JSON.stringify(this.statistics));

                this.taskId++
                localStorage.setItem("allListAndTasks", JSON.stringify(this.allLists))
                this.lists = this.allLists

            } else {
                if (this.errorToggle) {
                    this.errorToggle = false
                    setTimeout(() => {
                        this.errorToggle = true
                    }, 0)
                } else {
                    setTimeout(() => {
                        this.errorToggle = true
                    }, 0)
                }
            }
        },
        SearchForTask(event) {
            if (this.inputValue.length > 0) {
                this.lists[4].tasks = []
                this.lists.slice(5).forEach((list) => {
                    if (list.listChildren) {
                        list.listsArray.forEach((childList) => {
                            childList.tasks.forEach((task) => {
                                if (task.name.includes(this.inputValue)) {
                                    this.lists[4].tasks.push(task)
                                }
                            })
                        })
                    } else {
                        list.tasks.forEach((task) => {
                            if (task.name.includes(this.inputValue)) {
                                this.lists[4].tasks.push(task)
                            }
                        })
                    }
                })
            } else {
                if (+event.keyCode !== 8) {
                    if (this.errorToggle) {
                        this.errorToggle = false
                        setTimeout(() => {
                            this.errorToggle = true
                        }, 0)
                    } else {
                        setTimeout(() => {
                            this.errorToggle = true
                        }, 0)
                    }
                }
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
                this.lists[4].tasks = []
            }
        }
    }
}
</script>