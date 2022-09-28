<template>
    <transition name="render-list">
        <ul class="lists-container">
            <li v-for="list in returnLists" :key="list.id"
                :class='[ list.listChildren ? "group-of-lists" : "single-list"]'>


                <template v-if="list.listChildren">
                    <GroupOfLists :childrenListsArray='list.listsArray' :listName="list.listName" />
                </template>

                <p v-else><img src="@/assets/design-material/icons/menu.png" alt="single-list">
                    <span>{{list.listName}}</span>
                </p>
            </li>
        </ul>
    </transition>
</template>

<script>

import GroupOfLists from './GroupOfLists.vue';
import { allLists } from '@/stores/allLists.js'
import { mapState } from 'pinia'

export default {
    name: 'render-list',
    components: {
        GroupOfLists
    },
    beforeMount() {
        this.assignArrayOfLists
    },
    data() {
        return {
            arrayOfLists: []
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists']),
    },

}
</script>