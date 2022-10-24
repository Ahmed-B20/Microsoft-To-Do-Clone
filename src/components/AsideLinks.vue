<template>
    <div class="aside-link">
        <router-link to="/my-day">
            <img src="@/assets/design-material/icons/sun.png" alt="my day tab" />
            <span>MyDay</span>

            <span class="tasks-count" v-if="smartList.myDay.tasks.length > 0">
                {{smartList.myDay.tasks.length}}
            </span>
        </router-link>
        <router-link to="/important">
            <img src="@/assets/design-material/icons/star.png" alt="important tab" />
            <span>Important</span>
        </router-link>
        <router-link to="/planned">
            <img src="@/assets/design-material/icons/plan.png" alt="planned tab" />
            <span>Planned</span>
        </router-link>
        <router-link to="/tasks">
            <img src="@/assets/design-material/icons/task.png" alt="completed tasks tab" />
            <span>Tasks</span>
        </router-link>
    </div>
</template>

<script>
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'AsideLinks',
    data() {
        return {
        }
    },
    computed: {
        ...mapState(allLists, ['smartList']),
    },
}
</script>