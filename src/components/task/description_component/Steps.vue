<template>
    <div class="task-steps-container">
        <div class="steps-container">
            <ul class="task-steps">
                <transition-group name="show-steps">
                    <li @blur="closeDropDown" tabindex="0" :data-id="index" v-for="(step, index) in task.steps"
                        :key="step.id" :class="{ complete: step.complete }">
                        <span :data-id="index" @click="completeStep" class="check">
                            <img src="@/assets/design-material/icons/check.png" alt="check" />
                        </span>
                        <span class="task-name" :class="{ complete: step.complete }">
                            {{ step.name }}
                        </span>

                        <img @click="openDropDown" :data-id="index" class="important-toggle"
                            src="@/assets/design-material/icons/more.png" alt="">
                    </li>
                </transition-group>
            </ul>
        </div>

        <transition name="to-bottom">
            <DropDown :dropDownSlots="dropDownSlots" :top="top" :right="right" v-if="toggleDropDown">
                <template #MarkAsComplete>
                    <div @click="completeStep">
                        <img src="@/assets/design-material/icons/check.png" alt="">
                        <span>Mark as complete</span>
                    </div>
                </template>

                <template #PromoteToTask>
                    <div @click="PromoteToTask">
                        <img src="@/assets/design-material/icons/plus.png" alt="">
                        <span>Promote to task</span>
                    </div>
                </template>

                <template #DeleteStep>
                    <div @click="togglePopup">
                        <img src="@/assets/design-material/icons/delete.png" alt="">
                        <span>Delete step</span>
                    </div>
                </template>
            </DropDown>
        </transition>

        <div class="add-steps" :class="{ error: errorToggle }">
            <img :class="{ active: activeToggle }" @click="addStep" src="@/assets/design-material/icons/plus.png"
                alt="add-steps" />

            <input v-model="inputValue" @keypress.enter="addStep" required placeholder="Add New step" type="text" />
        </div>
    </div>

    <PopUp :showPopUp="showPopUp">
        <template #title>
            {{ dropDownStepId ? 'Delete Step' : 'Delete Task' }}
        </template>

        <template #content>
            {{ dropDownStepId ? `step ${step.name} will be permanently deleted` : `task ${task.name} will be
            permanently
            deleted.`}}

        </template>

        <template #button>
            <button class="delete" @click="deleteTask">Delete</button>
            <button class="close" @click="togglePopup">Cancel</button>
        </template>
    </PopUp>
</template>

<script>
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

import DropDown from '../global-components/DropDown.vue'
import PopUp from '../global-components/PopUp.vue'

export default {
    name: 'Rename',
    props: ['descriptionTaskList', 'descriptionTaskChildList', 'descriptionTaskIndex', 'task', 'taskIndex', 'element'],
    data() {
        return {
            inputValue: '',
            activeToggle: false,
            errorToggle: false,
            stepsArray: [],
            stepObj: {},
            stepId: 0,
            toggleDropDown: false,
            dropDownSlots: ['MarkAsComplete', 'PromoteToTask', 'DeleteStep'],
            dropDownStepId: null,
            completeStepsArray: [],
            promoteTask: {},
            showPopUp: false
        }
    },
    components: {
        DropDown,
        PopUp
    },
    computed: {
        ...mapState(allLists, ['returnLists', 'smartList']),
        ...mapWritableState(allLists, ['lists', 'smartList']),
    },
    methods: {
        completeStep() {
            if (!!this.descriptionTaskChildList) {
                if (!!this.dropDownStepId) {
                    if (this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].steps[this.dropDownStepId].complete) {
                        this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].steps[this.dropDownStepId].complete = false
                    } else {
                        this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].steps[this.dropDownStepId].complete = true
                    }
                } else {
                    if (event.target.tagName === 'SPAN') {
                        this.stepElement = event.target.parentElement
                        if (this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].steps[event.target.getAttribute('data-id')].complete) {
                            this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].steps[event.target.getAttribute('data-id')].complete = false
                        } else {
                            this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].steps[event.target.getAttribute('data-id')].complete = true
                        }
                    } else {
                        this.stepElement = event.target.parentElement.parentElement
                        if (this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].steps[event.target.parentElement.getAttribute('data-id')].complete) {
                            this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].steps[event.target.parentElement.getAttribute('data-id')].complete = false
                        } else {
                            this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].steps[event.target.parentElement.getAttribute('data-id')].complete = true
                        }
                    }
                }

                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].steps.forEach((step, _, arr) => {
                    if (step.complete) {
                        this.completeStepsArray.push(step)

                        if (this.completeStepsArray.length === arr.length) {
                            this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].complete = true

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

                            this.completeStepsArray = []
                        } else {
                            if (this.completeStepsArray.length !== arr.length) {
                                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].complete = false
                                if (this.element.classList.contains('add-animation-x')) {
                                    this.element.classList.remove('add-animation-x')
                                    setTimeout(() => {
                                        this.element.classList.add('add-animation-x')
                                    }, 0)
                                }
                                this.completeStepsArray = []
                            }
                        }
                    }
                })
            } else {
                if (!!this.dropDownStepId) {
                    if (this.lists[this.descriptionTaskList].tasks[this.taskIndex].steps[this.dropDownStepId].complete) {
                        this.lists[this.descriptionTaskList].tasks[this.taskIndex].steps[this.dropDownStepId].complete = false
                    } else {
                        this.lists[this.descriptionTaskList].tasks[this.taskIndex].steps[this.dropDownStepId].complete = true
                    }
                } else {
                    if (event.target.tagName === 'SPAN') {
                        this.stepElement = event.target.parentElement
                        if (this.lists[this.descriptionTaskList].tasks[this.taskIndex].steps[event.target.getAttribute('data-id')].complete) {
                            this.lists[this.descriptionTaskList].tasks[this.taskIndex].steps[event.target.getAttribute('data-id')].complete = false
                        } else {
                            this.lists[this.descriptionTaskList].tasks[this.taskIndex].steps[event.target.getAttribute('data-id')].complete = true
                        }
                    } else {
                        this.stepElement = event.target.parentElement.parentElement
                        if (this.lists[this.descriptionTaskList].tasks[this.taskIndex].steps[event.target.parentElement.getAttribute('data-id')].complete) {
                            this.lists[this.descriptionTaskList].tasks[this.taskIndex].steps[event.target.parentElement.getAttribute('data-id')].complete = false
                        } else {
                            this.lists[this.descriptionTaskList].tasks[this.taskIndex].steps[event.target.parentElement.getAttribute('data-id')].complete = true
                        }
                    }
                }

                this.lists[this.descriptionTaskList].tasks[this.taskIndex].steps.forEach((step, _, arr) => {
                    if (step.complete) {
                        this.completeStepsArray.push(step)
                        if (this.completeStepsArray.length === arr.length) {
                            this.lists[this.descriptionTaskList].tasks[this.taskIndex].complete = true
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
                            this.completeStepsArray = []
                        }
                    } else {
                        if (this.completeStepsArray.length !== arr.length) {
                            this.lists[this.descriptionTaskList].tasks[this.taskIndex].complete = false
                            if (this.element.classList.contains('add-animation-x')) {
                                this.element.classList.remove('add-animation-x')
                                setTimeout(() => {
                                    this.element.classList.add('add-animation-x')
                                }, 0)
                            }
                            this.completeStepsArray = []
                        }
                    }
                })
            }
            this.completeTaskStatus = !this.completeTaskStatus
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            if (this.stepElement.classList.contains('add-animation-x')) {
                this.stepElement.classList.remove('add-animation-x')
                setTimeout(() => {
                    this.stepElement.classList.add('add-animation-x')
                }, 0)
            } else {
                this.stepElement.classList.remove('add-animation-x')
                setTimeout(() => {
                    this.stepElement.classList.add('add-animation-x')
                }, 0)
            }
        },
        addStep() {
            if (this.inputValue.length > 0) {
                this.errorToggle = false
                if (!!this.descriptionTaskChildList) {
                    this.stepId = this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].steps.length
                    this.stepObj.id = this.stepId
                    this.stepObj.name = this.inputValue
                    this.stepObj.complete = false
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].steps.push(this.stepObj)
                } else {
                    this.stepId = this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].steps.length
                    this.stepObj.id = this.stepId
                    this.stepObj.name = this.inputValue
                    this.stepObj.complete = false
                    this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].steps.push(this.stepObj)
                }
                this.completeTaskStatus = !this.completeTaskStatus

                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                this.stepId++
                this.stepObj = {}
                this.inputValue = ''
            } else {
                if (!!this.errorToggle) {
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
        openDropDown() {
            this.toggleDropDown = !this.toggleDropDown
            this.dropDownStepId = event.target.parentElement.getAttribute('data-id');
            this.stepElement = event.target.parentElement
            this.top = event.target.parentElement.getBoundingClientRect().top + 35
            this.right = 35

            if (this.toggleDropDown === false) {
                this.dropDownStepId = null
            }

            if (!!this.descriptionTaskChildList) {
                this.step = this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].steps[this.dropDownStepId]
            } else {
                this.step = this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].steps[this.dropDownStepId]
            }
        },
        closeDropDown() {
            this.toggleDropDown = false
        },
        PromoteToTask() {
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0');
            let yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;

            if (!!this.descriptionTaskChildList) {
                let step = this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].steps[this.dropDownStepId]
                this.promoteTask.name = step.name
                this.promoteTask.id = this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks.length
                this.promoteTask.complete = false
                this.promoteTask.important = false

                this.promoteTask.sortTime = new Date()
                this.promoteTask.addTime = today
                this.promoteTask.dueDate = ''
                this.promoteTask.dueDateName = ''
                this.promoteTask.realDueDateName = ''

                this.promoteTask.repeatDueDate = ''
                this.promoteTask.repeatDueDateName = ''
                this.promoteTask.realRepeatDueDateName = ''

                this.promoteTask.remindMe = ''
                this.promoteTask.remindMeDate = ''
                this.promoteTask.remindMeName = ''

                this.promoteTask.addToMyDay = false
                this.promoteTask.note = ''
                this.promoteTask.steps = []

                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].steps.splice(this.dropDownStepId, 1)

                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].steps.forEach((step, index) => {
                    if (index >= this.dropDownStepId) {
                        step.id -= 1
                    }
                });

                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks.push(this.promoteTask)


                this.promoteTask = {}
            } else {
                let step = this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].steps[this.dropDownStepId]

                this.promoteTask.name = step.name
                this.promoteTask.id = this.lists[this.descriptionTaskList].tasks.length
                this.promoteTask.complete = false
                this.promoteTask.important = false

                this.promoteTask.sortTime = new Date()
                this.promoteTask.addTime = today
                this.promoteTask.dueDate = ''
                this.promoteTask.dueDateName = ''
                this.promoteTask.realDueDateName = ''

                this.promoteTask.repeatDueDate = ''
                this.promoteTask.repeatDueDateName = ''
                this.promoteTask.realRepeatDueDateName = ''

                this.promoteTask.remindMe = ''
                this.promoteTask.remindMeDate = ''
                this.promoteTask.remindMeName = ''

                this.promoteTask.addToMyDay = false
                this.promoteTask.note = ''
                this.promoteTask.steps = []

                this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].steps.splice(this.dropDownStepId, 1)

                this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].steps.forEach((step, index) => {
                    if (index >= this.dropDownStepId) {
                        step.id -= 1
                    }
                });

                this.lists[this.descriptionTaskList].tasks.push(this.promoteTask)


                this.promoteTask = {}
            }
            this.completeTaskStatus = !this.completeTaskStatus

            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))

            this.toggleDropDown = false

            if (this.toggleDropDown === false) {
                this.dropDownStepId = null
            }
        },
        togglePopup() {
            this.showPopUp = !this.showPopUp
        },
        deleteTask() {
            if (!!this.dropDownStepId) {
                if (!!this.descriptionTaskChildList) {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].steps.splice(this.dropDownStepId, 1)

                    if (this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].steps.length > 0) {
                        this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].steps.forEach((step, index) => {
                            if (index >= this.dropDownStepId) {
                                step.id -= 1
                            }
                        });
                    } else {
                        if (this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].complete) {
                            this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].complete = false

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
                        }
                    }
                } else {
                    this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].steps.splice(this.dropDownStepId, 1)

                    if (this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].steps.length > 0) {
                        this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].steps.forEach((step, index) => {
                            if (index >= this.dropDownStepId) {
                                step.id -= 1
                            }
                        });
                    } else {
                        if (this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].complete) {
                            this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].complete = false

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
                        }
                    }
                }
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                this.showPopUp = !this.showPopUp
                this.alertPopup = false

                if (this.toggleDropDown === false) {
                    this.dropDownStepId = null
                }

                if (this.chosenSmartList) {
                    this.smartList[this.chosenSmartList].tasks.splice(this.smartListTaskId, 1)
                }

                localStorage.setItem("allSmartLists", JSON.stringify(this.smartList))

            } else {
                if (!!this.descriptionTaskChildList) {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks.splice(this.descriptionTaskIndex, 1)
                } else {
                    this.lists[this.descriptionTaskList].tasks.splice(this.descriptionTaskIndex, 1)
                }

                if (this.chosenSmartList) {
                    this.smartList[this.chosenSmartList].tasks.splice(this.smartListTaskId, 1)
                }

                localStorage.setItem("allSmartLists", JSON.stringify(this.smartList))

                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                this.$emit('closeDescription', false)
                this.showPopUp = !this.showPopUp
                this.alertPopup = false
            }
        }
    }
}
</script>