<template>
    <div>
        <div class="task-description">

            <div class="close-container">
                <img v-if="remindToggle || new Date() > new Date(task.remindMeDate) && !task.complete"
                    @click="toggleRemindPopup" src="@/assets/design-material/icons/note.gif" alt="task reminder"
                    class="alert-message">

                <img v-if="new Date() > new Date(new Date(task.dueTime).setDate(new Date(task.dueTime).getDate() + 1)) && !task.complete"
                    @click="toggleAlertPopup" src="@/assets/design-material/icons/notification.gif" alt=""
                    class="alert-message">

                <img @click="closeDescription" src="@/assets/design-material/icons/close.png" alt=""
                    class="close-description">
            </div>

            <div class="task-main-content">
                <div class="task-box task-info-and-steps">
                    <h2 :class="{ complete: task.complete }">
                        <CompleteToggle :element='element' :task='task' :taskIndex='taskIndex'
                            :descriptionTaskList='descriptionTaskList'
                            :descriptionTaskChildList='descriptionTaskChildList' />

                        <span class="task-name" :class="{ complete: task.complete }">
                            {{ task.name }}
                        </span>

                        <ImportantToggle :element='element' :task='task' :taskIndex='taskIndex'
                            :descriptionTaskList='descriptionTaskList'
                            :descriptionTaskChildList='descriptionTaskChildList' @componentEvent='changeId' />
                    </h2>

                    <Steps :element='element' :taskIndex='taskIndex' :descriptionTaskList='descriptionTaskList'
                        :descriptionTaskChildList='descriptionTaskChildList'
                        :descriptionTaskIndex='descriptionTaskIndex' :task='task' />
                </div>

                <Rename :descriptionTaskList='descriptionTaskList' :descriptionTaskChildList='descriptionTaskChildList'
                    :descriptionTaskIndex='descriptionTaskIndex' :task='task' />

                <AddToMyDay :descriptionTaskList='descriptionTaskList'
                    :descriptionTaskChildList='descriptionTaskChildList' :taskIndex='taskIndex'
                    :descriptionTaskIndex='descriptionTaskIndex' />

                <div ref="timeAndDate" class="task-box time-and-date">
                    <div @click.self="toggleRemind(53)" :class="{ delete: remindDueDateStateClass }">
                        <img @click="toggleRemind(53)" src="@/assets/design-material/icons/alarm-clock.png"
                            alt="remind me" />
                        <span @click="toggleRemind(53)">{{ remindState }}</span>

                        <img class="delete-due-date" @click="closeRemind" v-if="remindState != 'Remind me'"
                            src="@/assets/design-material/icons/close.png" alt="delete repeat">
                    </div>

                    <div @click.self="toggleRepeat(85)">
                        <img @click="toggleRepeat(85)" src="@/assets/design-material/icons/event.png" alt="repeat" />
                        <span @click="toggleRepeat(85)">{{ repeatState }}</span>

                        <img class="delete-due-date" @click="closeRepeat" v-if="repeatState != 'Repeat'"
                            src="@/assets/design-material/icons/close.png" alt="delete repeat">
                    </div>

                    <div @click.self="toggleAddDueDate(145)" :class="{ delete: dueDateStateClass }">
                        <img @click="toggleAddDueDate(145)" src="@/assets/design-material/icons/calendar.png"
                            alt="add due date" />
                        <span @click="toggleAddDueDate(145)">{{ dueDateState }}</span>
                        <img class="delete-due-date" @click="deleteDueDate" v-if="dueDateState != 'Add Due Date'"
                            src="@/assets/design-material/icons/close.png" alt="delete due date">
                    </div>
                </div>

                <transition name="to-bottom">
                    <DropDown :dropDownSlots="dropDownDueDateSlots" :top="top" :right="right"
                        v-if="toggleDueDateDropDown">
                        <template #ToDay>
                            <AddDueDate @componentEvent='resetDueDate' :descriptionTaskList='descriptionTaskList'
                                :descriptionTaskChildList='descriptionTaskChildList' :taskIndex='taskIndex'
                                :descriptionTaskIndex='descriptionTaskIndex' date="today" />
                        </template>

                        <template #Tomorrow>
                            <AddDueDate @componentEvent='resetDueDate' :descriptionTaskList='descriptionTaskList'
                                :descriptionTaskChildList='descriptionTaskChildList' :taskIndex='taskIndex'
                                :descriptionTaskIndex='descriptionTaskIndex' date="tomorrow" />
                        </template>

                        <template #NextWeek>
                            <AddDueDate @componentEvent='resetDueDate' :descriptionTaskList='descriptionTaskList'
                                :descriptionTaskChildList='descriptionTaskChildList' :taskIndex='taskIndex'
                                :descriptionTaskIndex='descriptionTaskIndex' date="nextWeek" />
                        </template>

                        <template #PickADate>
                            <AddDueDate @componentEvent='resetDueDate' :descriptionTaskList='descriptionTaskList'
                                :descriptionTaskChildList='descriptionTaskChildList' :taskIndex='taskIndex'
                                :descriptionTaskIndex='descriptionTaskIndex' date="customDate" />
                        </template>
                    </DropDown>
                </transition>

                <transition name="to-bottom">
                    <DropDown :dropDownSlots="dropDownRepeatDueDateSlots" :top="top" :right="right"
                        v-if="toggleRepeatDropDown">
                        <template #Daily>
                            <RepeatDueDate @componentEvent='resetRepeatDueDate'
                                :descriptionTaskList='descriptionTaskList'
                                :descriptionTaskChildList='descriptionTaskChildList' :taskIndex='taskIndex'
                                :descriptionTaskIndex='descriptionTaskIndex' date="daily" />
                        </template>

                        <template #WeekDays>
                            <RepeatDueDate @componentEvent='resetRepeatDueDate'
                                :descriptionTaskList='descriptionTaskList'
                                :descriptionTaskChildList='descriptionTaskChildList' :taskIndex='taskIndex'
                                :descriptionTaskIndex='descriptionTaskIndex' date="weekDays" />
                        </template>

                        <template #Weekly>
                            <RepeatDueDate @componentEvent='resetRepeatDueDate'
                                :descriptionTaskList='descriptionTaskList'
                                :descriptionTaskChildList='descriptionTaskChildList' :taskIndex='taskIndex'
                                :descriptionTaskIndex='descriptionTaskIndex' date="weekly" />
                        </template>

                        <template #Monthly>
                            <RepeatDueDate @componentEvent='resetRepeatDueDate'
                                :descriptionTaskList='descriptionTaskList'
                                :descriptionTaskChildList='descriptionTaskChildList' :taskIndex='taskIndex'
                                :descriptionTaskIndex='descriptionTaskIndex' date="monthly" />
                        </template>

                        <template #Yearly>
                            <RepeatDueDate @componentEvent='resetRepeatDueDate'
                                :descriptionTaskList='descriptionTaskList'
                                :descriptionTaskChildList='descriptionTaskChildList' :taskIndex='taskIndex'
                                :descriptionTaskIndex='descriptionTaskIndex' date="yearly" />
                        </template>

                        <template #Custom>
                            <RepeatDueDate @componentEvent='resetRepeatDueDate'
                                :descriptionTaskList='descriptionTaskList'
                                :descriptionTaskChildList='descriptionTaskChildList' :taskIndex='taskIndex'
                                :descriptionTaskIndex='descriptionTaskIndex' date="customDate" />
                        </template>
                    </DropDown>
                </transition>

                <transition name="to-bottom">
                    <DropDown :dropDownSlots="dropDownRemindDueDateSlots" :top="top" :right="right"
                        v-if="toggleRemindDropDown">
                        <template #LaterToDay>
                            <div @click="remindDueDate('toDay')">
                                <img src="@/assets/design-material/icons/remind-today.png" alt="due date">
                                <span>Later today</span>
                            </div>
                        </template>

                        <template #Tomorrow>
                            <div @click="remindDueDate('tomorrow')">
                                <img src="@/assets/design-material/icons/remind-tomorrow.png" alt="due tomorrow">
                                <span>Tomorrow</span>
                            </div>
                        </template>

                        <template #NextWeek>
                            <div @click="remindDueDate('nextWeek')">
                                <img src="@/assets/design-material/icons/remind-next-week.png" alt="next week">
                                <span>Next Week</span>
                            </div>
                        </template>

                        <template #PickADateAndTime>
                            <div @click="remindDueDate('customDate')">
                                <template v-if="pickCustomRemindDate">
                                    <img @click="addCustomRemindDate" src="@/assets/design-material/icons/plus.png"
                                        alt="add custom date">
                                    <input :class="{ error: errorCustomRemindDateToggle }" class="custom-date"
                                        v-model="pickedCustomRemindDate" type="datetime-local" name="" id="">
                                </template>

                                <template v-else>
                                    <img src="@/assets/design-material/icons/custom-remind-date.png" alt="pick a date">
                                    <span>Pick a date and time</span>
                                </template>
                            </div>
                        </template>
                    </DropDown>
                </transition>

                <TaskNote :descriptionTaskList='descriptionTaskList'
                    :descriptionTaskChildList='descriptionTaskChildList' :descriptionTaskIndex='descriptionTaskIndex'
                    :task='task' />
            </div>

            <div class="task-time-and-delete">
                <div class="time">Created on {{ task.addTime }}</div>

                <span class="delete" @click="togglePopup">
                    <img src="@/assets/design-material/icons/delete.png" alt="">
                </span>
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

        <PopUp :showPopUp="alertPopup">
            <template #title>
                Uncomplete Planned Task
            </template>

            <template #content>
                you need to complete this uncomplete Planned Task or change his time or delete it
            </template>

            <template #button>
                <button class="delete" @click="deleteTask">Delete</button>
                <button class="move" @click="completeAsideTask">Complete</button>
                <button class="close" @click="toggleAlertPopup">Cancel</button>
            </template>
        </PopUp>

        <PopUp :showPopUp="remindPopup">
            <template #title>
                Uncomplete Planned Task
            </template>

            <template #content>
                you need to complete this uncomplete Task or Snooze it for ten minutes or delete it
            </template>

            <template #button>
                <button class="delete" @click="deleteTask">Delete</button>
                <button class="move" @click="completeAsideTask">Complete</button>
                <button class="sort" @click="snoozeTask">Snooze</button>
                <button class="close" @click="toggleRemindPopup">Cancel</button>
            </template>
        </PopUp>
    </div>
</template>

<script>
import { allLists } from '@/stores/allLists.js'

import { mapState, mapWritableState } from 'pinia'
import PopUp from './PopUp.vue'
import DropDown from '../components/DropDown.vue';

import ImportantToggle from './description_component/ImportantToggle.vue';
import CompleteToggle from './description_component/CompleteToggle.vue';
import Rename from './description_component/Rename.vue';
import AddToMyDay from './description_component/AddToMyDay.vue';
import TaskNote from './description_component/TaskNote.vue';
import AddDueDate from './description_component/AddDueDate.vue';
import RepeatDueDate from './description_component/RepeatDueDate.vue';
import RemindDueDate from './description_component/RemindDueDate.vue';
import Steps from './description_component/Steps.vue';

export default {
    name: 'DescriptionTask',
    props: ['descriptionTaskList', 'descriptionTaskChildList', 'descriptionTaskIndex', 'element', 'chosenSmartList'],
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
        DropDown,
        ImportantToggle,
        CompleteToggle,
        Rename,
        AddToMyDay,
        TaskNote,
        AddDueDate,
        RepeatDueDate,
        RemindDueDate,
        Steps
    },
    emits: ['closeDescription'],
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
            errorCustomDateToggle: false,
            toggleRepeatDropDown: false,
            dropDownRepeatDueDateSlots: ['Daily', 'WeekDays', 'Weekly', 'Monthly', 'Yearly', 'Custom'],
            pickCustomRepeatDate: false,
            pickedCustomRepeatDate: null,
            errorCustomRepeatDateToggle: false,
            toggleRemindDropDown: false,
            dropDownRemindDueDateSlots: ['LaterToDay', 'Tomorrow', 'NextWeek', 'PickADateAndTime'],
            pickedCustomRemindDate: null,
            errorCustomRemindDateToggle: false,
            pickCustomRemindDate: false,
            toggleDueDateDropDown: false,
            alertPopup: false,
            repeatedTaskObject: {},
            smartListTaskId: this.element.getAttribute('data-id'),
            remindToggle: false,
            remindPopup: false,
            name: '',
            oldObj: {},
            time: '',
            hours: '',
            minutes: '',
            ampm: '',
            strTime: ''
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists']),
        ...mapWritableState(allLists, ['lists', 'smartList']),


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
        },
        dueDateStateClass() {
            if (!!this.descriptionTaskChildList) {
                if (new Date() > new Date(new Date(this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].dueTime).setDate(new Date(this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].dueTime).getDate() + 1)) && !this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].complete) {
                    return true
                } else {
                    return false
                }
            } else {
                if (new Date() > new Date(new Date(this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].dueTime).setDate(new Date(this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].dueTime).getDate() + 1)) && !this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].complete) {
                    return true
                } else {
                    return false
                }
            }
        },
        remindDueDateStateClass() {
            if (!!this.descriptionTaskChildList) {
                if (new Date() > new Date(this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].remindMeDate) && !this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].complete) {
                    return true
                } else {
                    return false
                }
            } else {
                if (new Date() > new Date(this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].remindMeDate) && !this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].complete) {
                    return true
                } else {
                    return false
                }
            }
        },
        repeatState() {
            if (!!this.descriptionTaskChildList) {
                if (this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].repeatDueDateName) {
                    return this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].repeatDueDateName
                } else {
                    return 'Repeat'
                }
            } else {
                if (this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].repeatDueDateName) {
                    return this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].repeatDueDateName
                } else {
                    return 'Repeat'
                }
            }
        },
        remindState() {
            if (!!this.descriptionTaskChildList) {
                if (this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].remindMeName) {
                    return this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].remindMeName
                } else {
                    return 'Remind me'
                }
            } else {
                if (this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].remindMeName) {
                    return this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].remindMeName
                } else {
                    return 'Remind me'
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
        emptyTextValue() {
            this.textValue = ''
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
        },
        closeDescription() {
            this.element.classList.remove('add-animation-x')
            this.$emit('closeDescription', false)
        },
        completeAsideTask() {
            if (!!this.descriptionTaskChildList) {
                this.thisTask = this.taskIndex
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

                if (this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.thisTask].steps.length > 0) {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.thisTask].steps.forEach((step) => {
                        if (this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.thisTask].complete) {
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
                this.thisTask = this.taskIndex

                this.lists[this.descriptionTaskList].tasks[this.thisTask].steps.forEach((step) => {
                    if (this.lists[this.descriptionTaskList].tasks[this.thisTask].complete) {
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

            this.alertPopup = false
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

        ,
        toggleAddDueDate(height) {
            this.toggleRepeatDropDown = false
            this.toggleRemindDropDown = false
            this.toggleDueDateDropDown = !this.toggleDueDateDropDown
            this.top = this.$refs.timeAndDate.getBoundingClientRect().top + height
            this.right = 70
        },
        toggleRepeat(height) {
            this.toggleDueDateDropDown = false
            this.toggleRemindDropDown = false
            this.toggleRepeatDropDown = !this.toggleRepeatDropDown
            this.top = height
            this.right = 70
        },
        toggleRemind(height) {
            this.toggleDueDateDropDown = false
            this.toggleRepeatDropDown = false
            this.toggleRemindDropDown = !this.toggleRemindDropDown
            this.top = this.$refs.timeAndDate.getBoundingClientRect().top + height
            this.right = 70
        },
        deleteDueDate() {
            if (!!this.descriptionTaskChildList) {
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueTime = ''
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].dueDateName = ''
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].realDueDateName = ''

                this.lists[0].tasks.forEach((task, index) => {
                    if (+task.id === +this.taskIndex && +task.listId === +this.descriptionTaskList && +this.childId === +task.descriptionTaskChildList) {
                        this.lists[2].tasks.splice(index, 1)
                    }
                })
            } else {
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueTime = ''
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].dueDateName = ''
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].realDueDateName = ''

                this.lists[2].tasks.forEach((task, index) => {
                    if (+task.id === +this.taskIndex && +task.listId === +this.descriptionTaskList) {
                        this.lists[2].tasks.splice(index, 1)
                    }
                })
            }

            this.toggleDueDateDropDown = false

            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            // localStorage.setItem("allSmartLists", JSON.stringify(this.smartList))
        },
        closeRepeat() {
            if (!!this.descriptionTaskChildList) {
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].repeatDueDate = ''
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].repeatDueDateName = ''
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].realRepeatDueDateName = ''
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            } else {
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].repeatDueDate = ''
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].repeatDueDateName = ''
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].realRepeatDueDateName = ''
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            }
        },
        remindDueDate(date) {
            if (!!this.descriptionTaskChildList) {
                if (date === 'toDay') {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMe = 'toDay'
                    this.calcTime(new Date().setDate(new Date().getDate()) + 2 * 60 * 60 * 1000)

                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMeDate = this.time
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMeName = `toDay at ${this.strTime}`
                    this.toggleRemindDropDown = false
                    this.sendMessage(this.time)
                } else if (date === 'tomorrow') {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMe = 'tomorrow'
                    this.calcTime(new Date().setDate(new Date().getDate() + 1) + 2 * 60 * 60 * 1000)


                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMeDate = this.time
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMeName = `tomorrow at ${this.strTime}`
                    this.toggleRemindDropDown = false
                    this.sendMessage(this.time)
                } else if (date === 'nextWeek') {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMe = 'nextWeek'
                    this.calcTime(new Date().setDate(new Date().getDate() + 7) + 2 * 60 * 60 * 1000)

                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMeDate = this.time
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMeName = `${this.time.toDateString().slice(0, 10)} at ${this.strTime}`
                    this.toggleRemindDropDown = false
                    this.sendMessage(this.time)
                } else if (date === 'customDate') {
                    this.pickCustomRemindDate = true
                }
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            } else {
                if (date === 'toDay') {
                    this.calcTime(new Date().setDate(new Date().getDate()) + 2 * 60 * 60 * 1000)

                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMe = 'toDay'
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMeDate = this.time
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMeName = `toDay at ${this.strTime}`
                    this.toggleRemindDropDown = false

                    this.sendMessage(this.time)
                } else if (date === 'tomorrow') {
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMe = 'tomorrow'

                    this.calcTime(new Date().setDate(new Date().getDate() + 1) + 2 * 60 * 60 * 1000)

                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMeDate = this.time
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMeName = `tomorrow at ${this.strTime}`
                    this.toggleRemindDropDown = false
                    this.sendMessage(this.time)
                } else if (date === 'nextWeek') {
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMe = 'nextWeek'

                    this.calcTime(new Date().setDate(new Date().getDate() + 7) + 2 * 60 * 60 * 1000)

                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMeDate = this.time
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMeName = `${this.time.toDateString().slice(0, 10)} at ${this.strTime}`
                    this.toggleRemindDropDown = false
                    this.sendMessage(this.time)
                } else if (date === 'customDate') {
                    this.pickCustomRemindDate = true
                }
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            }
        },
        sendMessage(time) {
            const worker = new Worker('../src/worker.js')
            worker.postMessage(time)
            worker.onmessage = (time) => {
                this.remindToggle = time.returnValue
            }
        },
        calcTime(time) {
            this.time = new Date(time)
            this.hours = this.time.getHours()
            this.minutes = this.time.getMinutes()
            this.ampm = this.hours >= 12 ? 'pm' : 'am';
            this.hours = this.hours % 12;
            this.hours = this.hours ? this.hours : 12;
            this.minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
            this.strTime = this.hours + ':' + this.minutes + ' ' + this.ampm;
        },
        addCustomRemindDate() {
            if (!!this.pickedCustomRemindDate) {
                if (!!this.descriptionTaskChildList) {
                    this.calcTime(this.pickedCustomRemindDate)

                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMe = 'CustomDate'
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMeDate = this.time
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMeName = `${this.time.toDateString().slice(0, 10)} at ${this.strTime}`

                    this.sendMessage(this.time)
                    localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                } else {
                    this.calcTime(this.pickedCustomRemindDate)


                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMe = 'CustomDate'
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMeDate = this.time
                    this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMeName = `${this.time.toDateString().slice(0, 10)} at ${this.strTime}`

                    this.sendMessage(this.time)
                    localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                }
                this.pickCustomRemindDate = false
                this.toggleRemindDropDown = false
                this.pickedCustomRemindDate = null
            } else {
                if (!!this.errorCustomRemindDateToggle) {
                    this.errorCustomRemindDateToggle = false
                    setTimeout(() => {
                        this.errorCustomRemindDateToggle = true
                    }, 0)
                } else {
                    setTimeout(() => {
                        this.errorCustomRemindDateToggle = true
                    }, 0)
                }
            }
        },
        snoozeTask() {
            if (!!this.descriptionTaskChildList) {
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMe = 'toDay'
                this.calcTime(new Date().getTime() + 10 * 60000)

                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMeDate = this.time
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMeName = `toDay at ${this.strTime}`
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].snooze = true
                this.toggleRemindDropDown = false
                this.sendMessage(this.time)

                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            } else {
                this.calcTime(new Date().getTime() + 10 * 60000)

                this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMe = 'toDay'
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMeDate = this.time
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMeName = `toDay at ${this.strTime}`
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].snooze = true
                this.toggleRemindDropDown = false

                this.sendMessage(this.time)
                this.remindToggle = false
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            }

            this.remindPopup = !this.remindPopup
        },
        closeRemind() {
            if (!!this.descriptionTaskChildList) {
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMe = ''
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMeDate = ''
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.taskIndex].remindMeName = ''
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            } else {
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMe = ''
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMeDate = ''
                this.lists[this.descriptionTaskList].tasks[this.taskIndex].remindMeName = ''
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            }
        },
        toggleAlertPopup() {
            this.alertPopup = !this.alertPopup
        },
        toggleRemindPopup() {
            this.remindPopup = !this.remindPopup
        },
        changeId(index) {
            this.taskIndex = index
        },
        resetDueDate() {
            this.toggleDueDateDropDown = false
        },
        resetRepeatDueDate() {
            this.toggleRepeatDropDown = false
        },
        resetRemindDueDate() {
            this.toggleRemindDropDown = false
        },
        showRemind(time) {
            this.remindToggle = time.returnValue
        },
        togglePopUp(target) {
            if (target === 'move') {
                this.moveTaskToggle = !this.moveTaskToggle
                this.showPopUp = !this.showPopUp
                this.target = 'move'
                this.toggleDropDown = false
            } else {
                this.toggleDropDown = false
                this.showPopUp = !this.showPopUp
                this.target = 'delete'
            }
        },
        togglePopup() {
            this.showPopUp = !this.showPopUp
        }
    }
}
</script>