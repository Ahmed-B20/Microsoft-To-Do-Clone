<template>
    <transition-group name="tasks-transition">
        <li ref="taskElement" @contextmenu="openDropDown(task, index)" @click.self="openDescription(task, index)"
            :class="{complete: task.complete, delete: new Date() > new Date(new Date(task.dueTime).setDate(new Date(task.dueTime).getDate() + 1)) && !task.complete, remind: new Date() > new Date(task.remindMeDate) && !task.complete}"
            v-for="(task,index) in returnAllTasks" :key="task.id">

            <Complete :listId='listId' :childId='childId' :taskElementId='taskElementId' :task="task" :index="index"
                @componentEvent='resetChildComponent' />

            <span @click="openDescription(task, index)" class="task-main-info">
                <span class="task-name" :class="{ complete: task.complete }">
                    {{ task.name }}
                </span>

                <TaskInfoIcons :index='index' :task='task' :listId="listId" />
            </span>

            <Important :listId='listId' :childId='childId' :taskElementId='taskElementId' :task="task" :index="index"
                @componentEvent='resetChildComponent' />
        </li>
    </transition-group>

    <transition name="to-bottom">
        <DropDown :dropDownSlots="dropDownSlots" :top="top" :left="left" v-if="toggleDropDown">
            <template #RenameTask>
                <RenameTask :selectTask="selectTask" :listId='listId' :childId='childId' :taskElementId='taskElementId'
                    @componentEvent='closeDropDown' />
            </template>

            <template #MarkAsImportant>
                <MarkAsImportant :selectTask="selectTask" :taskElements="this.$refs.taskElement" :listId='listId'
                    :childId='childId' :taskElementId='taskElementId' @componentEvent='resetChildComponent' />
            </template>

            <template #MarkAsComplete>
                <MarkAsComplete :selectTask="selectTask" :taskElements="this.$refs.taskElement" :listId='listId'
                    :childId='childId' :taskElementId='taskElementId' @componentEvent='resetChildComponent' />
            </template>

            <template v-if="dueDateState" #AddToMyDay>
                <AddToMyDay :selectTask="selectTask" :listId='listId' :childId='childId' :taskElementId='taskElementId'
                    @componentEvent='resetChildComponent' />
            </template>

            <template v-if="dueDateState" #DueToday>
                <DueDate :selectTask="selectTask" date="today" :listId='listId' :childId='childId'
                    :taskElementId='taskElementId' @componentEvent='closeDropDown' />
            </template>

            <template v-if="dueDateState" #DueTomorrow>
                <DueDate :selectTask="selectTask" date="tomorrow" :listId='listId' :childId='childId'
                    :taskElementId='taskElementId' @componentEvent='closeDropDown' />
            </template>

            <template v-if="dueDateState" #DueNextWeek>
                <DueDate :selectTask="selectTask" date="nextWeek" :listId='listId' :childId='childId'
                    :taskElementId='taskElementId' @componentEvent='closeDropDown' />
            </template>

            <template #PickADate>
                <DueDate :selectTask="selectTask" date="customDate" :listId='listId' :childId='childId'
                    :taskElementId='taskElementId' @componentEvent='closeDropDown' />
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
import TaskInfoIcons from './task/TaskInfoIcons.vue';

import Important from './task/element/Important.vue'
import Complete from './task/element/Complete.vue'

import RenameTask from './task/drop down/RenameTask.vue';
import MarkAsImportant from './task/drop down/MarkAsImportant.vue';
import MarkAsComplete from './task/drop down/MarkAsComplete.vue';
import AddToMyDay from './task/drop down/AddToMyDay.vue';
import DueDate from './task/drop down/DueDate.vue';

export default {
    name: 'SingleTask',
    props: ['listId', 'toggleShrink', 'childId', 'chosenSmartList'],
    emits: ['openDescriptionEvent'],
    components: {
        PopUp,
        DropDown,
        TaskInfoIcons,
        RenameTask,
        MarkAsImportant,
        MarkAsComplete,
        AddToMyDay,
        DueDate,
        Important,
        Complete
    },
    beforeMount() {
        this.lists.forEach((list, index) => {
            if (list.listChildren === false) {
                console.log(this.listId);
                if (index != this.listId && +index !== 0 && +index !== 1 && +index !== 2 && +index !== 3 && +index !== 4 && +this.selectTask.listId !== +list.id) {
                    this.ReturnAllListsArray.push(list)
                }
            }
        })

        if (+this.listId === 1 || +this.listId === 2 || +this.listId === 3) {
            this.dropDownSlots = ['RenameTask', 'MarkAsImportant', 'MarkAsComplete', 'DeleteTask']
        } else if (+this.listId === 0) {
            this.dropDownSlots = ['RenameTask', 'MarkAsImportant', 'MarkAsComplete', 'AddToMyDay', 'DeleteTask']
        } else {
            this.dropDownSlots = ['RenameTask', 'MarkAsImportant', 'MarkAsComplete', 'AddToMyDay', 'DueToday', 'DueTomorrow', 'DueNextWeek', 'PickADate', 'MoveTaskTo', 'DeleteTask']
        }
    },

    data() {
        return {
            importantTask: {},
            shrink: this.toggleShrink,
            taskElement: '',
            oldTaskId: 0,
            dropDownSlots: ['RenameTask', 'MarkAsImportant', 'MarkAsComplete', 'AddToMyDay', 'DueToday', 'DueTomorrow', 'DueNextWeek', 'PickADate', 'MoveTaskTo', 'DeleteTask'],
            toggleDropDown: false,
            showPopUp: false,
            taskElementId: null,
            parentElementDomRect: '',
            ReturnAllListsArray: [],
            taskName: '',
            oldTaskId: null,
            oldTaskIdDrop: null,
            addToMyDayState: false,
            remindToggle: false,
            moveTaskToggle: false,
            selectTask: {},
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
            if (+this.listId !== 0 && +this.listId !== 1 && +this.listId !== 2 && +this.listId !== 3) {
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
            } else {
                return true
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
                        if (index != this.listId && +index !== 0 && +index !== 1 && +index !== 2 && +index !== 3 && +index !== 4 && +this.selectTask.listId !== +list.id) {
                            this.ReturnAllListsArray.push(list)
                        }
                    }
                })
            },
            deep: true
        }
    },
    methods: {
        openDropDown(task, index) {
            event.preventDefault()
            this.$emit('openDescriptionEvent', this.listId, index, false, this.taskElement)

            this.ReturnAllListsArray = []
            this.lists.forEach((list, index) => {
                if (list.listChildren === false) {
                    if (index != this.listId && +index !== 0 && +index !== 1 && +index !== 2 && +index !== 3 && +index !== 4 && +task.listId !== +list.id) {
                        this.ReturnAllListsArray.push(list)
                    }
                }
            })

            this.selectTask = task

            this.taskElementId = index
            if (event.target.tagName === 'IMG' || (event.target.tagName === 'SPAN' && event.target.classList.contains('task-main-info') || event.target.classList.contains('check'))) {
                this.parentElementDomRect = event.target.parentElement.getBoundingClientRect()
            } else if (event.target.tagName === 'LI') {
                this.parentElementDomRect = event.target.getBoundingClientRect()
            } else {
                this.parentElementDomRect = event.target.parentElement.parentElement.getBoundingClientRect()
            }
            let x = this.$refs.taskElement[this.taskElementId].getBoundingClientRect()
            if (this.parentElementDomRect.top > 350) {
                this.top = this.parentElementDomRect.top - 300
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
                this.oldTaskIdDrop = index
            } else {
                if (+this.oldTaskIdDrop != +this.taskElementId) {
                    this.toggleDropDown = false
                    this.oldTaskIdDrop = index
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
            this.showPopUp = false
            this.toggleDropDown = false
            this.moveTaskToggle = false
            this.target = ''
        },
        openDescription(task, index) {
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
                this.oldTaskId = index
                this.$emit('openDescriptionEvent', this.listId, index, this.shrink, this.taskElement)
            } else {
                if (this.oldTaskId != index) {
                    this.oldTaskId = index
                    this.$emit('openDescriptionEvent', this.listId, index, this.shrink, this.taskElement)
                } else {
                    this.shrink = !this.toggleShrink
                    this.$emit('openDescriptionEvent', this.listId, index, this.shrink, this.taskElement)
                }
            }
        },
        deleteTask() {
            if (!!this.selectTask.childId) {
                this.lists[this.selectTask.listId].listsArray[this.selectTask.childId].tasks.forEach((task, index) => {
                    if (+task.id === this.selectTask.id) {
                        this.lists[this.selectTask.listId].listsArray[this.selectTask.childId].tasks.splice(this.taskElementId, 1)
                    }
                })
                this.lists[this.selectTask.listId].listsArray[this.selectTask.childId].tasks.forEach((list) => {
                    if (list.id >= this.taskElementId) {
                        list.id = list.id - 1
                    }
                })
            } else {
                this.lists[this.selectTask.listId].tasks.forEach((task, index) => {
                    if (+task.id === this.selectTask.id) {
                        this.lists[this.selectTask.listId].tasks.splice(index, 1)
                    }
                })
                this.lists[this.selectTask.listId].tasks.forEach((list) => {
                    if (list.id >= this.taskElementId) {
                        list.id = list.id - 1
                    }
                })
            }


            if (this.selectTask.addToMyDay || !!this.selectTask.dueDateName) {
                if (this.selectTask.addToMyDay && !!this.selectTask.dueDateName) {
                    this.lists[0].tasks.forEach((task, index) => {
                        if (+task.id === +this.selectTask.id && +task.listId === +this.selectTask.listId || +task.listId === +this.selectTask.childId) {
                            this.lists[2].tasks.splice(index, 1)
                            this.lists[0].tasks.splice(index, 1)
                        }
                    })
                } else {
                    if (this.selectTask.addToMyDay) {
                        this.lists[0].tasks.forEach((task, index) => {
                            if (+task.id === +this.selectTask.id && +task.listId === +this.selectTask.listId || +task.listId === +this.selectTask.childId) {
                                this.lists[0].tasks.splice(index, 1)
                            }
                        })
                    } else {
                        this.lists[0].tasks.forEach((task, index) => {
                            if (+task.id === +this.selectTask.id && +task.listId === +this.selectTask.listId || +task.listId === +this.selectTask.childId) {
                                this.lists[2].tasks.splice(index, 1)
                            }
                        })
                    }
                }
            }

            if (+this.listId === 4) {
                this.lists[4].tasks.splice(this.taskElementId, 1)
            }

            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            this.toggleDropDown = false
            this.taskElementId = null
            this.parentElementDomRect = null
            this.showPopUp = !this.showPopUp
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

                this.lists[this.listId].listsArray[this.childId].tasks.forEach((list) => {
                    if (list.id >= this.taskElementId) {
                        list.id = list.id - 1
                    }
                })
            } else {
                this.lists[this.$refs.selectedLists.value].tasks.push(this.lists[this.listId].tasks[this.taskElementId])
                if (+this.lists[this.$refs.selectedLists.value].tasks.length > 0) {
                    let index = this.lists[this.$refs.selectedLists.value].tasks.length - 1
                    this.lists[this.$refs.selectedLists.value].tasks[index].id = this.lists[this.$refs.selectedLists.value].tasks.length - 1
                } else {
                    this.lists[this.$refs.selectedLists.value].tasks[0].id = 0
                }
                this.lists[this.listId].tasks.splice(this.taskElementId, 1)

                this.lists[this.listId].tasks.forEach((list) => {
                    if (list.id >= this.taskElementId) {
                        list.id = list.id - 1
                    }
                })
            }
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            this.toggleDropDown = false
            this.taskElementId = null
            this.parentElementDomRect = null
            this.showPopUp = !this.showPopUp
            this.moveTaskToggle = !this.moveTaskToggle
        },
        resetChildComponent() {
            this.toggleDropDown = false
            this.taskElementId = null
            this.parentElementDomRect = null
            this.addToMyDayState = false
        }
    }
}
</script>