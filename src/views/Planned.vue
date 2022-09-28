<template>
    <content-view>
            <template v-slot:title>
                Planned
            </template>
        </content-view>
</template>

<script>
    import ContentView from '../components/ContentView.vue';

    export default {
        name:'Planned',
        components:{
            ContentView
        }
    }
</script>