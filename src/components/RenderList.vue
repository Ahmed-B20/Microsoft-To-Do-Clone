<template>
    <transition name="render-list">
        <ul class="lists-container">
            <transition-group name="render-list">
                <li @click="showListTasks" v-for="(list, index) in returnLists" :data-name="list.listName" :data-id="list.id"
                    :key="list.id" :class='[ list.listChildren ? "group-of-lists" : "single-list"]'>


                    <template v-if="list.listChildren">
                        <GroupOfLists :index="index" :childrenListsArray='list.listsArray' :listName="list.listName"
                            :parentId="list.id" />
                    </template>

                    <p v-else><img src="@/assets/design-material/icons/menu.png" alt="single-list">
                        <span>{{list.listName}}</span>

                        <span class="tasks-count" v-if="!list.listChildren">
                            {{list.tasks.length}}
                        </span>
                    </p>
                </li>
            </transition-group>
        </ul>
    </transition>

    <!-- <teleport v-if="teleportToggle" to='.view-content-container'>
        <content-view>
            <template v-slot:title>
                {{listName}}
            </template>

            <template v-slot:allTask>
                <li v-for="(index, task) in allTasks" :key="index">{{task}}</li>
            </template>
        </content-view>
    </teleport> -->

</template>

<script>

import ContentView from './ContentView.vue';
import GroupOfLists from './GroupOfLists.vue';
import { allLists } from '@/stores/allLists.js'
import { mapState } from 'pinia'

export default {
    name: 'render-list',
    components: {
        GroupOfLists,
        ContentView
    },
    beforeMount() {
        this.assignArrayOfLists
    },
    data() {
        return {
            arrayOfLists: [],
            teleportToggle: false,
            listName: '',
            listIndex: 0,
            allTasks: [],
            closeDescription: false
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists']),
    },
    methods: {
        showListTasks() {
            if (event.target.tagName === 'LI' && event.target.classList.contains("single-list")) {
                this.listName = event.target.getAttribute('data-name')
                this.listIndex = event.target.getAttribute('data-id')
                this.$router.push({ name: 'list', params: { listId: this.listIndex, closeDescription: false } })
            } else if (event.target.tagName === 'P' && event.target.parentElement.classList.contains("single-list")) {
                this.listName = event.target.parentElement.getAttribute('data-name')
                this.listIndex = event.target.parentElement.getAttribute('data-id')
                this.$router.push({ name: 'list', params: { listId: this.listIndex, closeDescription: false } })
            } else if (event.target.parentElement.parentElement.classList.contains("single-list")) {
                this.listName = event.target.parentElement.parentElement.getAttribute('data-name')
                this.listIndex = event.target.parentElement.parentElement.getAttribute('data-id')
                this.$router.push({ name: 'list', params: { listId: this.listIndex, closeDescription: false } })
            }


            if (!!this.listIndex) {
                // this.allTasks = this.returnLists[this.listIndex].tasks


                // this.teleportToggle = true
                console.log('gkj');

                // this.$router.push({ name: 'list', params: { listId: this.listIndex } })
            } else {
                // console.log(event.target.parentElement);
            }
        }
    }
}
</script>