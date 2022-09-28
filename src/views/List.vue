<template>
    <keep-alive>
        <content-view :key="listId">
            <template v-slot:title>
                {{listName}}
            </template>

            <template #allTaskSlot>
                <li :class="{complete: task.complete}" v-for="task in returnLists[listId].tasks" :key="task.id"
                    :data-id="task.id">
                    <span class="check">
                        <img src="@/assets/design-material/icons/check.png" alt="check" />
                    </span>
                    <span class="task-name" :class="{complete: task.complete}">
                        {{task.name}}
                    </span>
                </li>
            </template>
        </content-view>
    </keep-alive>
</template>

<script>
import ContentView from '../components/ContentView.vue';
import { allLists } from '@/stores/allLists.js'
import { mapState } from 'pinia'

export default {
    name: 'List',
    props: ['listId'],
    components: {
        ContentView
    },
    provide() {
        return {
            // explicitly provide a computed property
            chosenListId: () => this.listId
        }
    },
    beforeMount: function () {

        // this.allList = JSON.parse(localStorage.getItem("allListAndTasks")) || []
        this.allList = this.returnLists || []

        this.chosenList = this.allList[this.listId]
        this.listName = this.chosenList.listName
        this.allTask = this.chosenList.tasks;


        this.$watch(
            () => this.listId,
            (toParams, previousParams) => {
                if (toParams != previousParams) {
                    this.allList = JSON.parse(localStorage.getItem("allListAndTasks")) || []

                    this.chosenList = this.allList[this.listId]
                    this.listName = this.chosenList.listName

                    this.allTask = this.chosenList.tasks;
                }
            }
        )
    },
    data() {
        return {
            allList: [],
            chosenList: [],
            listName: '',
            allTask: []
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists']),
    },
    watch: {
        // allTask() {
        //     console.log(this.allTask);
        // }
    }
}
</script>