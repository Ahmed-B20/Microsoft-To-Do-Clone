<template>
    <div @click="toggleGroup" class="group-of-lists-controller">
        <p>
            <img src="@/assets/design-material/icons/tab.png" alt="single-list">
            <span>{{listName}}</span>
        </p>
        <span class="toggle">
            <img src="@/assets/design-material/icons/arrow-down-sign-to-navigate.png" alt="arrow-down-sign-to-navigate">
        </span>
    </div>

    <transition name="toggle-group-of-list">
        <!-- <ul :class="{active:groupOfListsToggle}"> -->
        <transition name="toggle-group-of-list">
            <ul v-if="groupOfListsToggle">
                <transition-group name="render-list">
                    <li @click="showListTasks" :data-name="childrenList.name" :data-id="childrenList.id"
                        v-for="childrenList in childrenListsArray" :key="childrenList.id">
                        <p :data-name="childrenList.name" :data-id="childrenList.id">
                            <img :data-name="childrenList.name" :data-id="childrenList.id"
                                src="@/assets/design-material/icons/menu.png" alt="single-list">
                            <span :data-name="childrenList.name"
                                :data-id="childrenList.id">{{childrenList.listName}}</span>
                        </p>
                    </li>
                </transition-group>
            </ul>
        </transition>
    </transition>
</template>

<script>
export default {
    name: 'group-of-list',
    props: ['childrenListsArray', 'listName', 'parentId'],
    data() {
        return {
            groupOfListsToggle: false,
            listNameRoute: '',
            listIndex: 0,
        }
    },
    beforeMount() {
        // console.log(this.listName);
    },
    methods: {
        toggleGroup() {
            this.groupOfListsToggle = !this.groupOfListsToggle
        },
        showListTasks() {
            this.listNameRoute = event.target.getAttribute('data-name')
            this.listIndex = event.target.getAttribute('data-id')
            this.teleportToggle = true
            console.log(this.parentId, this.listIndex);
            this.$router.push({ name: 'child-list', params: { listId: this.parentId, childId: this.listIndex, closeDescription: false } })

            // console.log(this.listIndex);
        }
    }
}
</script>