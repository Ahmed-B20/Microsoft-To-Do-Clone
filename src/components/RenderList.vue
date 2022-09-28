<template>
    <transition name="render-list">
        <ul class="lists-container">
            <li @click="showListTasks" v-for="list in returnLists" :data-name="list.listName" :data-id="list.id"
                :key="list.id" :class='[ list.listChildren ? "group-of-lists" : "single-list"]'>


                <template v-if="list.listChildren">
                    <GroupOfLists :childrenListsArray='list.listsArray' :listName="list.listName" />
                </template>

                <p v-else><img src="@/assets/design-material/icons/menu.png" alt="single-list">
                    <span>{{list.listName}}</span>
                </p>
            </li>
        </ul>
    </transition>

    <teleport v-if="teleportToggle" to='.dashboard-content-container'>
        <content-view>
            <template v-slot:title>
                {{listName}}
            </template>
        </content-view>
    </teleport>

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
            listName: ''
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists']),
    },
    methods: {
        showListTasks() {
            console.log();
            if (event.target.tagName === 'LI') {
                this.listName = event.target.getAttribute('data-name')
            } else {
                this.listName = event.target.parentElement.getAttribute('data-name')
            }

            console.log(this.listName);

            this.teleportToggle = true
        }
    }

}
</script>