<template>
    <span :data-id="index" @click="completeTask" class="check">
        <img :data-id="index" src="@/assets/design-material/icons/check.png" alt="check" />
    </span>
</template>

<script>
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'Complete',
    props: ['listId', 'childId', 'index', 'task', 'index',],
    data() {
        return {
            taskElement: '',
            repeatedTaskObject: {},
            thisTask: null
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists', 'smartList']),
        ...mapWritableState(allLists, ['lists', 'smartList']),
    },
    methods: {
        completeTask() {
            if (!!this.childId) {
                if (event.target.tagName === 'SPAN') {
                    // this.thisTask = event.target.getAttribute('data-id') || this.index
                    this.thisTask = this.index

                    this.taskElement = event.target.parentElement

                    if (this.lists[this.listId].listsArray[this.childId].tasks[this.index].complete) {
                        this.lists[this.listId].listsArray[this.childId].tasks[this.index].complete = false
                    } else {
                        if (this.lists[this.listId].listsArray[this.childId].tasks[this.index].repeatedTask) {
                            this.calcDueDate(true)
                        }
                        else {
                            this.lists[this.listId].listsArray[this.childId].tasks[this.index].complete = true
                        }
                    }
                } else {
                    this.thisTask = this.index
                    this.taskElement = event.target.parentElement

                    if (this.lists[this.listId].listsArray[this.childId].tasks[this.index].complete) {
                        this.lists[this.listId].listsArray[this.childId].tasks[this.index].complete = false
                    } else {
                        if (this.lists[this.listId].listsArray[this.childId].tasks[this.index].repeatedTask) {
                            this.calcDueDate(true)
                        }
                        else {
                            this.lists[this.listId].listsArray[this.childId].tasks[this.index].complete = true
                        }
                    }
                }

                if (this.lists[this.listId].listsArray[this.childId].tasks[this.thisTask].steps.length > 0) {
                    this.lists[this.listId].listsArray[this.childId].tasks[this.thisTask].steps.forEach((step) => {
                        if (this.lists[this.listId].listsArray[this.childId].tasks[this.thisTask].complete) {
                            step.complete = true
                        } else {
                            step.complete = false
                        }
                    })
                }
            } else {
                if (event.target.tagName === 'SPAN') {

                    this.taskElement = event.target.parentElement

                    if (this.lists[this.listId].tasks[this.index].complete) {
                        this.lists[this.listId].tasks[this.index].complete = false
                    } else {
                        if (this.lists[this.listId].tasks[this.index].repeatedTask) {
                            this.calcDueDate(false)
                        }
                        else {
                            this.lists[this.listId].tasks[this.index].complete = true
                        }
                    }
                    this.thisTask = this.index
                } else {

                    this.taskElement = event.target.parentElement

                    if (this.lists[this.listId].tasks[this.index].complete) {
                        this.lists[this.listId].tasks[this.index].complete = false
                    } else {
                        if (this.lists[this.listId].tasks[this.index].repeatedTask) {
                            this.calcDueDate(false)
                        } else {
                            this.lists[this.listId].tasks[this.index].complete = true
                        }
                    }
                    this.thisTask = this.index
                }

                this.lists[this.listId].tasks[this.thisTask].steps.forEach((step) => {
                    if (this.lists[this.listId].tasks[this.thisTask].complete) {
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
            let oldObj
            if (childList) {
                oldObj = this.lists[this.listId].listsArray[this.childId].tasks[this.index]
                this.repeatedTaskObject.id = this.lists[this.listId].listsArray[this.childId].tasks.length
            } else {
                oldObj = this.lists[this.listId].tasks[this.index]
                this.repeatedTaskObject.id = this.lists[this.listId].tasks.length
            }

            Object.keys(oldObj).forEach((key) => {
                this.repeatedTaskObject[`${key}`] = oldObj[`${key}`]
            })

            if (this.repeatedTaskObject.realRepeatDueDateName === 'Daily') {
                this.repeatedTaskObject.repeatDueDate = new Date(new Date(oldObj.repeatDueDate).setDate(new Date(oldObj.repeatDueDate).getDate() + 1))
                let name = new Date(this.repeatedTaskObject.repeatDueDate).toString().split(' ')
                this.repeatedTaskObject.repeatDueDateName = name.slice(0, 4).join(' ')


                this.repeatedTaskObject.dueTime = new Date(new Date(oldObj.repeatDueDate).setDate(new Date(oldObj.repeatDueDate).getDate() + 1))
                this.repeatedTaskObject.dueDateName = name.slice(0, 4).join(' ')
                this.repeatedTaskObject.realDueDateName = "ToDay"
            } else if (this.repeatedTaskObject.realRepeatDueDateName === 'WeekDays') {
                if (new Date(new Date(oldObj.repeatDueDate).setDate(new Date(oldObj.repeatDueDate).getDate() + 1)).getDay() === 6) {
                    this.repeatedTaskObject.repeatDueDate = new Date(new Date(oldObj.repeatDueDate).setDate(new Date(oldObj.repeatDueDate).getDate() + 3))
                    this.repeatedTaskObject.dueTime = new Date(new Date(oldObj.repeatDueDate).setDate(new Date(oldObj.repeatDueDate).getDate() + 3))
                } else if (new Date(new Date(oldObj.repeatDueDate).setDate(new Date(oldObj.repeatDueDate).getDate() + 1)).getDay() === 0) {
                    this.repeatedTaskObject.repeatDueDate = new Date(new Date(oldObj.repeatDueDate).setDate(new Date(oldObj.repeatDueDate).getDate() + 2))
                    this.repeatedTaskObject.dueTime = new Date(new Date(oldObj.repeatDueDate).setDate(new Date(oldObj.repeatDueDate).getDate() + 2))
                } else {
                    this.repeatedTaskObject.repeatDueDate = new Date(new Date(oldObj.repeatDueDate).setDate(new Date(oldObj.repeatDueDate).getDate() + 1))
                    this.repeatedTaskObject.dueTime = new Date(new Date(oldObj.repeatDueDate).setDate(new Date(oldObj.repeatDueDate).getDate() + 1))
                }

                let name = new Date(this.repeatedTaskObject.repeatDueDate).toString().split(' ')
                this.repeatedTaskObject.repeatDueDateName = name.slice(0, 4).join(' ')
                this.repeatedTaskObject.dueDateName = name.slice(0, 4).join(' ')
                this.repeatedTaskObject.realDueDateName = "Tomorrow"
            } else if (this.repeatedTaskObject.realRepeatDueDateName === 'Weekly') {
                this.repeatedTaskObject.repeatDueDate = new Date(new Date(oldObj.repeatDueDate).setDate(new Date(oldObj.repeatDueDate).getDate() + 7))

                let name = new Date(this.repeatedTaskObject.repeatDueDate).toString().split(' ')
                this.repeatedTaskObject.repeatDueDateName = name.slice(0, 4).join(' ')

                this.repeatedTaskObject.dueTime = new Date(new Date(oldObj.repeatDueDate).setDate(new Date(oldObj.repeatDueDate).getDate() + 7))
                this.repeatedTaskObject.dueDateName = name.slice(0, 4).join(' ')
                this.repeatedTaskObject.realDueDateName = "NextWeek"
            } else if (this.repeatedTaskObject.realRepeatDueDateName === 'Monthly') {
                this.repeatedTaskObject.repeatDueDate = new Date(new Date(oldObj.repeatDueDate).setDate(new Date(oldObj.repeatDueDate).getDate() + 30))

                let name = new Date(this.repeatedTaskObject.repeatDueDate).toString().split(' ')
                this.repeatedTaskObject.repeatDueDateName = name.slice(0, 4).join(' ')

                this.repeatedTaskObject.dueTime = new Date(new Date(oldObj.repeatDueDate).setDate(new Date(oldObj.repeatDueDate).getDate() + 30))
                this.repeatedTaskObject.dueDateName = name.slice(0, 4).join(' ')
                this.repeatedTaskObject.realDueDateName = "NextMonth"
            } else if (this.repeatedTaskObject.realRepeatDueDateName === 'Yearly') {
                this.repeatedTaskObject.repeatDueDate = new Date(new Date(oldObj.repeatDueDate).setDate(new Date(oldObj.repeatDueDate).getDate() + 365))

                let name = new Date(this.repeatedTaskObject.repeatDueDate).toString().split(' ')
                this.repeatedTaskObject.repeatDueDateName = name.slice(0, 4).join(' ')

                this.repeatedTaskObject.dueTime = new Date(new Date(oldObj.repeatDueDate).setDate(new Date(oldObj.repeatDueDate).getDate() + 365))
                this.repeatedTaskObject.dueDateName = name.slice(0, 4).join(' ')
                this.repeatedTaskObject.realDueDateName = "NextYear"
            } else if (this.repeatedTaskObject.realRepeatDueDateName === 'CustomDate') {
                // this.repeatedTaskObject.repeatDueDate = new Date(oldObj.repeatDueDate) + new Date(oldObj.repeatDueDate)
                this.repeatedTaskObject.repeatDueDate = new Date(new Date(oldObj.repeatDueDate).setDate(new Date(oldObj.repeatDueDate).getDate() + oldObj.repeatedCustomTaskDuration))

                let name = new Date(this.repeatedTaskObject.repeatDueDate).toString().split(' ')
                this.repeatedTaskObject.repeatDueDateName = name.slice(0, 4).join(' ')

                this.repeatedTaskObject.dueTime = new Date(new Date(oldObj.repeatDueDate).setDate(new Date(oldObj.repeatDueDate).getDate() + oldObj.repeatedCustomTaskDuration))
                this.repeatedTaskObject.dueDateName = name.slice(0, 4).join(' ')
                this.repeatedTaskObject.realDueDateName = "CustomDate"
            }

            if (childList) {
                this.lists[this.listId].listsArray[this.childId].tasks.push(this.repeatedTaskObject)
                this.lists[this.listId].listsArray[this.childId].tasks[this.index].complete = true
                this.lists[this.listId].listsArray[this.childId].tasks[this.index].repeatedTask = false
            } else {
                this.lists[this.listId].tasks.push(this.repeatedTaskObject)
                this.lists[this.listId].tasks[this.index].complete = true
                this.lists[this.listId].tasks[this.index].repeatedTask = false
            }
        }
    }
}
</script>