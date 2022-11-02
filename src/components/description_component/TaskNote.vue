<template>
    <div class="task-box task-notes">
        <h3>Task Description</h3>

        <textarea placeholder="Add Task Description" v-model="textValue"></textarea>


        <div class="note-controller">
            <button @click="addNote">add note</button>
            <div class="date">
                {{ taskNoteDate }}
            </div>
        </div>
    </div>
</template>

<script>
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'TaskNote',
    props: ['descriptionTaskList', 'descriptionTaskChildList', 'descriptionTaskIndex', 'task'],
    data() {
        return {
            textValue: ''
        }
    },
    beforeMount() {
        if (this.task.note.length > 0) {
            return this.textValue = this.task.note
        } else {
            return this.textValue = ''
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists', 'smartList']),
        ...mapWritableState(allLists, ['lists', 'smartList']),

        taskNoteDate() {
            if (this.task.noteModified && this.task.note.length > 0) {
                return `Modified At ${new Date(this.task.modifiedDate).toDateString()}`
            } else {
                if (this.task.noteDate && this.task.note.length > 0) {
                    return `Added At ${new Date(this.task.noteDate).toDateString()}`
                }
            }
        }
    },
    methods: {
        addNote() {
            if (!!this.descriptionTaskChildList) {
                if (this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].note) {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].noteModified = true
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].modifiedDate = new Date()
                } else {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].noteModified = false
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].modifiedDate = null
                }
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].note = this.textValue
                this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].tasks[this.descriptionTaskIndex].noteDate = new Date()
            } else {
                if (this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].note) {
                    this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].noteModified = true
                    this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].modifiedDate = new Date()
                } else {
                    this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].noteModified = false
                    this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].modifiedDate = null
                }
                this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].note = this.textValue
                this.lists[this.descriptionTaskList].tasks[this.descriptionTaskIndex].noteDate = new Date()
            }

            if (this.chosenSmartList) {
                if (this.smartList[this.chosenSmartList].tasks[this.smartListTaskId].note) {
                    this.smartList[this.chosenSmartList].tasks[this.smartListTaskId].noteModified = true
                    this.smartList[this.chosenSmartList].tasks[this.smartListTaskId].modifiedDate = new Date()
                } else {
                    this.smartList[this.chosenSmartList].tasks[this.smartListTaskId].noteModified = false
                    this.smartList[this.chosenSmartList].tasks[this.smartListTaskId].modifiedDate = null
                }
                this.smartList[this.chosenSmartList].tasks[this.smartListTaskId].note = this.textValue
                this.smartList[this.chosenSmartList].tasks[this.smartListTaskId].noteDate = new Date()
            }

            localStorage.setItem("allSmartLists", JSON.stringify(this.smartList))
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
        }
    }
}
</script>

