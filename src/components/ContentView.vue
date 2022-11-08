<template>
    <div class="view-content-container">
        <div class="title">
            <div class="toggle">
                <slot name="toggle-sidebar">
                    <img @click.self="toggleAside" src="@/assets/design-material/icons/menu.png" alt="open-sidebar">
                </slot>
            </div>

            <h1>
                <slot name="title"></slot>
            </h1>
            <slot name="toggle-description"></slot>
            <slot name="sort-by"></slot>
        </div>

        <ul class="tasks" ref="tasksList" :class="{ 'fix-width': checkHeight }">
            <slot name="allTaskSlot"></slot>
        </ul>
        <AddTask :chosenSmartList="chosenSmartList" />
    </div>
</template>

<script>
import AddTask from './AddTask.vue'
import { toggleAside } from '@/stores/toggleAside.js'
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'RenderContent',
    props: ['chosenSmartList'],
    components: {
        AddTask
    },
    data() {
        return {
            checkHeight: false
        }
    },
    computed: {
        ...mapWritableState(toggleAside, ['toggleState']),
        ...mapWritableState(allLists, ['lists']),
    },
    methods: {
        toggleAside() {
            this.toggleState = !this.toggleState
        }
    },
    watch: {
        lists: {
            handler() {

                console.log((this.$refs.tasksList.querySelectorAll('li').length + 3) * 55);

                if (window.innerHeight - 250 >= (this.$refs.tasksList.querySelectorAll('li').length + 2.5) * 55) {
                    this.checkHeight = false
                } else {
                    this.checkHeight = true
                }

                console.log(this.checkHeight);
            },
            deep: true
        },
    }
}
</script>