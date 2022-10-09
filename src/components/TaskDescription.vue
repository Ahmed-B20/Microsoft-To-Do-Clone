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
                        <ul>
                            <transition-group name="show-steps">
                                <li v-for="(step,index) in task.steps" :key="step.id"
                                    :class="{complete: step.complete}">
                                    <span :data-id="index" @click="completeStep" class="check">
                                        <img src="@/assets/design-material/icons/check.png" alt="check" />
                                    </span>
                                    <span class="task-name" :class="{complete: step.complete}">
                                        {{step.name}}
                                    </span>

                                    <img :data-id="index" class="important-toggle"
                                        src="@/assets/design-material/icons/more.png" alt="">
                                </li>
                            </transition-group>
                        </ul>
                    </div>


                    <div class="add-steps" :class="{error:errorToggle}">
                        <img :class="{active:activeToggle}" @click="addStep"
                            src="@/assets/design-material/icons/plus.png" alt="add-steps" />

                        <input v-model="inputValue" @keyup.enter="addStep" required placeholder="Add New step"
                            type="text" />
                    </div>
                </div>
            </div>

            <div class="task-box add-to-my-day">
                <img src="@/assets/design-material/icons/sun.png" alt="my day tab" />
                <span>MyDay</span>
            </div>

            <div class="task-box time-and-date">
                <div><img src="@/assets/design-material/icons/alarm-clock.png" alt="remind me" />
                    <span>Remind Me</span>
                </div>
                <div><img src="@/assets/design-material/icons/calendar.png" alt="add due date" />
                    <span>Add Due Date</span>
                </div>
                <div><img src="@/assets/design-material/icons/event.png" alt="repeat" />
                    <span>Repeat</span>
                </div>
            </div>

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
            Delete Task
        </template>

        <template #content>
            task {{task.name}} will be permanently deleted.
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


export default {
    name: 'DescriptionTask',
    props: ['descriptionTaskChildList', 'descriptionTaskList', 'descriptionTaskIndex', 'element'],
    beforeMount() {
        if (!!this.descriptionTaskChildList) {

            console.log(this.descriptionTaskChildList);

            console.log(this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList]);

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
        PopUp
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
            showPopUp: false
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
        addNote() {
            this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].note = this.textValue
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
        },
        emptyTextValue() {
            this.textValue = ''
        },
        togglePopup() {
            this.showPopUp = !this.showPopUp
        },
        deleteTask() {
            this.lists[this.descriptionTaskList].tasks.splice(this.descriptionTaskIndex, 1)

            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))

            this.$emit('closeDescription', false)
            this.showPopUp = !this.showPopUp
        },
        closeDescription() {
            this.element.classList.remove('add-animation-x')
            this.$emit('closeDescription', false)
        },
        importantAsideToggle() {
            // this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex]

            console.log(this.element);

            this.element.classList.remove('add-animation-x')
            this.element.classList.remove('add-animation')

            console.log(this.element);


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



        },
        completeAsideTask() {
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

            if (this.element.classList.contains('add-animation-x')) {
                this.element.classList.remove('add-animation-x')
                setTimeout(() => {
                    this.element.classList.add('add-animation-x')
                }, 0)
                console.log('one');
            } else {
                this.element.classList.remove('add-animation-x')
                setTimeout(() => {
                    this.element.classList.add('add-animation-x')
                }, 0)
                console.log('one1');
            }
        },

        completeStep() {


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

                this.stepId = this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].steps.length

                this.stepObj.id = this.stepId
                this.stepObj.name = this.inputValue
                this.stepObj.complete = false


                this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].steps.push(this.stepObj)



                this.completeTaskStatus = !this.completeTaskStatus

                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                this.stepId++
                this.stepObj = {}
                this.inputValue = ''
            } else {
                this.errorToggle = true
            }
        }
    }
}
</script>