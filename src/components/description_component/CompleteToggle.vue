<template>
    <span :data-id="taskIndex" @click="completeAsideTask" class="check">
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
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists', 'smartList']),
        ...mapWritableState(allLists, ['lists', 'smartList']),
    },
    methods: {
        completeAsideTask() {
            if (!!this.descriptionTaskChildList) {
                if (event.target.tagName === 'SPAN') {
                    if (this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].complete) {
                        this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].complete = false
                    } else {
                        if (this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].repeatedTask) {
                            let oldObj = this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex]

                            Object.keys(oldObj).forEach((key) => {
                                this.repeatedTaskObject[`${key}`] = oldObj[`${key}`]
                            })

                            this.repeatedTaskObject.id = this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks.length

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

                            this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks.push(this.repeatedTaskObject)

                            this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].complete = true
                            this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].repeatedTask = false
                        }
                        else {
                            this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].complete = true
                        }
                    }
                } else {
                    if (this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].complete) {
                        this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].complete = false
                    } else {

                        if (this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].repeatedTask) {
                            let oldObj = this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex]

                            Object.keys(oldObj).forEach((key) => {
                                this.repeatedTaskObject[`${key}`] = oldObj[`${key}`]
                            })

                            this.repeatedTaskObject.id = this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks.length

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

                            this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks.push(this.repeatedTaskObject)

                            this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].complete = true
                            this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].repeatedTask = false
                        }
                        else {
                            this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].complete = true
                        }
                    }
                }

                this.completeTaskStatus = !this.completeTaskStatus
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks.forEach((singleTask, index) => {
                    if (singleTask.id == this.task.id) {
                        // this.taskIndex = index
                        this.$emit('componentEvent', index)
                    }
                })

                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].steps.forEach((step) => {
                    if (this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].complete) {
                        step.complete = true
                    } else {
                        step.complete = false
                    }
                })
            } else {
                if (event.target.tagName === 'SPAN') {
                    if (this.lists[this.descriptionTaskList].tasks[this.taskIndex].complete) {
                        this.lists[this.descriptionTaskList].tasks[this.taskIndex].complete = false
                    } else {
                        if (this.lists[this.descriptionTaskList].tasks[this.taskIndex].repeatedTask) {
                            let oldObj = this.lists[this.descriptionTaskList].tasks[this.taskIndex]

                            Object.keys(oldObj).forEach((key) => {
                                this.repeatedTaskObject[`${key}`] = oldObj[`${key}`]
                            })

                            this.repeatedTaskObject.id = this.lists[this.descriptionTaskList].tasks.length

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

                            this.lists[this.descriptionTaskList].tasks.push(this.repeatedTaskObject)

                            this.lists[this.descriptionTaskList].tasks[this.taskIndex].complete = true
                            this.lists[this.descriptionTaskList].tasks[this.taskIndex].repeatedTask = false
                        }
                        else {
                            this.lists[this.descriptionTaskList].tasks[this.taskIndex].complete = true
                        }
                    }
                } else {
                    if (this.lists[this.descriptionTaskList].tasks[this.taskIndex].complete) {
                        this.lists[this.descriptionTaskList].tasks[this.taskIndex].complete = false
                    } else {
                        if (this.lists[this.descriptionTaskList].tasks[this.taskIndex].repeatedTask) {
                            let oldObj = this.lists[this.descriptionTaskList].tasks[this.taskIndex]

                            Object.keys(oldObj).forEach((key) => {
                                this.repeatedTaskObject[`${key}`] = oldObj[`${key}`]
                            })

                            this.repeatedTaskObject.id = this.lists[this.descriptionTaskList].tasks.length

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

                            this.lists[this.descriptionTaskList].tasks.push(this.repeatedTaskObject)

                            this.lists[this.descriptionTaskList].tasks[this.taskIndex].complete = true
                            this.lists[this.descriptionTaskList].tasks[this.taskIndex].repeatedTask = false
                        }
                        else {
                            this.lists[this.descriptionTaskList].tasks[this.taskIndex].complete = true
                        }
                    }
                }
                this.completeTaskStatus = !this.completeTaskStatus
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                this.lists[this.descriptionTaskList].tasks.forEach((singleTask, index) => {
                    if (singleTask.id == this.task.id) {
                        // this.taskIndex = index
                        this.$emit('componentEvent', index)
                    }
                })

                this.lists[this.descriptionTaskList].tasks[this.taskIndex].steps.forEach((step) => {
                    if (this.lists[this.descriptionTaskList].tasks[this.taskIndex].complete) {
                        step.complete = true
                    } else {
                        step.complete = false
                    }
                })
            }

            if (this.element.classList.contains('add-animation-x')) {
                this.element.classList.remove('add-animation-x')
                setTimeout(() => {
                    this.element.classList.add('add-animation-x')
                }, 0)
            } else {
                this.element.classList.remove('add-animation-x')
                setTimeout(() => {
                    this.element.classList.add('add-animation-x')
                }, 0)
            }

            this.alertPopup = false
        }
    }
}
</script>