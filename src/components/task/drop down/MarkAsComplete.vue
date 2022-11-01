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
            taskElement: '',
            repeatedTaskObject: {},
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
                if (event.target.tagName === 'SPAN') {
                    this.thisTask = event.target.getAttribute('data-id') || this.taskElementId

                    this.taskElements.forEach((task) => {
                        if (+task.getAttribute('data-id') === +this.taskElementId) {
                            this.taskElement = task
                        }
                    })

                    if (this.lists[this.listId].listsArray[this.childId].tasks[event.target.getAttribute('data-id') || this.taskElementId].complete) {
                        this.lists[this.listId].listsArray[this.childId].tasks[event.target.getAttribute('data-id') || this.taskElementId].complete = false
                    } else {
                        if (this.lists[this.listId].listsArray[this.childId].tasks[event.target.getAttribute('data-id') || this.taskElementId].repeatedTask) {
                            let oldObj = this.lists[this.listId].listsArray[this.childId].tasks[event.target.getAttribute('data-id') || this.taskElementId]

                            Object.keys(oldObj).forEach((key) => {
                                this.repeatedTaskObject[`${key}`] = oldObj[`${key}`]
                            })

                            this.repeatedTaskObject.id = this.lists[this.listId].listsArray[this.childId].tasks.length

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

                            this.lists[this.listId].listsArray[this.childId].tasks.push(this.repeatedTaskObject)

                            this.lists[this.listId].listsArray[this.childId].tasks[event.target.getAttribute('data-id') || this.taskElementId].complete = true
                            this.lists[this.listId].listsArray[this.childId].tasks[event.target.getAttribute('data-id') || this.taskElementId].repeatedTask = false
                        }
                        else {
                            this.lists[this.listId].listsArray[this.childId].tasks[event.target.getAttribute('data-id') || this.taskElementId].complete = true
                        }
                    }
                } else {
                    this.thisTask = event.target.parentElement.getAttribute('data-id') || this.taskElementId

                    this.taskElements.forEach((task) => {
                        if (+task.getAttribute('data-id') === +this.taskElementId) {
                            this.taskElement = task
                        }
                    })

                    if (this.lists[this.listId].listsArray[this.childId].tasks[event.target.parentElement.getAttribute('data-id') || this.taskElementId].complete) {
                        this.lists[this.listId].listsArray[this.childId].tasks[event.target.parentElement.getAttribute('data-id') || this.taskElementId].complete = false
                    } else {
                        if (this.lists[this.listId].listsArray[this.childId].tasks[event.target.parentElement.getAttribute('data-id') || this.taskElementId].repeatedTask) {
                            let oldObj = this.lists[this.listId].listsArray[this.childId].tasks[event.target.parentElement.getAttribute('data-id') || this.taskElementId]

                            Object.keys(oldObj).forEach((key) => {
                                this.repeatedTaskObject[`${key}`] = oldObj[`${key}`]
                            })

                            this.repeatedTaskObject.id = this.lists[this.listId].listsArray[this.childId].tasks.length

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

                            this.lists[this.listId].listsArray[this.childId].tasks.push(this.repeatedTaskObject)

                            this.lists[this.listId].listsArray[this.childId].tasks[event.target.parentElement.getAttribute('data-id') || this.taskElementId].complete = true
                            this.lists[this.listId].listsArray[this.childId].tasks[event.target.parentElement.getAttribute('data-id') || this.taskElementId].repeatedTask = false
                        }
                        else {
                            this.lists[this.listId].listsArray[this.childId].tasks[event.target.parentElement.getAttribute('data-id') || this.taskElementId].complete = true
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

                    this.taskElements.forEach((task) => {
                        if (+task.getAttribute('data-id') === +this.taskElementId) {
                            this.taskElement = task
                        }
                    })

                    if (this.lists[this.listId].tasks[event.target.getAttribute('data-id') || this.taskElementId].complete) {
                        this.lists[this.listId].tasks[event.target.getAttribute('data-id') || this.taskElementId].complete = false
                    } else {
                        if (this.lists[this.listId].tasks[event.target.getAttribute('data-id') || this.taskElementId].repeatedTask) {
                            let oldObj = this.lists[this.listId].tasks[event.target.getAttribute('data-id') || this.taskElementId]

                            Object.keys(oldObj).forEach((key) => {
                                this.repeatedTaskObject[`${key}`] = oldObj[`${key}`]
                            })

                            this.repeatedTaskObject.id = this.lists[this.listId].tasks.length

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

                            this.lists[this.listId].tasks.push(this.repeatedTaskObject)

                            this.lists[this.listId].tasks[event.target.getAttribute('data-id') || this.taskElementId].complete = true
                            this.lists[this.listId].tasks[event.target.getAttribute('data-id') || this.taskElementId].repeatedTask = false
                        }
                        else {
                            this.lists[this.listId].tasks[event.target.getAttribute('data-id') || this.taskElementId].complete = true
                        }
                    }
                    this.thisTask = event.target.getAttribute('data-id') || this.taskElementId
                } else {

                    this.taskElements.forEach((task) => {
                        if (+task.getAttribute('data-id') === +this.taskElementId) {
                            this.taskElement = task
                        }
                    })

                    if (this.lists[this.listId].tasks[event.target.parentElement.getAttribute('data-id') || this.taskElementId].complete) {
                        this.lists[this.listId].tasks[event.target.parentElement.getAttribute('data-id') || this.taskElementId].complete = false
                    } else {
                        if (this.lists[this.listId].tasks[event.target.parentElement.getAttribute('data-id') || this.taskElementId].repeatedTask) {
                            let oldObj = this.lists[this.listId].tasks[event.target.parentElement.getAttribute('data-id') || this.taskElementId]

                            Object.keys(oldObj).forEach((key) => {
                                this.repeatedTaskObject[`${key}`] = oldObj[`${key}`]
                            })

                            this.repeatedTaskObject.id = this.lists[this.listId].tasks.length

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

                            this.lists[this.listId].tasks.push(this.repeatedTaskObject)

                            this.lists[this.listId].tasks[event.target.parentElement.getAttribute('data-id') || this.taskElementId].complete = true
                            this.lists[this.listId].tasks[event.target.parentElement.getAttribute('data-id') || this.taskElementId].repeatedTask = false
                        } else {
                            this.lists[this.listId].tasks[event.target.parentElement.getAttribute('data-id') || this.taskElementId].complete = true
                        }
                    }
                    this.thisTask = event.target.parentElement.getAttribute('data-id') || this.taskElementId
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
        }
    }
}
</script>