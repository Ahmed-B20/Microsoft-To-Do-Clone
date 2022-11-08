<template>
    <span @click="completeAsideTask" class="check">
        <img src="@/assets/design-material/icons/check.png" alt="check" />
    </span>
</template>

<script>
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'CompleteToggle',
    props: ['taskIndex', 'task', 'descriptionTaskList', 'descriptionTaskChildList', 'element'],
    data() {
        return {
            taskElement: '',
            importantTask: {},
            repeatedTaskObject: {},
            name: '',
            oldObj: {}
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists', 'smartList']),
        ...mapWritableState(allLists, ['lists', 'smartList']),
    },
    methods: {
        completeAsideTask() {
            if (!!this.descriptionTaskChildList) {
                this.taskElement = event.target.parentElement

                if (this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].complete) {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].complete = false
                } else {
                    if (this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].repeatedTask) {
                        this.calcDueDate(true)
                    }
                    else {
                        this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].complete = true
                    }
                }

                if (this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].steps.length > 0) {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].steps.forEach((step) => {
                        if (this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].complete) {
                            step.complete = true
                        } else {
                            step.complete = false
                        }
                    })
                }
            } else {
                this.taskElement = event.target.parentElement

                if (this.lists[this.descriptionTaskList].tasks[this.taskIndex].complete) {
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].complete = false
                } else {
                    if (this.lists[this.descriptionTaskList].tasks[this.taskIndex].repeatedTask) {
                        this.calcDueDate(false)
                    }
                    else {
                        this.lists[this.descriptionTaskList].tasks[this.taskIndex].complete = true
                    }
                }
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].steps.forEach((step) => {
                    if (this.lists[this.descriptionTaskList].tasks[this.taskIndex].complete) {
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
                this.oldObj = this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex]
                this.transferObj()
                this.repeatedTaskObject.id = this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks.length
            } else {
                this.oldObj = this.lists[this.descriptionTaskList].tasks[this.taskIndex]
                this.transferObj()
                this.repeatedTaskObject.id = this.lists[this.descriptionTaskList].tasks.length
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
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks.push(this.repeatedTaskObject)
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].complete = true
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].repeatedTask = false
            } else {
                this.lists[this.descriptionTaskList].tasks.push(this.repeatedTaskObject)
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].complete = true
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].repeatedTask = false
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