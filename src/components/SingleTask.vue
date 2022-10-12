<template>
    <transition-group name="tasks-transition">
        <li ref="taskElement" @contextmenu="openDropDown" @click.self="openDescription"
            :class="{complete: task.complete}" v-for="(task,index) in returnAllTasks" :key="task.id" :data-id="index">
            <span :data-id="index" @click="completeTask('task')" class="check">
                <img :data-id="index" src="@/assets/design-material/icons/check.png" alt="check" />
            </span>

            <span :data-id="index" class="task-main-info">
                <span :data-id="index" class="task-name" :class="{complete: task.complete}">
                    {{task.name}}
                </span>

                <span :data-id="index" class="info-icons">
                    <span :data-id="index" v-if="task.steps.length > 0" class="steps">
                        {{(task.steps.filter((step)=>{return step.complete === true}).length)}} Of {{task.steps.length}}

                        <img :data-id="index" src="@/assets/design-material/icons/process.png" alt="task steps"
                            title="task steps">
                    </span>

                    <span :data-id="index" class="border" v-if="task.steps.length > 0 && task.note"></span>

                    <span :data-id="index" class="note" v-if="task.note">
                        Note <img :data-id="index" src="@/assets/design-material/icons/notes.png" alt="task notes"
                            title="task notes">
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
                <div class="renameList" @click.self="renameList">
                    <template v-if="showRename">
                        <img @click="newListName" class="renameTask" :class="{ active: itemDetect }"
                            src="@/assets/design-material/icons/plus.png" alt="add-item" />
                        <input @keyup.enter="newListName" required @focus="toggleErrorClass" v-model="newName"
                            placeholder="New Name" type="text" name="" id="" :class="{error:toggleError}" />
                        <img @click="closeRename" src="@/assets/design-material/icons/close.png" alt="close rename" />
                    </template>

                    <template v-else>
                        <img @click="renameList" src="@/assets/design-material/icons/rename.png" alt="rename task" />
                        <span @click="renameList">Rename List</span>
                    </template>
                </div>
            </template>

            <template #MarkAsImportant>
                <div @click="importantToggle('dropdown')">
                    <img v-if="returnImportantState" src="@/assets/design-material/icons/important-task.png"
                        alt="important task">

                    <img v-else src="@/assets/design-material/icons/important-hover.png" alt="not important task">

                    <span>{{returnImportantState? 'Remove Importance':'Mark As Important'}}</span>
                </div>
            </template>

            <template #MarkAsComplete>
                <div @click="completeTask('dropdown')">
                    <img v-if="returnCompleteState" src="@/assets/design-material/icons/complete.png"
                        alt="complete task">

                    <img v-else src="@/assets/design-material/icons/dry-clean.png" alt="not complete task">

                    <span>{{returnCompleteState? 'Mark As Not Complete':'Mark As Complete'}}</span>
                </div>
            </template>

            <template #AddToMyDay>
                <div @click="DuplicateList">
                    <img src="@/assets/design-material/icons/copy.png" alt="">
                    <span>Duplicate list</span>
                </div>
            </template>

            <template #DueToday>
                <div @click="DuplicateList">
                    <img src="@/assets/design-material/icons/copy.png" alt="">
                    <span>Duplicate list</span>
                </div>
            </template>

            <template #DueTomorrow>
                <div @click="DuplicateList">
                    <img src="@/assets/design-material/icons/copy.png" alt="">
                    <span>Duplicate list</span>
                </div>
            </template>

            <template #PickADate>
                <div @click="DuplicateList">
                    <img src="@/assets/design-material/icons/copy.png" alt="">
                    <span>Duplicate list</span>
                </div>
            </template>

            <template #MoveTaskTo v-if="ReturnGroupOfLists">
                <div @click="togglePopUp('move')">
                    <img src="@/assets/design-material/icons/curve-arrow.png" alt="">
                    <span>Move list to...</span>
                </div>
            </template>

            <template #DeleteTask>
                <div @click="togglePopUp('delete')">
                    <img src="@/assets/design-material/icons/delete.png" alt="">
                    <span>Delete Task</span>
                </div>
            </template>
        </DropDown>
    </transition>

    <PopUp :showPopUp="showPopUp">
        <template #title>
            {{target=== 'move'? 'Move Task': 'Delete Task'}}
        </template>

        <template v-slot:content>
            <div v-if="moveTaskToggle" class="select-parent">
                <select ref="selectedGroupOfList" name="" id="">
                    <option v-for="(groupOfList, index) in ReturnGroupOfListsArray" :key="index"
                        :value="groupOfList.id">
                        {{groupOfList.listName}}
                    </option>
                </select>
            </div>
            <p v-else>
                Task {{listName}} will be permanently deleted
            </p>
        </template>

        <template #button>
            <button v-if="moveTaskToggle" class="move" @click="MoveListTo">Move</button>
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
    props: ['listId', 'toggleShrink', 'childId'],
    components: {
        PopUp,
        DropDown
    },
    computed: {
        ...mapState(allLists, ['returnLists']),
        ...mapWritableState(allLists, ['lists']),
        returnAllTasks() {
            if (!!this.childId) {
                if (this.returnLists[this.listId].listsArray[this.childId].tasks.length > 0) {
                    return this.returnLists[this.listId].listsArray[this.childId].tasks
                }
            } else {
                if (this.returnLists[this.listId].tasks.length > 0) {
                    return this.returnLists[this.listId].tasks
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
        }
    },
    data() {
        return {
            importantTask: {},
            shrink: this.toggleShrink,
            taskElement: '',
            oldTaskId: 0,
            stepsCount: 0,
            dropDownSlots: ['RenameTask', 'MarkAsImportant', 'MarkAsComplete', 'AddToMyDay', 'DueToday', 'DueTomorrow', 'PickADate', 'MoveTaskTo', 'DeleteTask'],
            toggleDropDown: false,
            showPopUp: false,
            taskElementId: null,
            parentElementDomRect: ''
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
        }
    },
    methods: {
        openDropDown() {
            event.preventDefault()
            this.taskElementId = event.target.getAttribute('data-id')
            // this.parentElementDomRect = this.$refs.taskElement[this.taskElementId].getBoundingClientRect()
            if (event.target.tagName === 'IMG' || (event.target.tagName === 'SPAN' && event.target.classList.contains('task-main-info') || event.target.classList.contains('check'))) {
                this.parentElementDomRect = event.target.parentElement.getBoundingClientRect()
            } else if (event.target.tagName === 'LI') {
                this.parentElementDomRect = event.target.getBoundingClientRect()
            } else {
                this.parentElementDomRect = event.target.parentElement.parentElement.getBoundingClientRect()
            }
            let x = this.$refs.taskElement[this.taskElementId].getBoundingClientRect()
            this.top = this.parentElementDomRect.top + 60
            this.left = (x.width / 2) - 100
            this.toggleDropDown = !this.toggleDropDown
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
            } else {
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
                this.$emit('openDescriptionEvent', this.listId, event.target.getAttribute('data-id'), this.shrink, this.taskElement)
            } else {
                this.shrink = !this.toggleShrink
                this.$emit('openDescriptionEvent', this.listId, event.target.getAttribute('data-id'), this.shrink, this.taskElement)
            }
            // this.shrink = !this.shrink
            // this.$emit('openDescriptionEvent', this.listId, event.target.getAttribute('data-id'), this.shrink)
            // this.taskElement = event.target.getAttribute('data-id')
            // if (+this.taskElement != +this.oldtaskElement) {
            //     this.oldtaskElement = event.target.getAttribute('data-id')
            //     this.shrink = true
            //     this.$emit('openDescriptionEvent', this.listId, event.target.getAttribute('data-id'), this.shrink)
            // } else {
            //     this.shrink = false
            //     this.oldtaskElement = 0
            //     this.$emit('openDescriptionEvent', this.listId, event.target.getAttribute('data-id'), this.shrink)
            // }
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
            // this.lists[this.listId].tasks[event.target.getAttribute('data-id')]
            if (target === 'dropdown') {
                this.taskElement = this.$refs.taskElement[this.taskElementId]
                console.log('dd');
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
                    event.target.setAttribute('src', event.target.getAttribute('src').replace('important-hover', 'important-task'))
                    this.lists[this.listId].listsArray[this.childId].tasks[event.target.getAttribute('data-id')].important = true
                    this.importantTask = this.lists[this.listId].listsArray[this.childId].tasks[event.target.getAttribute('data-id')]
                    this.lists[this.listId].listsArray[this.childId].tasks.splice(event.target.getAttribute('data-id'), 1)
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
                    if (target === 'dropdown') {
                        this.$refs.taskElement.forEach((task)=>{
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
                        this.lists[this.listId].listsArray[this.childId].tasks[event.target.getAttribute('data-id') || this.taskElementId].complete = true
                    }
                } else {
                    if (target === 'dropdown') {
                        // this.taskElement = this.$refs.taskElement[this.taskElementId]
                        this.$refs.taskElement.forEach((task)=>{
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
                        this.lists[this.listId].listsArray[this.childId].tasks[event.target.parentElement.getAttribute('data-id') || this.taskElementId].complete = true
                    }
                }
            } else {
                if (event.target.tagName === 'SPAN') {
                    if (target === 'dropdown') {
                        // this.taskElement = this.$refs.taskElement[this.taskElementId]
                        this.$refs.taskElement.forEach((task)=>{
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
                        this.lists[this.listId].tasks[event.target.getAttribute('data-id') || this.taskElementId].complete = true
                    }
                } else {
                    if (target === 'dropdown') {
                        // this.taskElement = this.$refs.taskElement[this.taskElementId]
                        this.$refs.taskElement.forEach((task)=>{
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
                        this.lists[this.listId].tasks[event.target.parentElement.getAttribute('data-id') || this.taskElementId].complete = true
                    }
                }
            }
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
        }
    }
}
</script>