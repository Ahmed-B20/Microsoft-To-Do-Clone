<template>
    <div class="task-description">

        <div class="close-container">
            <img src="@/assets/design-material/icons/close.png" alt="" class="close-description">
        </div>

        <div class="task-main-content">
            <div class="task-box task-info-and-steps">
                <h2>
                    <span :data-id="index" @click="completeTask" class="check">
                        <img src="@/assets/design-material/icons/check.png" alt="check" />
                    </span>
                    <span class="task-name" :class="{complete: task.complete}">
                        {{task.name}}
                    </span>

                    <img v-if="task.important" :data-id="index" @click="importantToggle" class="important-toggle"
                        src="@/assets/design-material/icons/important-task.png" alt="">

                    <img v-else :data-id="index" @click="importantToggle" class="important-toggle"
                        src="@/assets/design-material/icons/important-hover.png" alt="">
                </h2>

                <div class="task-steps-container">
                    <ul>
                        <li><span :data-id="index" @click="completeTask" class="check">
                                <img src="@/assets/design-material/icons/check.png" alt="check" />
                            </span>
                            <span class="task-name" :class="{complete: task.complete}">
                                {{task.name}}
                            </span>

                            <img :data-id="index" @click="importantToggle" class="important-toggle"
                                src="@/assets/design-material/icons/more.png" alt="">
                        </li>

                        <li><span :data-id="index" @click="completeTask" class="check">
                                <img src="@/assets/design-material/icons/check.png" alt="check" />
                            </span>
                            <span class="task-name" :class="{complete: task.complete}">
                                {{task.name}}
                            </span>

                            <img :data-id="index" @click="importantToggle" class="important-toggle"
                                src="@/assets/design-material/icons/more.png" alt="">
                        </li>
                    </ul>


                    <div class="add-steps">
                        <img src="@/assets/design-material/icons/plus.png" alt="add-steps" />

                        <input required placeholder="Add New step" type="text" name="" id="" />
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
                <textarea>Add Task Description</textarea>

                <div class="date">
                    12/6/520
                </div>
            </div>
        </div>

        <div class="task-time-and-delete">
            <div class="time">Created on {{task.addTime}}</div>

            <span class="delete">
                <img @click="deleteTask" src="@/assets/design-material/icons/delete.png" alt="">
            </span>
        </div>
    </div>
</template>

<script>
import { allLists } from '@/stores/allLists.js'

import { mapState, mapWritableState } from 'pinia'


export default {
    name: 'DescriptionTask',
    props: ['descriptionTaskList', 'descriptionTaskIndex'],
    beforeMount() {
        this.task = this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex]
    },
    data() {
        return {
            task: {}
        }
    },
    computed: {
        ...mapWritableState(allLists, ['lists']),
    },
    methods: {
        deleteTask() {
            console.log(this.descriptionTaskList);
            console.log(this.descriptionTaskIndex);

            this.lists[this.descriptionTaskList].tasks.splice(this.descriptionTaskIndex, 1)

            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))

            this.$emit('closeDescription', false)
        }
    }
}
</script>