<template>
    <transition-group name="tasks-transition">
        <li ref="taskElement" @contextmenu="openDropDown" @click.self="openDescription"
            :class="{complete: task.complete, delete: new Date() > new Date(new Date(task.dueTime).setDate(new Date(task.dueTime).getDate() + 1)) && !task.complete}"
            v-for="(task,index) in returnAllTasks" :key="task.id" :data-id="index">
            <span :data-id="index" @click="completeTask('task')" class="check">
                <img :data-id="index" src="@/assets/design-material/icons/check.png" alt="check" />
            </span>

            <span @click="openDescription" :data-id="index" class="task-main-info">
                <span :data-id="index" class="task-name" :class="{ complete: task.complete }">
                    {{ task.name }}
                </span>

                <span :data-id="index" class="info-icons">
                    <span :data-id="index" v-if="task.steps.length > 0" class="info-icon steps">
                        <img :data-id="index" src="@/assets/design-material/icons/process.png" alt="task steps"
                            title="task steps">
                        {{ (task.steps.filter((step) => { return step.complete === true }).length) }} Of {{
                                task.steps.length
                        }}
                    </span>

                    <!-- <span :data-id="index" class="border" v-if="task.steps.length > 0 && task.note"></span> -->

                    <span :data-id="index" class="info-icon note" v-if="task.note">
                        <img :data-id="index" src="@/assets/design-material/icons/notes.png" alt="task notes"
                            title="task notes">Note
                    </span>

                    <!-- <span :data-id="index" class="border"
                        v-if="task.steps.length > 0 && task.dueDateName || task.note && task.dueDateName"></span> -->

                    <span
                        :class="{ delete: new Date() > new Date(new Date(task.dueTime).setDate(new Date(task.dueTime).getDate() + 1)) && !task.complete }"
                        :data-id="index" class="info-icon note" v-if="task.dueDateName">
                        <img :data-id="index" src="@/assets/design-material/icons/due-date.png" :alt="task.dueDateName"
                            title="task notes">
                        {{ task.dueDateName }}
                    </span>

                    <!-- <span :data-id="index" class="border"
                        v-if="task.steps.length > 0 && task.addToMyDay || task.note && task.addToMyDay || task.dueDateName && task.addToMyDay"></span> -->

                    <span :data-id="index" class="info-icon add-task-container note" v-if="task.addToMyDay">
                        <img :data-id="index" src="@/assets/design-material/icons/my-day.png" :alt="task.addToMyDay"
                            title="task notes">
                        My Day
                    </span>

                    <!-- <span :data-id="index" class="border"
                        v-if="task.steps.length > 0 && task.addToMyDay || task.note && task.addToMyDay || task.dueDateName && task.addToMyDay|| task.dueDateName && !!task.repeatDueDateName"></span> -->

                    <span :data-id="index" class="info-icon note" v-if="!!task.repeatDueDateName">
                        <img :data-id="index" src="@/assets/design-material/icons/repeat.png"
                            :alt="task.repeatDueDateName" title="task notes">
                        {{ task.repeatDueDateName }}
                    </span>

                    <!-- <span :data-id="index" class="border"
                        v-if="task.steps.length > 0 && task.addToMyDay || task.note && task.addToMyDay || task.dueDateName && task.addToMyDay|| task.dueDateName && !!task.repeatDueDateName|| task.repeatDueDateName && !!task.remindMe"></span> -->

                    <span :data-id="index" class="info-icon note" v-if="!!task.remindMe">
                        <img :data-id="index" src="@/assets/design-material/icons/reminder.png" :alt="task.remindMe"
                            title="task notes">
                        {{ task.remindMe }}
                    </span>
                </span>
            </span>

            <img v-if="task.important" :data-id="index" @click="importantToggle('task')" class="important-toggle"
                src="@/assets/design-material/icons/important-task.png" alt="">

            <img v-else :data-id="index" @click="importantToggle('task')" class="important-toggle"
                src="@/assets/design-material/icons/important-hover.png" alt="">
        </li>
    </transition-group>

    <transition name="to-bottom">
        <DropDown :dropDownSlots="dropDownSlots" :top="top" :left="left" v-if="toggleDropDown">
            <template #RenameTask>
                <div class="renameList" @click.self="renameTask">
                    <template v-if="showRename">
                        <!-- <img @click="newTaskName" class="renameTask" :class="{ active: itemDetect }"
                            src="@/assets/design-material/icons/plus.png" alt="add-item" /> -->

                        <img @click="newTaskName" class="renameTask" src="@/assets/design-material/icons/plus.png"
                            alt="add-item" />
                        <input @keyup.enter="newTaskName" required @focus="toggleErrorClass" v-model="newName"
                            placeholder="New Name" type="text" name="" id="" :class="{ error: toggleError }" />
                        <img @click="closeRename" src="@/assets/design-material/icons/close.png" alt="close rename" />
                    </template>

                    <template v-else>
                        <img @click="renameTask" src="@/assets/design-material/icons/rename.png" alt="rename task" />
                        <span @click="renameTask">Rename Task</span>
                    </template>
                </div>
            </template>

            <template #MarkAsImportant>
                <div @click="importantToggle('dropdown')">
                    <img v-if="returnImportantState" src="@/assets/design-material/icons/important-task.png"
                        alt="important task">

                    <img v-else src="@/assets/design-material/icons/important-hover.png" alt="not important task">

                    <span>{{ returnImportantState ? 'Remove Importance' : 'Mark As Important' }}</span>
                </div>
            </template>

            <template #MarkAsComplete>
                <div @click="completeTask('dropdown')">
                    <img v-if="returnCompleteState" src="@/assets/design-material/icons/complete.png"
                        alt="complete task">

                    <img v-else src="@/assets/design-material/icons/dry-clean.png" alt="not complete task">

                    <span>{{ returnCompleteState ? 'Mark As Not Complete' : 'Mark As Complete' }}</span>
                </div>
            </template>

            <template v-if="dueDateState" #AddToMyDay>
                <div @click="addToMyDay" v-if="!addToMyDayState">
                    <img src="@/assets/design-material/icons/sun.png" alt="added to my day">
                    <span>Add to my day</span>
                </div>

                <div @click="closeToMyDay" v-else>
                    <img src="@/assets/design-material/icons/sun.png" alt="">
                    <span>Remove from my day</span>
                </div>
            </template>

            <template v-if="dueDateState" #DueToday>
                <div @click="addDueDate('today')">
                    <img src="@/assets/design-material/icons/date.png" alt="">
                    <span>Due ToDay</span>
                </div>
            </template>

            <template v-if="dueDateState" #DueTomorrow>
                <div @click="addDueDate('tomorrow')">
                    <img src="@/assets/design-material/icons/tomorrow.png" alt="due tomorrow">
                    <span>Due tomorrow</span>
                </div>
            </template>

            <template v-if="dueDateState" #DueNextWeek>
                <div @click="addDueDate('nextWeek')">
                    <img src="@/assets/design-material/icons/next-week.png" alt="due tomorrow">
                    <span>Due Next Week</span>
                </div>
            </template>

            <template #PickADate>
                <div @click="addDueDate('customDate')">
                    <template v-if="pickCustomDate">
                        <img @click="addCustomDate" src="@/assets/design-material/icons/plus.png" alt="add custom date">
                        <input :class="{ error: errorCustomDateToggle }" class="custom-date" v-model="pickedCustomDate"
                            type="date" name="" id="">
                    </template>

                    <template v-else>
                        <img src="@/assets/design-material/icons/custom-date.png" alt="pick a date">
                        <span>Pick a Date</span>
                    </template>
                </div>
            </template>

            <template #MoveTaskTo v-if="ReturnAllLists">
                <div @click="togglePopUp('move')">
                    <img src="@/assets/design-material/icons/curve-arrow.png" alt="">
                    <span>Move task to...</span>
                </div>
            </template>

            <template #DeleteTask>
                <div class="delete" @click="togglePopUp('delete')">
                    <img src="@/assets/design-material/icons/delete.png" alt="">
                    <span>Delete Task</span>
                </div>
            </template>
        </DropDown>
    </transition>

    <PopUp :showPopUp="showPopUp">
        <template #title>
            {{ target === 'move' ? 'Move Task' : 'Delete Task' }}
        </template>

        <template v-slot:content>
            <div v-if="moveTaskToggle" class="select-parent">
                <select ref="selectedLists" name="" id="">
                    <option v-for="(groupOfList, index) in ReturnAllListsArray" :key="index" :value="groupOfList.id">
                        {{ groupOfList.listName }}
                    </option>
                </select>
            </div>
            <p v-else>
                Task {{ taskName }} will be permanently deleted
            </p>
        </template>

        <template #button>
            <button v-if="moveTaskToggle" class="move" @click="MoveTaskTo">Move</button>
            <button v-else class="delete" @click="deleteTask">Delete</button>
            <button class="close" @click="closePopUp">Cancel</button>
        </template>
    </PopUp>
</template>

<script>
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'
import PopUp from './PopUp.vue'
import DropDown from '../components/DropDown.vue';
export default {
    name: 'SingleTask',
    props: ['listId', 'toggleShrink', 'childId', 'chosenSmartList'],
    emits: ['openDescriptionEvent'],
    components: {
        PopUp,
        DropDown
    },
    beforeMount() {
        this.lists.forEach((list, index) => {
            if (list.listChildren === false) {
                if (index != this.listId) {
                    this.ReturnAllListsArray.push(list)
                }
            }
        })
    },

    data() {
        return {
            importantTask: {},
            shrink: this.toggleShrink,
            taskElement: '',
            oldTaskId: 0,
            stepsCount: 0,
            dropDownSlots: ['RenameTask', 'MarkAsImportant', 'MarkAsComplete', 'AddToMyDay', 'DueToday', 'DueTomorrow', 'DueNextWeek', 'PickADate', 'MoveTaskTo', 'DeleteTask'],
            toggleDropDown: false,
            showPopUp: false,
            taskElementId: null,
            parentElementDomRect: '',
            ReturnAllListsArray: [],
            showRename: false,
            newName: '',
            taskName: '',
            toggleError: false,
            thisTask: null,
            oldTaskId: null,
            oldTaskIdDrop: null,
            pickCustomDate: false,
            pickedCustomDate: null,
            errorCustomDateToggle: false,
            addToMyDayState: false,
            repeatedTaskObject: {}
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists', 'smartList']),
        ...mapWritableState(allLists, ['lists', 'smartList']),
        returnAllTasks() {

            if (!!this.chosenSmartList) {
                if (this.smartList[this.chosenSmartList].tasks.length > 0) {
                    return this.smartList[this.chosenSmartList].tasks
                }
            } else {
                if (!!this.childId) {
                    if (this.returnLists[this.listId].listsArray[this.childId].tasks.length > 0) {
                        return this.returnLists[this.listId].listsArray[this.childId].tasks
                    }
                } else {
                    if (this.returnLists[this.listId].tasks.length > 0) {
                        return this.returnLists[this.listId].tasks
                    }
                }
            }
        },
        returnImportantState() {
            if (!!this.childId) {
                return this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].important
            } else {
                return this.lists[this.listId].tasks[this.taskElementId].important
            }
        },
        returnCompleteState() {
            if (!!this.childId) {
                return this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].complete
            } else {
                return this.lists[this.listId].tasks[this.taskElementId].complete
            }
        },
        ReturnAllLists() {
            if (this.ReturnAllListsArray.length > 0) {
                return true
            } else {
                return false
            }
        },
        dueDateState() {
            if (!!this.childId) {
                if (this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].realDueDateName === 'Tomorrow') {
                    this.dropDownSlots = ['RenameTask', 'MarkAsImportant', 'MarkAsComplete', 'AddToMyDay', 'DueToday', 'DueNextWeek', 'PickADate', 'MoveTaskTo', 'DeleteTask']
                    return true
                } else if (this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].realDueDateName === 'ToDay') {
                    this.dropDownSlots = ['RenameTask', 'MarkAsImportant', 'MarkAsComplete', 'AddToMyDay', 'DueTomorrow', 'DueNextWeek', 'PickADate', 'MoveTaskTo', 'DeleteTask']
                    return true
                } else if (this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].realDueDateName === 'NextWeek') {
                    this.dropDownSlots = ['RenameTask', 'MarkAsImportant', 'MarkAsComplete', 'AddToMyDay', 'DueToday', 'DueTomorrow', 'PickADate', 'MoveTaskTo', 'DeleteTask']
                    return true
                } else {
                    this.dropDownSlots = ['RenameTask', 'MarkAsImportant', 'MarkAsComplete', 'AddToMyDay', 'DueToday', 'DueTomorrow', 'DueNextWeek', 'PickADate', 'MoveTaskTo', 'DeleteTask']
                    return true
                }
            } else {
                if (this.lists[this.listId].tasks[this.taskElementId].realDueDateName === 'Tomorrow') {
                    this.dropDownSlots = ['RenameTask', 'MarkAsImportant', 'MarkAsComplete', 'AddToMyDay', 'DueToday', 'DueNextWeek', 'PickADate', 'MoveTaskTo', 'DeleteTask']
                    return true
                } else if (this.lists[this.listId].tasks[this.taskElementId].realDueDateName === 'ToDay') {
                    this.dropDownSlots = ['RenameTask', 'MarkAsImportant', 'MarkAsComplete', 'AddToMyDay', 'DueTomorrow', 'DueNextWeek', 'PickADate', 'MoveTaskTo', 'DeleteTask']
                    return true
                } else if (this.lists[this.listId].tasks[this.taskElementId].realDueDateName === 'NextWeek') {
                    this.dropDownSlots = ['RenameTask', 'MarkAsImportant', 'MarkAsComplete', 'AddToMyDay', 'DueToday', 'DueTomorrow', 'PickADate', 'MoveTaskTo', 'DeleteTask']
                    return true
                } else {
                    this.dropDownSlots = ['RenameTask', 'MarkAsImportant', 'MarkAsComplete', 'AddToMyDay', 'DueToday', 'DueTomorrow', 'DueNextWeek', 'PickADate', 'MoveTaskTo', 'DeleteTask']
                    return true
                }
            }
        }
    },
    watch: {
        toggleShrink() {
            this.taskElement = event.target
            this.taskElement.classList.remove('add-animation-x')
            if (this.taskElement.classList.contains('add-animation')) {
                this.taskElement.classList.remove('add-animation')
                setTimeout(() => {
                    this.taskElement.classList.add('add-animation')
                }, 0)
            } else {
                this.taskElement.classList.remove('add-animation')
                setTimeout(() => {
                    this.taskElement.classList.add('add-animation')
                }, 0)
            }
        },
        lists: {
            handler(newValue, oldValue) {
                this.ReturnAllListsArray = []
                this.lists.forEach((list, index) => {
                    if (list.listChildren === false) {
                        if (index != this.listId) {
                            this.ReturnAllListsArray.push(list)
                        }
                    }
                })
            },
            deep: true
        }
    },
    methods: {
        openDropDown() {
            event.preventDefault()
            this.$emit('openDescriptionEvent', this.listId, event.target.getAttribute('data-id'), false, this.taskElement)

            this.taskElementId = event.target.getAttribute('data-id')
            if (event.target.tagName === 'IMG' || (event.target.tagName === 'SPAN' && event.target.classList.contains('task-main-info') || event.target.classList.contains('check'))) {
                this.parentElementDomRect = event.target.parentElement.getBoundingClientRect()
            } else if (event.target.tagName === 'LI') {
                this.parentElementDomRect = event.target.getBoundingClientRect()
            } else {
                this.parentElementDomRect = event.target.parentElement.parentElement.getBoundingClientRect()
            }
            let x = this.$refs.taskElement[this.taskElementId].getBoundingClientRect()
            if (this.parentElementDomRect.top > 350) {
                this.top = this.parentElementDomRect.top - 357
            } else {
                this.top = this.parentElementDomRect.top + 60
            }
            this.left = (x.width / 2) - 100
            this.toggleDropDown = !this.toggleDropDown


            if (!!this.childId) {
                this.taskName = this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].name
                this.addToMyDayState = this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].addToMyDay
            } else {
                this.taskName = this.lists[this.listId].tasks[this.taskElementId].name
                this.addToMyDayState = this.lists[this.listId].tasks[this.taskElementId].addToMyDay
            }

            if (this.toggleDropDown) {
                this.oldTaskIdDrop = event.target.getAttribute('data-id')
            } else {
                if (+this.oldTaskIdDrop != +this.taskElementId) {
                    this.toggleDropDown = false
                    this.oldTaskIdDrop = event.target.getAttribute('data-id')
                    setTimeout(() => {
                        this.toggleDropDown = true
                    }, 0)
                }
            }
        },
        closeDropDown() {
            this.toggleDropDown = false
            this.moveTaskToggle = false
            this.taskElementId = null
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
        closePopUp() {
            this.showPopUp = !this.showPopUp
            this.toggleDropDown = !this.toggleDropDown
            this.moveTaskToggle = false
            this.target = ''
        },
        openDescription() {
            this.toggleDropDown = false
            this.taskElement = event.target
            this.taskElement.classList.remove('add-animation-x')
            if (this.taskElement.classList.contains('add-animation')) {
                this.taskElement.classList.remove('add-animation')
                setTimeout(() => {
                    this.taskElement.classList.add('add-animation')
                }, 0)
            } else {
                this.taskElement.classList.add('add-animation')
            }
            if (!this.toggleShrink) {
                this.shrink = !this.toggleShrink
                this.oldTaskId = event.target.getAttribute('data-id')
                this.$emit('openDescriptionEvent', this.listId, event.target.getAttribute('data-id'), this.shrink, this.taskElement)
            } else {
                if (this.oldTaskId != +event.target.getAttribute('data-id')) {
                    this.oldTaskId = event.target.getAttribute('data-id')
                    this.$emit('openDescriptionEvent', this.listId, event.target.getAttribute('data-id'), this.shrink, this.taskElement)
                } else {
                    this.shrink = !this.toggleShrink
                    this.$emit('openDescriptionEvent', this.listId, event.target.getAttribute('data-id'), this.shrink, this.taskElement)
                }
            }
        },
        deleteTask() {
            if (!!this.childId) {
                this.lists[this.listId].listsArray[this.childId].tasks.splice(this.taskElementId, 1)
                this.lists[this.listId].listsArray[this.childId].tasks.forEach((list, index) => {
                    if (index >= this.taskElementId) {
                        list.id = list.id - 1
                    }
                })
            } else {
                this.lists[this.listId].tasks.splice(this.taskElementId, 1)
                this.lists[this.listId].tasks.forEach((list, index) => {
                    if (index >= this.taskElementId) {
                        list.id = list.id - 1
                    }
                })
            }
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            this.toggleDropDown = false
            this.taskElementId = null
            this.parentElementDomRect = null
            this.showPopUp = !this.showPopUp
        },
        importantToggle(target) {
            if (target === 'dropdown') {
                this.taskElement = this.$refs.taskElement[this.taskElementId]
            } else {
                this.taskElement = event.target.parentElement
            }
            this.taskElement.classList.remove('add-animation-x')
            this.taskElement.classList.remove('add-animation')
            if (!!this.childId) {
                if (this.lists[this.listId].listsArray[this.childId].tasks[event.target.getAttribute('data-id') || this.taskElementId].important) {
                    this.lists[this.listId].listsArray[this.childId].tasks[event.target.getAttribute('data-id') || this.taskElementId].important = false
                    if (!!event.target.getAttribute('src')) {
                        event.target.setAttribute('src', event.target.getAttribute('src').replace('important-task', 'important-hover'))
                    }
                    this.importantTask = this.lists[this.listId].listsArray[this.childId].tasks[event.target.getAttribute('data-id') || this.taskElementId]
                    this.lists[this.listId].listsArray[this.childId].tasks.splice(event.target.getAttribute('data-id') || this.taskElementId, 1)
                    this.lists[this.listId].listsArray[this.childId].tasks.push(this.importantTask)
                    this.importantTask = {}
                } else {
                    if (!!event.target.getAttribute('src')) {
                        event.target.setAttribute('src', event.target.getAttribute('src').replace('important-hover', 'important-task'))
                    }
                    this.lists[this.listId].listsArray[this.childId].tasks[event.target.getAttribute('data-id') || this.taskElementId].important = true
                    this.importantTask = this.lists[this.listId].listsArray[this.childId].tasks[event.target.getAttribute('data-id') || this.taskElementId]
                    this.lists[this.listId].listsArray[this.childId].tasks.splice(event.target.getAttribute('data-id') || this.taskElementId, 1)
                    this.lists[this.listId].listsArray[this.childId].tasks.unshift(this.importantTask)
                    this.importantTask = {}
                }
            } else {
                if (this.lists[this.listId].tasks[event.target.getAttribute('data-id') || this.taskElementId].important) {
                    this.lists[this.listId].tasks[event.target.getAttribute('data-id') || this.taskElementId].important = false
                    if (!!event.target.getAttribute('src')) {
                        event.target.setAttribute('src', event.target.getAttribute('src').replace('important-task', 'important-hover'))
                    }
                    this.importantTask = this.lists[this.listId].tasks[event.target.getAttribute('data-id') || this.taskElementId]
                    this.lists[this.listId].tasks.splice(event.target.getAttribute('data-id') || this.taskElementId, 1)
                    this.lists[this.listId].tasks.push(this.importantTask)
                    this.importantTask = {}
                } else {
                    if (!!event.target.getAttribute('src')) {
                        event.target.setAttribute('src', event.target.getAttribute('src').replace('important-hover', 'important-task'))
                    }
                    this.lists[this.listId].tasks[event.target.getAttribute('data-id') || this.taskElementId].important = true
                    this.importantTask = this.lists[this.listId].tasks[event.target.getAttribute('data-id') || this.taskElementId]
                    this.lists[this.listId].tasks.splice(event.target.getAttribute('data-id') || this.taskElementId, 1)
                    this.lists[this.listId].tasks.unshift(this.importantTask)
                    this.importantTask = {}
                }
            }
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            this.toggleDropDown = false
            this.taskElementId = null
            this.parentElementDomRect = null
        },
        completeTask(target) {
            if (!!this.childId) {
                if (event.target.tagName === 'SPAN') {
                    this.thisTask = event.target.getAttribute('data-id') || this.taskElementId
                    if (target === 'dropdown') {
                        this.$refs.taskElement.forEach((task) => {
                            if (+task.getAttribute('data-id') === +this.taskElementId) {
                                this.taskElement = task
                            }
                        })
                    } else {
                        this.taskElement = event.target.parentElement
                    }
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
                    if (target === 'dropdown') {
                        this.$refs.taskElement.forEach((task) => {
                            if (+task.getAttribute('data-id') === +this.taskElementId) {
                                this.taskElement = task
                            }
                        })
                    } else {
                        this.taskElement = event.target.parentElement
                    }
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
                    if (target === 'dropdown') {
                        this.$refs.taskElement.forEach((task) => {
                            if (+task.getAttribute('data-id') === +this.taskElementId) {
                                this.taskElement = task
                            }
                        })
                    } else {
                        this.taskElement = event.target.parentElement
                    }
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
                    if (target === 'dropdown') {
                        this.$refs.taskElement.forEach((task) => {
                            if (+task.getAttribute('data-id') === +this.taskElementId) {
                                this.taskElement = task
                            }
                        })
                    } else {
                        this.taskElement = event.target.parentElement
                    }
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
            this.toggleDropDown = false
            this.taskElementId = null
            this.parentElementDomRect = null
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
        MoveTaskTo() {
            if (!!this.childId) {
                this.lists[this.$refs.selectedLists.value].tasks.push(this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId])

                if (this.lists[this.$refs.selectedLists.value].tasks.length > 0) {
                    let index = this.lists[this.$refs.selectedLists.value].tasks.length - 1
                    this.lists[this.$refs.selectedLists.value].tasks[index].id = this.lists[this.$refs.selectedLists.value].tasks.length - 1
                } else {
                    this.lists[this.$refs.selectedLists.value].listsArray[this.childId].tasks[0].id = 0
                }
                this.lists[this.listId].listsArray[this.childId].tasks.splice(this.taskElementId, 1)
            } else {
                this.lists[this.$refs.selectedLists.value].tasks.push(this.lists[this.listId].tasks[this.taskElementId])
                if (+this.lists[this.$refs.selectedLists.value].tasks.length > 0) {
                    let index = this.lists[this.$refs.selectedLists.value].tasks.length - 1
                    this.lists[this.$refs.selectedLists.value].tasks[index].id = this.lists[this.$refs.selectedLists.value].tasks.length - 1
                } else {
                    this.lists[this.$refs.selectedLists.value].tasks[0].id = 0
                }
                this.lists[this.listId].tasks.splice(this.taskElementId, 1)
            }
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            this.toggleDropDown = false
            this.taskElementId = null
            this.parentElementDomRect = null
            this.showPopUp = !this.showPopUp
            this.moveTaskToggle = !this.moveTaskToggle
        },
        closeRename() {
            this.showRename = !this.showRename
        },
        renameTask() {
            this.showRename = !this.showRename
            this.newName = this.taskName
        },
        newTaskName() {
            if (this.newName.length > 0) {
                if (!!this.childId) {
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].name = this.newName
                } else {
                    this.lists[this.listId].tasks[this.taskElementId].name = this.newName
                }
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                this.newName = ''
                this.showRename = !this.showRename
                this.toggleDropDown = !this.toggleDropDown
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
        addDueDate(date) {
            if (!!this.childId) {
                if (date === 'today') {
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskIndex].dueTime = new Date()
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskIndex].dueDateName = 'ToDay'
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskIndex].realDueDateName = 'ToDay'
                    this.toggleDropDown = false

                    this.smartList.planned.tasks.push(this.lists[this.listId].listsArray[this.childId].tasks[this.taskIndex])

                } else if (date === 'tomorrow') {
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskIndex].dueTime = new Date(new Date().setDate(new Date().getDate() + 1))
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskIndex].dueDateName = 'Tomorrow'
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskIndex].realDueDateName = 'Tomorrow'
                    this.toggleDropDown = false

                    this.smartList.planned.tasks.push(this.lists[this.listId].listsArray[this.childId].tasks[this.taskIndex])
                } else if (date === 'nextWeek') {
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskIndex].dueTime = new Date(new Date().setDate(new Date().getDate() + 7))
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskIndex].dueDateName = new Date(new Date().setDate(new Date().getDate() + 7)).toString().split(' ')[1] + ' ' + new Date(new Date().setDate(new Date().getDate() + 7)).toString().split(' ')[2]
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskIndex].realDueDateName = 'NextWeek'
                    this.toggleDropDown = false

                    this.smartList.planned.tasks.push(this.lists[this.listId].listsArray[this.childId].tasks[this.taskIndex])
                } else if (date === 'customDate') {
                    this.pickCustomDate = true
                }
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                localStorage.setItem("allSmartLists", JSON.stringify(this.smartList))
            } else {
                if (date === 'today') {
                    this.lists[this.listId].tasks[event.target.getAttribute('data-id') || this.taskElementId].dueTime = new Date()
                    this.lists[this.listId].tasks[event.target.getAttribute('data-id') || this.taskElementId].dueDateName = 'ToDay'
                    this.lists[this.listId].tasks[event.target.getAttribute('data-id') || this.taskElementId].realDueDateName = 'ToDay'
                    this.toggleDropDown = false

                    this.smartList.planned.tasks.push(this.lists[this.listId].tasks[event.target.getAttribute('data-id') || this.taskElementId])
                } else if (date === 'tomorrow') {
                    this.lists[this.listId].tasks[this.taskElementId].dueTime = new Date(new Date().setDate(new Date().getDate() + 1))
                    this.lists[this.listId].tasks[this.taskElementId].dueDateName = 'Tomorrow'
                    this.lists[this.listId].tasks[this.taskElementId].realDueDateName = 'Tomorrow'
                    this.toggleDropDown = false

                    this.smartList.planned.tasks.push(this.lists[this.listId].tasks[event.target.getAttribute('data-id') || this.taskElementId])
                } else if (date === 'nextWeek') {
                    this.lists[this.listId].tasks[this.taskElementId].dueTime = new Date(new Date().setDate(new Date().getDate() + 7))
                    this.lists[this.listId].tasks[this.taskElementId].dueDateName = new Date(new Date().setDate(new Date().getDate() + 7)).toString().split(' ')[1] + ' ' + new Date(new Date().setDate(new Date().getDate() + 7)).toString().split(' ')[2]
                    this.lists[this.listId].tasks[this.taskElementId].realDueDateName = 'NextWeek'
                    this.toggleDropDown = false

                    this.smartList.planned.tasks.push(this.lists[this.listId].tasks[event.target.getAttribute('data-id') || this.taskElementId])
                } else if (date === 'customDate') {
                    this.pickCustomDate = true
                }

                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                localStorage.setItem("allSmartLists", JSON.stringify(this.smartList))
            }
        },
        addCustomDate() {
            if (!!this.pickedCustomDate) {
                if (!!this.childId) {
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskIndex].dueTime = this.pickedCustomDate
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskIndex].dueDateName = new Date(this.pickedCustomDate).toString().split(' ')[1] + ' ' + new Date(this.pickedCustomDate).toString().split(' ')[2]
                    this.lists[this.listId].listsArray[this.childId].tasks[this.taskIndex].realDueDateName = 'CustomDate'

                    this.smartList.planned.tasks.push(this.lists[this.listId].listsArray[this.childId].tasks[this.taskIndex])
                } else {
                    this.lists[this.listId].tasks[this.taskElementId].dueTime = this.pickedCustomDate
                    this.lists[this.listId].tasks[this.taskElementId].dueDateName = new Date(this.pickedCustomDate).toString().split(' ')[1] + ' ' + new Date(this.pickedCustomDate).toString().split(' ')[2]
                    this.lists[this.listId].tasks[this.taskElementId].realDueDateName = 'CustomDate'

                    this.smartList.planned.tasks.push(this.lists[this.listId].tasks[this.taskElementId])
                }

                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                localStorage.setItem("allSmartLists", JSON.stringify(this.smartList))
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
        addToMyDay() {
            if (!!this.childId) {
                this.lists[this.listId].listsArray[this.childId].tasks[this.taskIndex].addToMyDay = true
                this.smartList.myDay.tasks.push(this.lists[this.listId].listsArray[this.childId].tasks[this.taskIndex])
            } else {
                this.lists[this.listId].tasks[this.taskElementId].addToMyDay = true
                this.smartList.myDay.tasks.push(this.lists[this.listId].tasks[this.taskElementId])
            }
            localStorage.setItem("allSmartLists", JSON.stringify(this.smartList))
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            this.toggleDropDown = false
            this.addToMyDayState = true
        },
        closeToMyDay() {
            if (!!this.childId) {
                this.lists[this.listId].listsArray[this.childId].tasks[this.taskIndex].addToMyDay = false
                this.smartList.myDay.tasks.push(this.lists[this.listId].listsArray[this.childId].tasks[this.taskIndex])
            } else {
                this.lists[this.listId].tasks[this.taskElementId].addToMyDay = false
                this.smartList.myDay.tasks.push(this.lists[this.listId].tasks[this.taskElementId])
            }
            localStorage.setItem("allSmartLists", JSON.stringify(this.smartList))
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            this.toggleDropDown = false
            this.addToMyDayState = false
        }
    }
}
</script>