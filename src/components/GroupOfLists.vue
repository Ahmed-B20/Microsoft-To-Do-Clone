<template>
    <div @click="toggleGroup" class="group-of-lists-controller">
        <p><img src="@/assets/design-material/icons/tab.png" alt="single-list">
            <span>{{listName}}</span>
        </p>
        <span class="toggle"><img src="@/assets/design-material/icons/arrow-down-sign-to-navigate.png"
                alt="arrow-down-sign-to-navigate"></span>
    </div>

    <transition name="toggle-group-of-list">
        <!-- <ul :class="{active:groupOfListsToggle}"> -->
        <ul v-show="groupOfListsToggle">
            <li v-for="childrenList in childrenListsArray" :key="childrenList.id">
                <p><img src="@/assets/design-material/icons/menu.png" alt="single-list">
                    <span>{{childrenList.name}}</span>
                </p>
            </li>
        </ul>
    </transition>
</template>

<script>
export default {
    name: 'group-of-list',
    props: ['listName', 'childrenListsArray'],
    data() {
        return {
            groupOfListsToggle: false,
        }
    },
    methods: {
        toggleGroup() {
            this.groupOfListsToggle = !this.groupOfListsToggle
        }
    }
}
</script>