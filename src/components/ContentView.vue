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
        </div>


        <ul class="tasks">
            <slot name="allTaskSlot"></slot>
        </ul>


        <AddTask />
    </div>
</template>

<script>
import AddTask from './AddTask.vue'
import { toggleAside } from '@/stores/toggleAside.js'
import { mapState, mapWritableState } from 'pinia'

export default {
    name: 'RenderContent',
    components: {
        AddTask
    },
    computed: {
        ...mapWritableState(toggleAside, ['toggleState']),
    },
    methods: {
        toggleAside() {
            this.toggleState = !this.toggleState
        }
    }
}
</script>