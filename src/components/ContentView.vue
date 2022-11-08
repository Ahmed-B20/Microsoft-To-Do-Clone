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
    beforeMount() {
        if (!!this.childId) {
            if (window.innerHeight - 250 <= (+this.lists[this.listId].listsArray[this.childId].tasks.length + 2.6) * 55) {
                this.checkHeight = true
            } else {
                this.checkHeight = false
            }
        } else if(!!this.listId) {
            console.log(window.innerHeight - 250, (+this.lists[this.listId].tasks.length + 2.6) * 55);
            if (window.innerHeight - 250 <= (+this.lists[this.listId].length + 2.5) * 55) {
                this.checkHeight = true
            } else {
                this.checkHeight = false
            }
        }
    },
    props: ['listId', 'childId'],
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
                if (!!this.childId) {
                    if (window.innerHeight - 250 <= (+this.lists[this.listId].listsArray[this.childId].tasks.length + 2.6) * 55) {
                        this.checkHeight = true
                    } else {
                        this.checkHeight = false
                    }
                } else if(!!this.listId) {
                    console.log(window.innerHeight - 250, (+this.lists[this.listId].tasks.length + 2.6) * 55);
                    if (window.innerHeight - 250 <= (+this.lists[this.listId].length + 2.5) * 55) {
                        this.checkHeight = true
                    } else {
                        this.checkHeight = false
                    }
                }

                console.log(this.checkHeight);
            },
            deep: true
        },
    }
}
</script>