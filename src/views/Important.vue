<template>
    <content-view>
            <template v-slot:title>
                Important
            </template>
        </content-view>
</template>

<script>
    import ContentView from '../components/ContentView.vue';

    export default {
        name:'Important',
        components:{
            ContentView
        }
    }
</script>