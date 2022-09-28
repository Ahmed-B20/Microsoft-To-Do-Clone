<template>
    <content-view>
            <template v-slot:title>
                My Day
            </template>
        </content-view>
</template>

<script>
    import ContentView from '../components/ContentView.vue';

    export default {
        name:'MyDay',
        components:{
            ContentView
        }
    }
</script>