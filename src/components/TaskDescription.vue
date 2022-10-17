<template>
    <div class="task-description">

        <div class="close-container">
            <img @click="closeDescription" src="@/assets/design-material/icons/close.png" alt=""
                class="close-description">
        </div>

        <div class="task-main-content">
            <div class="task-box task-info-and-steps">
                <h2 :class="{complete: task.complete}">
                    <span :data-id="taskIndex" @click="completeAsideTask" class="check">
                        <img src="@/assets/design-material/icons/check.png" alt="check" />
                    </span>
                    <span class="task-name" :class="{complete: task.complete}">
                        {{task.name}}
                    </span>

                    <img v-if="task.important" :data-id="taskIndex" @click="importantAsideToggle"
                        class="important-toggle" src="@/assets/design-material/icons/important-task.png" alt="">

                    <img v-else :data-id="taskIndex" @click="importantAsideToggle" class="important-toggle"
                        src="@/assets/design-material/icons/important-hover.png" alt="">
                </h2>

                <div class="task-steps-container">
                    <div class="steps-container">
                        <ul class="task-steps">
                            <transition-group name="show-steps">
                                <li @blur="closeDropDown" tabindex="0" :data-id="index"
                                    v-for="(step,index) in task.steps" :key="step.id"
                                    :class="{complete: step.complete}">
                                    <span :data-id="index" @click="completeStep" class="check">
                                        <img src="@/assets/design-material/icons/check.png" alt="check" />
                                    </span>
                                    <span class="task-name" :class="{complete: step.complete}">
                                        {{step.name}}
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

                    <div class="add-steps" :class="{error:errorToggle}">
                        <img :class="{active:activeToggle}" @click="addStep"
                            src="@/assets/design-material/icons/plus.png" alt="add-steps" />

                        <input v-model="inputValue" @keyup.enter="addStep" required placeholder="Add New step"
                            type="text" />
                    </div>
                </div>
            </div>

            <div @click.self="renameTask" class="task-box rename-task">
                <template v-if="showRename">
                    <img @click="newTaskName" class="renameTask" :class="{ active: itemDetect }"
                        src="@/assets/design-material/icons/plus.png" alt="add-item" />
                    <input @keyup.enter="newTaskName" required @focus="toggleErrorClass" v-model="newName"
                        placeholder="New Name" type="text" name="" id="" :class="{error:toggleError}" />
                    <img @click="closeRename" src="@/assets/design-material/icons/close.png" alt="close rename" />
                </template>

                <template v-else>
                    <img @click="renameTask" src="@/assets/design-material/icons/rename.png" alt="rename task" />
                    <span @click="renameTask">Rename Task</span>
                </template>
            </div>

            <div class="task-box add-to-my-day">
                <img src="@/assets/design-material/icons/sun.png" alt="my day tab" />
                <span>Add To My Day</span>
            </div>

            <div ref="timeAndDate" class="task-box time-and-date">
                <div>
                    <img src="@/assets/design-material/icons/alarm-clock.png" alt="remind me" />
                    <span>Remind Me</span>
                </div>
                <div @click.self="toggleAddDueDate">
                    <img @click="toggleAddDueDate" src="@/assets/design-material/icons/calendar.png"
                        alt="add due date" />
                    <span @click="toggleAddDueDate">{{dueDateState}}</span>
                    <img class="delete-due-date" @click="deleteDueDate" v-if="dueDateState != 'Add Due Date'"
                        src="@/assets/design-material/icons/close.png" alt="delete due date">
                </div>
                <div>
                    <img src="@/assets/design-material/icons/event.png" alt="repeat" />
                    <span>Repeat</span>
                </div>
            </div>

            <transition name="to-bottom">
                <DropDown :dropDownSlots="dropDownDueDateSlots" :top="top" :right="right" v-if="toggleDropDown">
                    <template #ToDay>
                        <div @click="addDueDate('today')">
                            <img src="@/assets/design-material/icons/date.png" alt="due date">
                            <span>ToDay</span>
                        </div>
                    </template>

                    <template #Tomorrow>
                        <div @click="addDueDate('tomorrow')">
                            <img src="@/assets/design-material/icons/tomorrow.png" alt="due tomorrow">
                            <span>Tomorrow</span>
                        </div>
                    </template>

                    <template #NextWeek>
                        <div @click="addDueDate('nextWeek')">
                            <img src="@/assets/design-material/icons/next-week.png" alt="next week">
                            <span>Next week</span>
                        </div>
                    </template>

                    <template #PickADate>
                        <div @click="addDueDate('customDate')">
                            <template v-if="pickCustomDate">
                                <img @click="addCustomDate" src="@/assets/design-material/icons/plus.png"
                                    alt="add custom date">
                                <input :class="{error:errorCustomDateToggle}" class="custom-date" v-model="pickedCustomDate"
                                    type="date" name="" id="">
                            </template>

                            <template v-else>
                                <img src="@/assets/design-material/icons/custom-date.png" alt="pick a date">
                                <span>Pick a Date</span>
                            </template>
                        </div>
                    </template>
                </DropDown>
            </transition>

            <div class="task-box task-notes">
                <h3>Task Description</h3>
                <!-- <textarea placeholder="Add Task Description" @blur="emptyTextValue" :data-id="index" v-model="textValue"
                    @keyup="addNote"> -->
                <textarea placeholder="Add Task Description" :data-id="index" v-model="textValue" @keyup="addNote">
                    {{taskNoteText}}
                </textarea>

                <div class="date">
                    12/6/520
                </div>
            </div>
        </div>

        <div class="task-time-and-delete">
            <div class="time">Created on {{task.addTime}}</div>

            <span class="delete">
                <img @click="togglePopup" src="@/assets/design-material/icons/delete.png" alt="">
            </span>
        </div>
    </div>

    <PopUp :showPopUp="showPopUp">
        <template #title>
            {{dropDownStepId? 'Delete Step': 'Delete Task'}}
        </template>

        <template #content>
            {{dropDownStepId? `step ${step.name} will be permanently deleted`: `task ${task.name} will be permanently
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
import PopUp from './PopUp.vue'
import DropDown from '../components/DropDown.vue';

export default {
    name: 'DescriptionTask',
    props: ['descriptionTaskChildList', 'descriptionTaskList', 'descriptionTaskIndex', 'element'],
    beforeMount() {
        if (!!this.descriptionTaskChildList) {
            this.task = this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList]
                .tasks[this.descriptionTaskIndex]
            this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList]
                .tasks.forEach((singleTask, index) => {
                    if (singleTask.id == this.task.id) {
                        this.taskIndex = index
                    }
                })
        } else {
            this.task = this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex]
            this.lists[this.descriptionTaskList].tasks.forEach((singleTask, index) => {
                if (singleTask.id == this.task.id) {
                    this.taskIndex = index
                }
            })
        }
    },
    components: {
        PopUp,
        DropDown
    },
    data() {
        return {
            task: {},
            inputValue: '',
            activeToggle: false,
            errorToggle: false,
            stepsArray: [],
            stepObj: {},
            stepId: 0,
            textValue: '',
            taskIndex: 0,
            stepElement: '',
            showPopUp: false,
            showRename: false,
            newName: '',
            toggleError: false,
            toggleDropDown: false,
            top: null,
            right: null,
            dropDownSlots: ['MarkAsComplete', 'PromoteToTask', 'DeleteStep'],
            dropDownStepId: null,
            promoteTask: {},
            step: {},
            completeStepsArray: [],
            dropDownDueDateSlots: ['ToDay', 'Tomorrow', 'NextWeek', 'PickADate'],
            pickCustomDate: false,
            pickedCustomDate: null,
            errorCustomDateToggle: false
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists']),
        ...mapWritableState(allLists, ['lists']),

        taskNoteText() {
            if (this.task.note.length > 0) {
                return this.textValue = this.task.note
            } else {
                return this.textValue = ''
            }
        },
        itemDetect() {
            if (this.newName.length > 0) {
                return true;
            } else {
                return false;
            }
        },
        dueDateState() {
            if (!!this.descriptionTaskChildList) {
                if (this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].dueDateName) {
                    return 'Due ' + this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].dueDateName
                } else {
                    return 'Add Due Date'
                }
            } else {
                if (this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].dueDateName) {
                    return 'Due ' + this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].dueDateName
                } else {
                    return 'Add Due Date'
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
            }
        },
    },
    methods: {
        toggleErrorClass() {
            this.toggleError = false
        },
        renameTask() {
            this.showRename = !this.showRename
            this.newName = this.task.name
        },
        closeRename() {
            this.showRename = !this.showRename
        },
        newTaskName() {
            if (this.newName.length > 0) {
                if (!!this.descriptionTaskChildList) {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].name = this.newName
                } else {
                    this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].name = this.newName
                }
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))

                this.newName = ''
                this.showRename = false
            } else {
                if (!!this.toggleError) {
                    this.toggleError = false
                    setTimeout(() => {
                        this.toggleError = true
                    }, 0)
                } else {
                    setTimeout(() => {
                        this.toggleError = true
                    }, 0)
                }
            }
        },
        addNote() {
            if (!!this.descriptionTaskChildList) {
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].note = this.textValue
            } else {
                this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].note = this.textValue
            }
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
        },
        emptyTextValue() {
            this.textValue = ''
        },
        togglePopup() {
            this.showPopUp = !this.showPopUp
        },
        deleteTask() {
            if (!!this.dropDownStepId) {
                if (!!this.descriptionTaskChildList) {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].steps.splice(this.dropDownStepId, 1)
                } else {
                    this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].steps.splice(this.dropDownStepId, 1)
                }
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                this.showPopUp = !this.showPopUp

                if (this.toggleDropDown === false) {
                    this.dropDownStepId = null
                }
            } else {
                if (!!this.descriptionTaskChildList) {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks.splice(this.descriptionTaskIndex, 1)
                } else {
                    this.lists[this.descriptionTaskList].tasks.splice(this.descriptionTaskIndex, 1)
                }
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                this.$emit('closeDescription', false)
                this.showPopUp = !this.showPopUp
            }
        },
        closeDescription() {
            this.element.classList.remove('add-animation-x')
            this.$emit('closeDescription', false)
        },
        importantAsideToggle() {
            // this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex]
            this.element.classList.remove('add-animation-x')
            this.element.classList.remove('add-animation')

            if (!!this.descriptionTaskChildList) {
                if (this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].important) {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].important = false
                    event.target.setAttribute('src', event.target.getAttribute('src').replace('important-task', 'important-hover'))
                    this.importantTask = this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex]
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks.splice(this.taskIndex, 1)
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks.push(this.importantTask)
                    this.importantTask = {}
                } else {
                    event.target.setAttribute('src', event.target.getAttribute('src').replace('important-hover', 'important-task'))
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].important = true
                    this.importantTask = this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex]
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks.splice(this.taskIndex, 1)
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks.unshift(this.importantTask)
                    this.importantTask = {}
                }

                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks.forEach((singleTask, index) => {
                    if (singleTask.id == this.task.id) {
                        this.taskIndex = index
                    }
                })
            } else {
                if (this.lists[this.descriptionTaskList].tasks[this.taskIndex].important) {
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].important = false
                    event.target.setAttribute('src', event.target.getAttribute('src').replace('important-task', 'important-hover'))
                    this.importantTask = this.lists[this.descriptionTaskList].tasks[this.taskIndex]
                    this.lists[this.descriptionTaskList].tasks.splice(this.taskIndex, 1)
                    this.lists[this.descriptionTaskList].tasks.push(this.importantTask)
                    this.importantTask = {}

                } else {
                    event.target.setAttribute('src', event.target.getAttribute('src').replace('important-hover', 'important-task'))
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].important = true
                    this.importantTask = this.lists[this.descriptionTaskList].tasks[this.taskIndex]
                    this.lists[this.descriptionTaskList].tasks.splice(this.taskIndex, 1)
                    this.lists[this.descriptionTaskList].tasks.unshift(this.importantTask)
                    this.importantTask = {}
                }

                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                this.lists[this.descriptionTaskList].tasks.forEach((singleTask, index) => {
                    if (singleTask.id == this.task.id) {
                        this.taskIndex = index
                    }
                })
            }
        },
        completeAsideTask() {
            if (!!this.descriptionTaskChildList) {
                if (event.target.tagName === 'SPAN') {
                    if (this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].complete) {
                        this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].complete = false
                    } else {
                        this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].complete = true
                    }
                } else {
                    if (this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].complete) {
                        this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].complete = false
                    } else {
                        this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].complete = true
                    }
                }

                this.completeTaskStatus = !this.completeTaskStatus
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks.forEach((singleTask, index) => {
                    if (singleTask.id == this.task.id) {
                        this.taskIndex = index
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
                        this.lists[this.descriptionTaskList].tasks[this.taskIndex].complete = true
                    }
                } else {
                    if (this.lists[this.descriptionTaskList].tasks[this.taskIndex].complete) {
                        this.lists[this.descriptionTaskList].tasks[this.taskIndex].complete = false
                    } else {
                        this.lists[this.descriptionTaskList].tasks[this.taskIndex].complete = true
                    }
                }
                this.completeTaskStatus = !this.completeTaskStatus
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                this.lists[this.descriptionTaskList].tasks.forEach((singleTask, index) => {
                    if (singleTask.id == this.task.id) {
                        this.taskIndex = index
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
        },

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

                this.lists[this.descriptionTaskList].tasks[this.taskIndex].steps.forEach((step, index, arr) => {
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
            // this.dropDownStepId = null
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
            let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;

            if (!!this.descriptionTaskChildList) {
                let step = this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].steps[this.dropDownStepId]
                this.promoteTask.name = step.name
                this.promoteTask.id = this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks.length
                this.promoteTask.complete = false
                this.promoteTask.important = false


                this.promoteTask.addTime = today
                this.promoteTask.endTime = ''
                this.promoteTask.note = ''
                this.promoteTask.steps = []

                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].steps.splice(this.dropDownStepId, 1)

                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks.unshift(this.promoteTask)

                this.promoteTask = {}
            } else {
                let step = this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].steps[this.dropDownStepId]

                this.promoteTask.name = step.name
                this.promoteTask.id = this.lists[this.descriptionTaskList].tasks.length
                this.promoteTask.complete = false
                this.promoteTask.important = false


                this.promoteTask.addTime = today
                this.promoteTask.endTime = ''
                this.promoteTask.note = ''
                this.promoteTask.steps = []

                this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].steps.splice(this.dropDownStepId, 1)

                this.lists[this.descriptionTaskList].tasks.unshift(this.promoteTask)

                this.promoteTask = {}
            }
            this.completeTaskStatus = !this.completeTaskStatus

            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))

            this.toggleDropDown = false

            if (this.toggleDropDown === false) {
                this.dropDownStepId = null
            }
        },
        toggleAddDueDate() {
            this.toggleDropDown = !this.toggleDropDown
            this.top = this.$refs.timeAndDate.getBoundingClientRect().top + 95
            this.right = 70
        },
        addDueDate(date) {
            if (!!this.descriptionTaskChildList) {
                if (date === 'today') {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueTime = new Date()
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueDateName = 'ToDay'
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].realDueDateName = 'ToDay'
                    this.toggleDropDown = false
                } else if (date === 'tomorrow') {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueTime = new Date(new Date().setDate(new Date().getDate() + 1))
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueDateName = 'Tomorrow'
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].realDueDateName = 'Tomorrow'
                    this.toggleDropDown = false
                } else if (date === 'nextWeek') {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueTime = new Date(new Date().setDate(new Date().getDate() + 7))
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueDateName = new Date(new Date().setDate(new Date().getDate() + 7)).toString().split(' ')[1] + ' ' + new Date(new Date().setDate(new Date().getDate() + 7)).toString().split(' ')[2]
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].realDueDateName = 'NextWeek'
                    this.toggleDropDown = false
                } else if (date === 'customDate') {
                    this.pickCustomDate = true
                }
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            } else {
                if (date === 'today') {
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueTime = new Date()
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueDateName = 'ToDay'
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].realDueDateName = 'ToDay'
                    this.toggleDropDown = false
                } else if (date === 'tomorrow') {
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueTime = new Date(new Date().setDate(new Date().getDate() + 1))
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueDateName = 'Tomorrow'
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].realDueDateName = 'Tomorrow'
                    this.toggleDropDown = false
                } else if (date === 'nextWeek') {
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueTime = new Date(new Date().setDate(new Date().getDate() + 7))
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueDateName = new Date(new Date().setDate(new Date().getDate() + 7)).toString().split(' ')[1] + ' ' + new Date(new Date().setDate(new Date().getDate() + 7)).toString().split(' ')[2]
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].realDueDateName = 'NextWeek'
                    this.toggleDropDown = false
                } else if (date === 'customDate') {
                    this.pickCustomDate = true
                }

                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            }
        },
        addCustomDate() {
            if (!!this.pickedCustomDate) {
                if (!!this.descriptionTaskChildList) {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueTime = this.pickedCustomDate
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueDateName = new Date(this.pickedCustomDate).toString().split(' ')[1] + ' ' + new Date(this.pickedCustomDate).toString().split(' ')[2]
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].realDueDateName = 'CustomDate'

                    localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                } else {
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueTime = this.pickedCustomDate
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueDateName = new Date(this.pickedCustomDate).toString().split(' ')[1] + ' ' + new Date(this.pickedCustomDate).toString().split(' ')[2]
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].realDueDateName = 'CustomDate'

                    localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                }
                this.pickCustomDate = false
                this.toggleDropDown = false
                this.pickedCustomDate = null
            } else {
                if (!!this.errorCustomDateToggle) {
                    this.errorCustomDateToggle = false
                    setTimeout(() => {
                        this.errorCustomDateToggle = true
                    }, 0)
                } else {
                    setTimeout(() => {
                        this.errorCustomDateToggle = true
                    }, 0)
                }
            }


        },
        deleteDueDate() {
            if (!!this.descriptionTaskChildList) {
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueTime = ''
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueDateName = ''
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            } else {
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueTime = ''
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueDateName = ''
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            }
        }
    }
}
</script>