<template>
    <transition name="render-list">
        <ul class="lists-container">
            <li class="group-of-lists">
                <div class="group-of-lists-controller">
                    <p><img src="@/assets/design-material/icons/tab.png" alt="single-list"> <span>demo test</span></p>
                    <span class="toggle"><img src="@/assets/design-material/icons/arrow-down-sign-to-navigate.png"
                            alt="arrow-down-sign-to-navigate"></span>
                </div>
                <ul>
                    <li><img src="@/assets/design-material/icons/menu.png" alt="single-list"> demo test</li>
                </ul>
            </li>

            <li class="single-list"><img src="@/assets/design-material/icons/menu.png" alt="single-list"> demo test</li>
        </ul>
    </transition>
</template>

<script>
export default {
    name: 'render-list',
    data() {
        return {
            arrayOfLists: [{
                lastName: 'list one',
                listChildren: 'true',
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
            }]
        }
    },
}
</script>