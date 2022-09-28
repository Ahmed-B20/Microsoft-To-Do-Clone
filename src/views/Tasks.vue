<template>
    <tab-render>
        <template v-slot:title>
            Tasks
        </template>
    </tab-render>
</template>

<script>
import TabRender from '../components/TabRender.vue';

export default {
    name: 'Tasks',
    components: {
        TabRender
    }
}
</script>