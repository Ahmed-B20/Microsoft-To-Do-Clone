<template>
    <keep-alive>
        <content-view :class="[toggleShrink? 'shrink': 'grow']" :key="listId">
            <template v-slot:title>
                {{listName}}
            </template>

            <template #allTaskSlot>
                <SingleTask :toggleShrink="toggleShrink" @openDescriptionEvent="openDescription" :listId="listId" />
            </template>
        </content-view>
    </keep-alive>

    <transition name="to-left">
        <TaskDescription @closeDescription="closeDescriptionMethod" :descriptionTaskList="descriptionTaskList"
            :descriptionTaskIndex="descriptionTaskIndex" v-if="toggleShrink" />
    </transition>
</template>

<script>
import ContentView from '../components/ContentView.vue';
import SingleTask from '../components/SingleTask.vue';
import TaskDescription from '../components/TaskDescription.vue'


import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'List',
    props: ['listId'],
    components: {
        ContentView,
        SingleTask,
        TaskDescription
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
            allTask: [],
            toggleOpenDescription: false,
            descriptionTaskList: 0,
            descriptionTaskIndex: 0,
            toggleShrink: false
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
        },
        openDescription(listId, index, shrink) {
            this.descriptionTaskList = listId
            this.descriptionTaskIndex = index
            // this.toggleOpenDescription = !this.toggleOpenDescription
            this.toggleShrink = shrink
            console.log('fff');

            console.log(this.toggleShrink);
        },
        closeDescriptionMethod(value) {
            this.toggleShrink = value
        }
    }
}
</script>