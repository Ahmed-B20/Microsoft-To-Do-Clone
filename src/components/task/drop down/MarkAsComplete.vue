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
    props: ['listId', 'childId', 'taskElementId', 'taskElements', 'selectTask'],
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
            if (!!this.selectTask.childListId) {
                return this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].complete
            } else {
                return this.lists[this.selectTask.listId].tasks[this.selectTask.id].complete
            }
        }
    },
    methods: {
        completeTask() {
            if (!!this.selectTask.childListId) {
                if (this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].complete) {
                    this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].complete = false
                } else {
                    if (this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].repeatedTask) {
                        this.calcDueDate(true)
                    }
                    else {
                        this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].complete = true
                    }
                }

                if (this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].steps.length > 0) {
                    this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].steps.forEach((step) => {
                        if (this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].complete) {
                            step.complete = true
                        } else {
                            step.complete = false
                        }
                    })
                }
            } else {
                if (this.lists[this.selectTask.listId].tasks[this.selectTask.id].complete) {
                    this.lists[this.selectTask.listId].tasks[this.selectTask.id].complete = false
                } else {
                    if (this.lists[this.selectTask.listId].tasks[this.selectTask.id].repeatedTask) {
                        this.calcDueDate(false)
                    }
                    else {
                        this.lists[this.selectTask.listId].tasks[this.selectTask.id].complete = true
                    }
                }
                this.lists[this.selectTask.listId].tasks[this.selectTask.id].steps.forEach((step) => {
                    if (this.lists[this.selectTask.listId].tasks[this.selectTask.id].complete) {
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

            if (this.taskElements[this.selectTask.id].classList.contains('add-animation-x')) {
                this.taskElements[this.selectTask.id].classList.remove('add-animation-x')
                setTimeout(() => {
                    this.taskElements[this.selectTask.id].classList.add('add-animation-x')
                }, 0)
            } else {
                this.taskElements[this.selectTask.id].classList.remove('add-animation-x')
                setTimeout(() => {
                    this.taskElements[this.selectTask.id].classList.add('add-animation-x')
                }, 0)
            }
        },
        calcDueDate(childList) {
            if (childList) {
                this.oldObj = this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id]
                this.transferObj()
                this.repeatedTaskObject.id = this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks.length
            } else {
                this.oldObj = this.lists[this.selectTask.listId].tasks[this.selectTask.id]
                this.transferObj()
                this.repeatedTaskObject.id = this.lists[this.selectTask.listId].tasks.length
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
                this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks.push(this.repeatedTaskObject)
                this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].complete = true
                this.lists[this.selectTask.listId].listsArray[this.selectTask.childListId].tasks[this.selectTask.id].repeatedTask = false
            } else {
                this.lists[this.selectTask.listId].tasks.push(this.repeatedTaskObject)
                this.lists[this.selectTask.listId].tasks[this.selectTask.id].complete = true
                this.lists[this.selectTask.listId].tasks[this.selectTask.id].repeatedTask = false
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