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
            <slot v-if="checkSmartList" name="toggle-description"></slot>
            <slot name="sort-by"></slot>
        </div>

        <ul class="tasks" ref="tasksList" :class="{ 'fix-width': checkHeight }">
            <slot name="allTaskSlot"></slot>
        </ul>
        <AddTask :listId="listId" :chosenSmartList="chosenSmartList" />
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
        this.checkHeightFun()
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

        checkSmartList() {
            if (+this.listId === 0 || +this.listId === 1 || +this.listId === 2 || +this.listId === 3 || +this.listId === 4) {
                return false
            } else {
                return true
            }
        }
    },
    methods: {
        toggleAside() {
            this.toggleState = !this.toggleState
        },
        checkHeightFun() {
            if (!!this.childId) {
                try {
                    if (window.innerHeight - 250 <= (+this.lists[this.listId]?.listsArray[this.childId]?.tasks?.length + 1) * 55) {
                        this.checkHeight = true
                    } else {
                        this.checkHeight = false
                    }
                } catch (error) {
                    this.$router.push({ name: 'list', params: { listId: 0 } })
                }

            } else if (!!this.listId) {
                if (window.innerHeight - 250 <= (+this.lists[this.listId]?.tasks?.length + 1) * 55) {
                    this.checkHeight = true
                } else {
                    this.checkHeight = false
                }
            }
        }
    },
    watch: {
        lists: {
            handler() {
                this.checkHeightFun()
            },
            deep: true
        },
    }
}
</script>