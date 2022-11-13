<template>
    <div class="view-content-container">
        <div class="title">
            <div class="toggle">
                <img @click.self="toggleAside" src="@/assets/design-material/icons/menu.png" alt="open-sidebar">
            </div>
        </div>

        <div class="page-not-found">
            <h1 class="no-result">No Results Found</h1>
        </div>
    </div>
</template>

<script>
import { mapState, mapWritableState } from 'pinia'
import { toggleAside } from '@/stores/toggleAside.js'


export default {
    name: 'PageNotFound',
    data() {
        return {

        }
    },
    computed: {
        ...mapWritableState(toggleAside, ['toggleState']),
    },
    methods: {
        toggleAside() {
            this.toggleState = !this.toggleState
        }
    },
}
</script>