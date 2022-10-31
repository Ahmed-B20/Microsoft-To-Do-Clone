<template>
    <div class="aside-link">
        <router-link to="/my-day">
            <img src="@/assets/design-material/icons/sun.png" alt="my day tab" />
            <span>MyDay</span>

            <span class="tasks-count" v-if="smartList.myDay.tasks.length > 0">
                {{ smartList.myDay.tasks.length }}
            </span>
        </router-link>
        <router-link to="/important">
            <img src="@/assets/design-material/icons/star.png" alt="important tab" />
            <span>Important</span>

            <span class="tasks-count" v-if="smartList.important.tasks.length > 0">
                {{ smartList.important.tasks.length }}
            </span>
        </router-link>

        <router-link to="/complete">
            <img src="@/assets/design-material/icons/complete.png" alt="completed tasks tab" />
            <span>Complete</span>

            <span class="tasks-count" v-if="smartList.complete.tasks.length > 0">
                {{ smartList.complete.tasks.length }}
            </span>
        </router-link>

        <router-link to="/all">
            <img src="@/assets/design-material/icons/infinity.png" alt="all tasks tab" />
            <span>All</span>

            <span class="tasks-count" v-if="smartList.all.tasks.length > 0">
                {{ smartList.all.tasks.length }}
            </span>
        </router-link>

        <router-link to="/planned">
            <img src="@/assets/design-material/icons/plan.png" alt="planned tab" />
            <span>Planned</span>

            <span class="tasks-count" v-if="smartList.planned.tasks.length > 0">
                {{ smartList.planned.tasks.length }}
            </span>
        </router-link>
        <router-link to="/tasks">
            <img src="@/assets/design-material/icons/task.png" alt="tasks tab" />
            <span>Tasks</span>

            <span class="tasks-count" v-if="smartList.tasks.tasks.length > 0">
                {{ smartList.tasks.tasks.length }}
            </span>
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