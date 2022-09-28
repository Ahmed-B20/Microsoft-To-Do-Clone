<template>
    <content-view :chosenListId="listId">
        <template v-slot:title>
            {{listName}}
        </template>
    </content-view>
</template>

<script>
import ContentView from '../components/ContentView.vue';

export default {
    name: 'List',
    props: ['listId'],
    components: {
        ContentView
    },
    beforeMount: function () {

        this.allList = JSON.parse(localStorage.getItem("allListAndTasks")) || []

        this.chosenList = this.allList[this.listId]
        this.listName = this.chosenList.listName

        this.$watch(
            () => this.listId,
            (toParams, previousParams) => {
                if (toParams != previousParams) {
                    this.allList = JSON.parse(localStorage.getItem("allListAndTasks")) || []

                    this.chosenList = this.allList[this.listId]
                    this.listName = this.chosenList.listName

                    console.log(this.listId);
                }
            }
        )
    },
    data() {
        return {
            allList: [],
            chosenList: [],
            listName: ''
        }
    },
    methods: {
        // getList() {
        //     this.allList = JSON.parse(localStorage.getItem("allListAndTasks")) || []

        //     this.chosenList = this.allList[this.listId]

        //     console.log(this.chosenList);
        // }
    }
}
</script>