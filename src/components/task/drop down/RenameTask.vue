<template>
    <div class="renameList" @click.self="renameTask">
        <template v-if="showRename">
            <!-- <img @click="newTaskName" class="renameTask" :class="{ active: itemDetect }"
                            src="@/assets/design-material/icons/plus.png" alt="add-item" /> -->

            <img @click="newTaskName" class="renameTask" src="@/assets/design-material/icons/plus.png" alt="add-item" />
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

<script>
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'RenameTask',
    props: ['listId', 'childId', 'taskElementId'],
    data() {
        return {
            showRename: false,
            newName: '',
            taskName: '',
            toggleError: false,
        }
    },
    beforeMount() {
        if (!!this.childId) {
            this.taskName = this.lists[this.listId].listsArray[this.childId].tasks[this.taskElementId].name
        } else {
            this.taskName = this.lists[this.listId].tasks[this.taskElementId].name
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists', 'smartList']),
        ...mapWritableState(allLists, ['lists', 'smartList']),
    },
    methods: {
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

                this.$emit('componentEvent')
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
    }
}
</script>