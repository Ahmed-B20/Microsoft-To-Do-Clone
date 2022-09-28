<template>
    <keep-alive>
        <content-view :key="listId">
            <template v-slot:title>
                {{listName}}
            </template>

            <template #allTaskSlot>
                <SingleTask :listId="listId" />
            </template>
        </content-view>
    </keep-alive>
</template>

<script>
import ContentView from '../components/ContentView.vue';
import SingleTask from '../components/SingleTask.vue';

import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'List',
    props: ['listId'],
    components: {
        ContentView,
        SingleTask
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
        ...mapWritableState(allLists, ['lists']),
    },
    watch: {
        // allTask() {
        //     console.log(this.allTask);
        // }
    },
    methods: {
        completeTask() {
            console.log('j');
            this.lists[this.listId].tasks[event.target.getAttribute('data-id')].complete = true
        }
    }
}
</script>