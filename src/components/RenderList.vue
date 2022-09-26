<template>
    <transition name="render-list">
        <ul class="lists-container">

            <li v-for="list in arrayOfLists" :key="list.id"
                :class='[ list.listChildren ? "group-of-lists" : "single-list"]'>


                <template v-if="list.listChildren">
                    <GroupOfLists :childrenListsArray='list.listsArray' :listName="list.listName" />
                </template>

                <p v-else><img src="@/assets/design-material/icons/menu.png" alt="single-list">
                    <span>{{list.listName}}</span>
                </p>
            </li>
        </ul>
    </transition>
</template>

<script>

import GroupOfLists from './GroupOfLists.vue';

export default {
    name: 'render-list',
    components: {
        GroupOfLists
    },
    data() {
        return {
            arrayOfLists: [{
                listName: 'list one',
                id: 1,
                listChildren: true,
                listsArray: [
                    {
                        name: 'children one',
                        id: 'cl1',
                        tasks: [
                            { name: 'task one', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] },
                            { name: 'task two', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] }
                        ]
                    },
                    {
                        name: 'children two',
                        id: 'cl2',
                        tasks: [
                            { name: 'task one', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] },
                            { name: 'task two', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] }
                        ]
                    },
                    {
                        name: 'children three',
                        id: 'cl3',
                        tasks: [
                            { name: 'task one', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] },
                            { name: 'task two', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] }
                        ]
                    }
                ]
            },
            {
                listName: 'list three',
                id: 1,
                listChildren: true,
                listsArray: [
                    {
                        name: 'children one',
                        id: 'cl1',
                        tasks: [
                            { name: 'task one', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] },
                            { name: 'task two', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] }
                        ]
                    },
                    {
                        name: 'children two',
                        id: 'cl2',
                        tasks: [
                            { name: 'task one', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] },
                            { name: 'task two', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] }
                        ]
                    },
                    {
                        name: 'children three',
                        id: 'cl3',
                        tasks: [
                            { name: 'task one', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] },
                            { name: 'task two', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] }
                        ]
                    }
                ]
            },

            {
                listName: 'list four',
                id: 1,
                listChildren: true,
                listsArray: [
                    {
                        name: 'children one',
                        id: 'cl1',
                        tasks: [
                            { name: 'task one', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] },
                            { name: 'task two', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] }
                        ]
                    },
                    {
                        name: 'children two',
                        id: 'cl2',
                        tasks: [
                            { name: 'task one', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] },
                            { name: 'task two', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] }
                        ]
                    },
                    {
                        name: 'children three',
                        id: 'cl3',
                        tasks: [
                            { name: 'task one', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] },
                            { name: 'task two', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] }
                        ]
                    }
                ]
            },
            {
                listName: 'list two',
                id: 2,
                listChildren: false,
                tasks: [
                    { name: 'task one', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] },
                    { name: 'task two', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] }
                ]
            }]
        }
    }
}
</script>