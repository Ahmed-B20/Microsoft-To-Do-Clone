<template>
    <content-view>
            <template v-slot:title>
                Tasks
            </template>
        </content-view>
</template>

<script>
    import ContentView from '../components/ContentView.vue';

    export default {
        name:'Tasks',
        components:{
            ContentView
        }
    }
</script>