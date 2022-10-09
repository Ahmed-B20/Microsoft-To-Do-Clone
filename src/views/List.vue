<template>
    <keep-alive>
        <content-view :class="[toggleShrink? 'shrink': 'grow']" :key="listId">
            <template #toggle-sidebar>
                <button @click="openSideBarDescription">test</button>
            </template>

            <template v-slot:title>
                {{listName}}
            </template>

            <template #toggle-description>
                <button @click="openListDescription">test</button>
            </template>


            <template #allTaskSlot>
                <!-- <SingleTask :toggleShrink="toggleShrink" @openDescriptionEvent="openDescription" :listId="listId" /> -->
                <SingleTask :toggleShrink="toggleShrink" @openDescriptionEvent="openDescription" :listId="listId"
                    :childId="childId" />
            </template>
        </content-view>
    </keep-alive>

    <transition name="to-left">
        <TaskDescription :toggleShrink="toggleShrink" @closeDescription="closeDescriptionMethod"
            :descriptionTaskList="descriptionTaskList" :descriptionTaskChildList="descriptionTaskChildList"
            :descriptionTaskIndex="descriptionTaskIndex" v-if="toggleShrink" :element="element" />
    </transition>

    <!-- <transition name="to-bottom">
        <DropDown>
            <template #rename>
                <span>rename list</span>
            </template>

            <template #move-list>
                <span>move list</span>
            </template>

            <template #sort-by>
                <span>sort by</span>
            </template>

            <template #delete-list>
                <span>delete list</span>
            </template>
        </DropDown>
    </transition> -->
</template>

<script>
import ContentView from '../components/ContentView.vue';
import SingleTask from '../components/SingleTask.vue';
import TaskDescription from '../components/TaskDescription.vue'
import DropDown from '../components/DropDown.vue';


import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

import { toggleAside } from '@/stores/toggleAside.js'
// import { computed } from "vue";

export default {
    name: 'List',
    props: ['listId', 'childId', 'closeDescription'],
    components: {
        ContentView,
        SingleTask,
        TaskDescription,
        DropDown
    },
    provide() {
        return {
            // explicitly provide a computed property
            chosenListId: () => this.comListId,
            chosenChildIdListId: () => this.comChildId
        }
    },
    beforeMount: function () {

        console.log(this.listId);
        this.toggleShrink = this.closeDescription


        // this.allList = JSON.parse(localStorage.getItem("allListAndTasks")) || []
        this.allList = this.returnLists || []

        if (!!this.$route.params.childId) {
            this.chosenList = this.allList[this.$route.params.listId]
            console.log(this.allList[this.$route.params.listId].listsArray);
            this.listName = this.chosenList.listsArray[this.$route.params.childId].listName

            console.log(this.chosenList.listsArray[this.$route.params.childId].listName);

            this.allTasks = this.chosenList.listsArray[this.$route.params.childId].tasks;
        } else {
            this.chosenList = this.allList[this.listId]
            this.listName = this.chosenList.listName
            this.allTasks = this.chosenList.tasks;
        }

        console.log(this.$route.params.childId);

        // if (!!this.$route.params.childId) {


        // this.$watch(
        //     () => this.$route.params.childId,
        //     (toParams, previousParams) => {
        //         console.log(toParams, previousParams);
        //         if (toParams != previousParams) {
        //             this.allList = JSON.parse(localStorage.getItem("allListAndTasks")) || []

        //             console.log(this.$route.params.childId);

        //             this.chosenList = this.allList[this.$route.params.listId]
        //             console.log(this.allList[this.$route.params.listId].listsArray);
        //             this.listName = this.chosenList.listsArray[this.$route.params.childId].listName

        //             console.log(this.listName);

        //             this.allTasks = this.chosenList.listsArray[this.$route.params.childId].tasks;

        //         }
        //     }
        // )
        // } else {
        // this.$watch(
        //     () => this.listId,
        //     (toParams, previousParams) => {
        //         console.log(toParams, previousParams);
        //         if (toParams != previousParams) {
        //             this.allList = JSON.parse(localStorage.getItem("allListAndTasks")) || []
        //             console.log(this.$route.params.childId);
        //             this.chosenList = this.allList[this.listId]
        //             this.listName = this.chosenList.listName
        //             console.log(this.listName);
        //             this.allTasks = this.chosenList.tasks;
        //         }
        //     }
        // )
        // }
    },
    data() {
        return {
            allList: [],
            chosenList: [],
            listName: '',
            allTasks: [],
            toggleOpenDescription: false,
            descriptionTaskList: null,
            descriptionTaskChildList: null,
            descriptionTaskIndex: null,
            toggleShrink: false,
            element: '',
            // sendedArray: []
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists']),
        ...mapWritableState(allLists, ['lists']),
        ...mapWritableState(toggleAside, ['toggleState']),

        comListId() {
            return this.listId
        },
        comChildId() {
            return this.childId
        }
    },
    watch: {
        // allTask() {
        //     console.log(this.allTask);
        // }
        listId() {
            if (!this.childId) {
                this.allList = JSON.parse(localStorage.getItem("allListAndTasks")) || []
                this.chosenList = this.allList[this.listId]
                this.listName = this.chosenList.listName
                this.allTasks = this.chosenList.tasks;
                this.toggleShrink = this.closeDescription
                console.log(this.closeDescription);
            }
        },
        childId() {

            if (!!this.childId) {
                this.allList = JSON.parse(localStorage.getItem("allListAndTasks")) || []
                this.chosenList = this.allList[this.$route.params.listId]
                this.listName = this.chosenList.listsArray[this.$route.params.childId].listName
                this.allTasks = this.chosenList.listsArray[this.$route.params.childId].tasks;
                this.toggleShrink = this.closeDescription
            }
        }
    },
    methods: {
        openSideBarDescription() {
            this.toggleState = !this.toggleState
        },
        completeTask() {
            this.lists[this.listId].tasks[event.target.getAttribute('data-id')].complete = true

            console.log('ffff');
        },
        openDescription(listId, index, shrink, element) {
            if (!!this.childId) {
                this.descriptionTaskChildList = this.childId
            }
            this.descriptionTaskList = listId
            this.descriptionTaskIndex = index

            // this.toggleOpenDescription = !this.toggleOpenDescription
            this.toggleShrink = shrink
            this.element = element

        },
        closeDescriptionMethod(value) {
            this.toggleShrink = value
        }
    }
}
</script>