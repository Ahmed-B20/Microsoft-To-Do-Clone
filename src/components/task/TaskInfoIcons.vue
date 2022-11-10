<template>
    <span class="info-icons">
        <span v-if="task.steps.length > 0" class="info-icon steps">
            <img src="@/assets/design-material/icons/process.png" alt="task steps" title="task steps">
            {{ (task.steps.filter((step) => { return step.complete === true }).length) }} Of {{
                    task.steps.length
            }}
        </span>

        <span class="info-icon note" v-if="task.note">
            <img src="@/assets/design-material/icons/notes.png" alt="task notes" title="task notes">Note
        </span>

        <span
            :class="{ delete: new Date() > new Date(new Date(task.dueTime).setDate(new Date(task.dueTime).getDate() + 1)) && !task.complete }"
            class="info-icon note" v-if="task.dueDateName">
            <img src="@/assets/design-material/icons/due-date.png" :alt="task.dueDateName" title="task notes">
            {{ task.dueDateName }}
        </span>

        <span class="info-icon add-task-container note" v-if="task.addToMyDay">
            <img src="@/assets/design-material/icons/my-day.png" :alt="task.addToMyDay" title="task notes">
            My Day
        </span>

        <span class="info-icon note" v-if="!!task.repeatDueDateName">
            <img src="@/assets/design-material/icons/repeat.png" :alt="task.repeatDueDateName" title="task notes">
            {{ task.repeatDueDateName }}
        </span>

        <span class="info-icon note" v-if="!!task.remindMe">
            <img src="@/assets/design-material/icons/reminder.png" :alt="task.remindMe" title="task notes">
            {{ task.remindMe }}
        </span>

        <span class="info-icon note" v-if="task.snooze">
            <img src="@/assets/design-material/icons/snooze.png" alt="task snooze" title="task snooze">
            Snoozed Task
        </span>

        <span class="info-icon note" v-if="+listId === 4 && task?.childListId !== undefined">
            <img src="@/assets/design-material/icons/tab.png" alt="parent list" title="parent list">
            {{lists[task.listId].listName}}
        </span>

        <span class="info-icon note" v-if="+listId === 4 && task?.childListId !== undefined">
            <img src="@/assets/design-material/icons/menu.png" alt="child list" title="child list">
            {{lists[task.listId].listsArray[task.childListId].listName}}
        </span>

        <span class="info-icon note" v-if="+listId === 4 && task?.childListId === undefined">
            <img src="@/assets/design-material/icons/menu.png" alt="list" title="list">
            {{lists[task.listId].listName}}
        </span>
    </span>
</template>

<script>
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'TaskInfoIcons',
    props: ['index', 'task', 'listId'],
    computed: {
        ...mapState(allLists, ['returnLists', 'smartList']),
        ...mapWritableState(allLists, ['lists', 'smartList']),
    }
}
</script>