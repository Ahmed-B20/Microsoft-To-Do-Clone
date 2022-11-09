<template>
    <div @click="completeTask">
        <img v-if="returnCompleteState" src="@/assets/design-material/icons/complete.png" alt="complete task">

        <img v-else src="@/assets/design-material/icons/dry-clean.png" alt="not complete task">

        <span>{{ returnCompleteState ? 'Mark As Not Complete' : 'Mark As Complete' }}</span>
    </div>
</template>

<script>
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'MarkAsComplete',
    props: ['listId', 'childId', 'taskElementId', 'taskElements'],
    data() {
        return {
            repeatedTaskObject: {},
            name: '',
            oldObj: {}
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists', 'smartList']),
        ...mapWritableState(allLists, ['lists', 'smartList']),

        returnCompleteState() {
            if (!!this.childId) {
                return this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].complete
            } else {
                return this.lists[this.listId].tasks[this.taskElementId].complete
            }
        }
    },
    methods: {
        completeTask() {
            if (!!this.childId) {
                if (this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].complete) {
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].complete = false
                } else {
                    if (this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].repeatedTask) {
                        this.calcDueDate(true)
                    }
                    else {
                        this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].complete = true
                    }
                }

                if (this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].steps.length > 0) {
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].steps.forEach((step) => {
                        if (this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].complete) {
                            step.complete = true
                        } else {
                            step.complete = false
                        }
                    })
                }
            } else {
                if (this.lists[this.listId].tasks[this.taskElementId].complete) {
                    this.lists[this.listId].tasks[this.taskElementId].complete = false
                } else {
                    if (this.lists[this.listId].tasks[this.taskElementId].repeatedTask) {
                        this.calcDueDate(false)
                    }
                    else {
                        this.lists[this.listId].tasks[this.taskElementId].complete = true
                    }
                }
                this.lists[this.listId].tasks[this.taskElementId].steps.forEach((step) => {
                    if (this.lists[this.listId].tasks[this.taskElementId].complete) {
                        step.complete = true
                    } else {
                        step.complete = false
                    }
                })

            }
            this.repeatedTaskObject = {}
            this.completeTaskStatus = !this.completeTaskStatus
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))

            this.$emit('componentEvent')

            if (this.taskElements[this.taskElementId].classList.contains('add-animation-x')) {
                this.taskElements[this.taskElementId].classList.remove('add-animation-x')
                setTimeout(() => {
                    this.taskElements[this.taskElementId].classList.add('add-animation-x')
                }, 0)
            } else {
                this.taskElements[this.taskElementId].classList.remove('add-animation-x')
                setTimeout(() => {
                    this.taskElements[this.taskElementId].classList.add('add-animation-x')
                }, 0)
            }
        },
        calcDueDate(childList) {
            if (childList) {
                this.oldObj = this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId]
                this.transferObj()
                this.repeatedTaskObject.id = this.lists[this.listId].listsArray[this.childId].tasks.length
            } else {
                this.oldObj = this.lists[this.listId].tasks[this.taskElementId]
                this.transferObj()
                this.repeatedTaskObject.id = this.lists[this.listId].tasks.length
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
                this.lists[this.listId].listsArray[this.childId].tasks.push(this.repeatedTaskObject)
                this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].complete = true
                this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].repeatedTask = false
            } else {
                this.lists[this.listId].tasks.push(this.repeatedTaskObject)
                this.lists[this.listId].tasks[this.taskElementId].complete = true
                this.lists[this.listId].tasks[this.taskElementId].repeatedTask = false
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