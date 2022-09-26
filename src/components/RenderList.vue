<template>
    <transition name="render-list">
        <ul class="lists-container">

            <li v-for="list in arrayOfLists" :key="list.lastName"
                :class='[ list.listChildren ? "group-of-lists" : "single-list"]'>


                <template v-if="list.listChildren">
                    <div class="group-of-lists-controller">
                        <p><img src="@/assets/design-material/icons/tab.png" alt="single-list">
                            <span>{{list.listName}}</span>
                        </p>
                        <span class="toggle"><img src="@/assets/design-material/icons/arrow-down-sign-to-navigate.png"
                                alt="arrow-down-sign-to-navigate"></span>
                    </div>
                    <ul>
                        <li v-for="childrenList in  list.listsArray" :key="childrenList.name">
                            <p><img src="@/assets/design-material/icons/menu.png" alt="single-list">
                                <span>{{childrenList.name}}</span>
                            </p>
                        </li>
                    </ul>
                </template>

                <p v-else><img src="@/assets/design-material/icons/menu.png" alt="single-list">
                    <span>{{list.listName}}</span>
                </p>
            </li>
        </ul>
    </transition>
</template>

<script>
export default {
    name: 'render-list',
    data() {
        return {
            arrayOfLists: [{
                listName: 'list one',
                listChildren: true,
                listsArray: [
                    {
                        name: 'children one',
                        tasks: [
                            { name: 'task one', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] },
                            { name: 'task two', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] }
                        ]
                    },
                    {
                        name: 'children two',
                        tasks: [
                            { name: 'task one', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] },
                            { name: 'task two', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] }
                        ]
                    },
                    {
                        name: 'children three',
                        tasks: [
                            { name: 'task one', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] },
                            { name: 'task two', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] }
                        ]
                    }
                ]
            },
            {
                listName: 'list two',
                listChildren: false,
                listsArray: [
                    {
                        name: 'children one',
                        tasks: [
                            { name: 'task one', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] },
                            { name: 'task two', important: false, note: 'mmmmm', date: '29/9/2022', myDay: true, steps: ['one', 'two', 'three'] }
                        ]
                    }
                ]
            }]
        }
    },
    computed: {
        // checkClass() {
        //     return list.listCihldren ? "group-of-lists" : "single-list"
        // }
    }
}
</script>