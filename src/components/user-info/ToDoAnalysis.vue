<template>
    <h2>Lists And Tasks Analysis</h2>

    <table>
        <thead>
            <tr>
                <th class="main">Category</th>
                <th>Current</th>
                <th>All</th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="(value, key) in statistics" :key="key">
                <td>{{ key === 'allList' ? 'All Lists' : key === 'allGroupOfList' ? 'All Group Of Lists' : key ===
                        'allChildList' ? 'All Child Lists' : 'All Tasks'
                }}</td>
                <td v-for="(childValue, key) in value" :key="key">{{ childValue }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import { allLists } from '@/stores/allLists.js'
import { statistics } from '@/stores/statistics.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'ToDoAnalysis',
    beforeMount() {
        this.statistics.allGroupOfList.currentGroupOfList = 0
        this.statistics.allChildList.currentChildList = 0
        this.statistics.allList.currentList = 0
        this.statistics.allTasks.currentTasks = 0

        this.lists.slice(5).forEach((list) => {

            if (list.listChildren) {
                this.statistics.allGroupOfList.currentGroupOfList++

                list.listsArray.forEach((childList) => {
                    this.statistics.allChildList.currentChildList++

                    childList.tasks.forEach(() => {
                        this.statistics.allTasks.currentTasks++
                    })
                })
            } else {
                this.statistics.allList.currentList++

                list.tasks.forEach(() => {
                    this.statistics.allTasks.currentTasks++
                })
            }
        })
        localStorage.setItem("allListAndTasksStatistics", JSON.stringify(this.statistics));
    },
    computed: {
        ...mapState(allLists, ['returnLists']),
        ...mapWritableState(allLists, ['lists']),
        ...mapWritableState(statistics, ['statistics']),
    }
}
</script>