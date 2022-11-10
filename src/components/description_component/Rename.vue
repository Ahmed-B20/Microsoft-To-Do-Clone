<template>
    <div @click.self="renameTask" class="task-box rename-task">
        <template v-if="showRename">
            <img @click="newTaskName" class="renameTask" :class="{ active: itemDetect }"
                src="@/assets/design-material/icons/plus.png" alt="add-item" />
            <input @keypress.enter="newTaskName" required @focus="toggleErrorClass" v-model="newName"
                placeholder="New Name" type="text" name="" id="" :class="{ error: toggleError }" />
            <img @click="closeRename" src="@/assets/design-material/icons/close.png" alt="close rename" />
        </template>

        <template v-else>
            <img @click="renameTask" src="@/assets/design-material/icons/rename.png" alt="rename task" />
            <span @click="renameTask">Rename Task</span>
        </template>
    </div>
</template>

<script>
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'Rename',
    props: ['descriptionTaskList', 'descriptionTaskChildList', 'descriptionTaskIndex', 'task'],
    data() {
        return {
            showRename: false,
            newName: '',
            toggleError: false,
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists', 'smartList']),
        ...mapWritableState(allLists, ['lists', 'smartList']),

        itemDetect() {
            if (this.newName.length > 0) {
                return true;
            } else {
                return false;
            }
        }
    },
    methods: {
        renameTask() {
            this.showRename = true
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

                if (this.chosenSmartList) {
                    this.smartList[this.chosenSmartList].tasks[this.smartListTaskId].name = this.newName
                }

                localStorage.setItem("allSmartLists", JSON.stringify(this.smartList))
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
        }
    }
}
</script>