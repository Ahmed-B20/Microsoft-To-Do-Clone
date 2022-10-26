<template>
    <span :data-id="index" class="info-icons">
        <span :data-id="index" v-if="task.steps.length > 0" class="info-icon steps">
            <img :data-id="index" src="@/assets/design-material/icons/process.png" alt="task steps" title="task steps">
            {{ (task.steps.filter((step) => { return step.complete === true }).length) }} Of {{
                    task.steps.length
            }}
        </span>

        <span :data-id="index" class="info-icon note" v-if="task.note">
            <img :data-id="index" src="@/assets/design-material/icons/notes.png" alt="task notes"
                title="task notes">Note
        </span>

        <span
            :class="{ delete: new Date() > new Date(new Date(task.dueTime).setDate(new Date(task.dueTime).getDate() + 1)) && !task.complete }"
            :data-id="index" class="info-icon note" v-if="task.dueDateName">
            <img :data-id="index" src="@/assets/design-material/icons/due-date.png" :alt="task.dueDateName"
                title="task notes">
            {{ task.dueDateName }}
        </span>

        <span :data-id="index" class="info-icon add-task-container note" v-if="task.addToMyDay">
            <img :data-id="index" src="@/assets/design-material/icons/my-day.png" :alt="task.addToMyDay"
                title="task notes">
            My Day
        </span>

        <span :data-id="index" class="info-icon note" v-if="!!task.repeatDueDateName">
            <img :data-id="index" src="@/assets/design-material/icons/repeat.png" :alt="task.repeatDueDateName"
                title="task notes">
            {{ task.repeatDueDateName }}
        </span>

        <span :data-id="index" class="info-icon note" v-if="!!task.remindMe">
            <img :data-id="index" src="@/assets/design-material/icons/reminder.png" :alt="task.remindMe"
                title="task notes">
            {{ task.remindMe }}
        </span>
    </span>
</template>

<script>
export default {
    name: 'TaskInfoIcons',
    props: ['index', 'task']
}
</script>