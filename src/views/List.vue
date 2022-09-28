<template>
    <content-view :chosenListId="listId">
        <template v-slot:title>
            {{listName}}
        </template>

        <template v-slot:allTask>
            <li v-for="task in allTask" :key="task.id" :data-id="task.id">{{task.name}}</li>
        </template>
    </content-view>
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
    methods: {
        // getList() {
        //     this.allList = JSON.parse(localStorage.getItem("allListAndTasks")) || []

        //     this.chosenList = this.allList[this.listId]

        //     console.log(this.chosenList);
        // }
    }
}
</script>