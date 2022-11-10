<template>
    <span @click="completeTask" class="check">
        <img src="@/assets/design-material/icons/check.png" alt="check" />
    </span>
</template>

<script>
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'Complete',
    props: ['listId', 'childId', 'index', 'task'],
    data() {
        return {
            taskElement: '',
            repeatedTaskObject: {},
            thisTask: null,
            name: '',
            oldObj: {}
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists', 'smartList']),
        ...mapWritableState(allLists, ['lists', 'smartList']),
    },
    methods: {
        completeTask() {
            console.log(this.task);
            this.thisTask = this.index
            if (event.target.parentElement.tagName === 'SPAN') {
                this.taskElement = event.target.parentElement.parentElement
            } else {
                this.taskElement = event.target.parentElement
            }

            if (!!this.task.childListId) {
                if (this.lists[this.task.listId].listsArray[this.childId].tasks[this.task.id].complete) {
                    this.lists[this.task.listId].listsArray[this.childId].tasks[this.task.id].complete = false
                } else {
                    if (this.lists[this.task.listId].listsArray[this.childId].tasks[this.task.id].repeatedTask) {
                        this.calcDueDate(true)
                    }
                    else {
                        this.lists[this.task.listId].listsArray[this.childId].tasks[this.task.id].complete = true
                    }
                }

                if (this.lists[this.task.listId].listsArray[this.childId].tasks[this.thisTask].steps.length > 0) {
                    this.lists[this.task.listId].listsArray[this.childId].tasks[this.thisTask].steps.forEach((step) => {
                        if (this.lists[this.task.listId].listsArray[this.childId].tasks[this.thisTask].complete) {
                            step.complete = true
                        } else {
                            step.complete = false
                        }
                    })
                }
            } else {
                if (this.lists[this.task.listId].tasks[this.task.id].complete) {
                    this.lists[this.task.listId].tasks[this.task.id].complete = false
                } else {
                    if (this.lists[this.task.listId].tasks[this.task.id].repeatedTask) {
                        this.calcDueDate(false)
                    }
                    else {
                        this.lists[this.task.listId].tasks[this.task.id].complete = true
                    }
                }

                this.lists[this.task.listId].tasks[this.thisTask].steps.forEach((step) => {
                    if (this.lists[this.task.listId].tasks[this.thisTask].complete) {
                        step.complete = true
                    } else {
                        step.complete = false
                    }
                })

            }
            this.repeatedTaskObject = {}
            this.completeTaskStatus = !this.completeTaskStatus
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))

            if (this.taskElement.classList.contains('add-animation-x')) {
                this.taskElement.classList.remove('add-animation-x')
                setTimeout(() => {
                    this.taskElement.classList.add('add-animation-x')
                }, 0)
            } else {
                this.taskElement.classList.remove('add-animation-x')
                setTimeout(() => {
                    this.taskElement.classList.add('add-animation-x')
                }, 0)
            }
        },
        calcDueDate(childList) {
            if (childList) {
                this.oldObj = this.lists[this.task.listId].listsArray[this.childId].tasks[this.task.id]
                this.transferObj()
                this.repeatedTaskObject.id = this.lists[this.task.listId].listsArray[this.childId].tasks.length
            } else {
                this.oldObj = this.lists[this.task.listId].tasks[this.task.id]
                this.transferObj()
                this.repeatedTaskObject.id = this.lists[this.task.listId].tasks.length
            }

            if (this.repeatedTaskObject.realRepeatDueDateName === 'Daily') {
                this.calcDate(1, "ToDay")
            } else if (this.repeatedTaskObject.realRepeatDueDateName === 'WeekDays') {
                if (new Date(new Date(this.oldObj.repeatDueDate).setDate(new Date(this.oldObj.repeatDueDate).getDate() + 1)).getDay() === 6) {
                    this.calcDate(3, "Tomorrow")
                } else if (new Date(new Date(this.oldObj.repeatDueDate).setDate(new Date(this.oldObj.repeatDueDate).getDate() + 1)).getDay() === 0) {
                    this.calcDate(2, "Tomorrow")
                } else {
                    this.calcDate(1, "Tomorrow")
                }
            } else if (this.repeatedTaskObject.realRepeatDueDateName === 'Weekly') {
                this.calcDate(7, "NextWeek")
            } else if (this.repeatedTaskObject.realRepeatDueDateName === 'Monthly') {
                this.calcDate(30, "NextMonth")
            } else if (this.repeatedTaskObject.realRepeatDueDateName === 'Yearly') {
                this.calcDate(365, "NextYear")
            } else if (this.repeatedTaskObject.realRepeatDueDateName === 'CustomDate') {
                this.calcDate(this.oldObj.repeatedCustomTaskDuration, "CustomDate")
            }

            if (childList) {
                this.lists[this.task.listId].listsArray[this.childId].tasks.push(this.repeatedTaskObject)
                this.lists[this.task.listId].listsArray[this.childId].tasks[this.task.id].complete = true
                this.lists[this.task.listId].listsArray[this.childId].tasks[this.task.id].repeatedTask = false
            } else {
                this.lists[this.task.listId].tasks.push(this.repeatedTaskObject)
                this.lists[this.task.listId].tasks[this.task.id].complete = true
                this.lists[this.task.listId].tasks[this.task.id].repeatedTask = false
            }

            this.repeatedTaskObject = {}
            this.name = ''
        },
        calcDate(time, timeName) {
            this.repeatedTaskObject.repeatDueDate = new Date(new Date(this.oldObj.repeatDueDate).setDate(new Date(this.oldObj.repeatDueDate).getDate() + time))
            this.name = new Date(this.repeatedTaskObject.repeatDueDate).toString().split(' ')
            this.repeatedTaskObject.repeatDueDateName = this.name.slice(0, 4).join(' ')


            this.repeatedTaskObject.dueTime = new Date(new Date(this.oldObj.repeatDueDate).setDate(new Date(this.oldObj.repeatDueDate).getDate() + time))
            this.repeatedTaskObject.dueDateName = this.name.slice(0, 4).join(' ')
            this.repeatedTaskObject.realDueDateName = timeName
        },
        transferObj() {
            Object.keys(this.oldObj).forEach((key) => {
                this.repeatedTaskObject[`${key}`] = this.oldObj[`${key}`]
            })
        }
    }
}
</script>