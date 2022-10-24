<template>
    <keep-alive>
        <content-view ref="tasksParent" :class="[toggleShrink ? 'shrink' : 'grow']" :key="listId">
            <template #toggle-sidebar>
                <button @click="openSideBarDescription">
                    <img src="@/assets/design-material/icons/menu.png" alt="open-sidebar">
                </button>
            </template>

            <template v-slot:title>
                My Day
            </template>

            <template #toggle-description>
                <button ref="openListDropDown" class="toggle-list-nav" @click="openListDropDown">
                    <img src="@/assets/design-material/icons/ellipsis.png" alt="open list navbar">
                </button>
            </template>

            <!-- <transition name="sort-by-animation"> -->
            <template v-if="showSortBy" #sort-by>
                <div class="sort-by-container">
                    <button @click="reverseResults" class="button-sort sorted-by">
                        <img v-if="reverseState" src="@/assets/design-material/icons/up-arrow.png" alt="close sort" />
                        <img v-else src="@/assets/design-material/icons/down-arrow.png" alt="close sort" />
                        sorted by {{ sortMethodTarget }}
                    </button>
                    <button @click="closeSort" class="button-sort close">
                        <img src="@/assets/design-material/icons/close.png" alt="close sort" />
                    </button>
                </div>
            </template>
            <!-- </transition> -->

            <template #allTaskSlot>
                <!-- <SingleTask :toggleShrink="toggleShrink" @openDescriptionEvent="openDescription" :listId="listId" /> -->
                <SingleTask :toggleShrink="toggleShrink" @openDescriptionEvent="openDescription" chosenSmartList="myDay" />
            </template>
        </content-view>
    </keep-alive>
</template>

<script>
import ContentView from '@/components/ContentView.vue';
import SingleTask from '@/components/SingleTask.vue';
import TaskDescription from '@/components/TaskDescription.vue'
import DropDown from '@/components/DropDown.vue';


import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

import { toggleAside } from '@/stores/toggleAside.js'
// import { computed } from "vue";

import PopUp from '@/components/PopUp.vue'

export default {
    name: 'List',
    props: ['listId', 'childId', 'closeDescription'],
    components: {
        ContentView,
        SingleTask,
        TaskDescription,
        DropDown,
        PopUp
    },
    provide() {
        return {
            // explicitly provide a computed property
            chosenListId: () => this.comListId,
            chosenChildIdListId: () => this.comChildId
        }
    },
    beforeMount: function () {

        // this.lists.forEach((list) => {
        //     if (list.listChildren) {
        //         if (list.listChildren) {
        //             this.ReturnGroupOfListsArray.push(list)
        //         }
        //     }
        // })
        // this.toggleShrink = this.closeDescription

        // this.allList = this.returnLists || []

        // if (!!this.$route.params.childId) {
        //     this.chosenList = this.allList[this.$route.params.listId]
        //     this.listName = this.chosenList.listsArray[this.$route.params.childId].listName
        //     this.allTasks = this.chosenList.listsArray[this.$route.params.childId].tasks;
        // } else {
        //     this.chosenList = this.allList[this.listId]
        //     this.listName = this.chosenList.listName
        //     this.allTasks = this.chosenList.tasks;
        // }
    },
    data() {
        return {
            allList: [],
            chosenList: [],
            listName: '',
            allTasks: [],
            toggleOpenDescription: false,
            descriptionTaskList: null,
            descriptionTaskChildList: null,
            descriptionTaskIndex: null,
            toggleShrink: false,
            element: '',
            dropDownSlots: ['RenameList', 'MoveListTo', 'SortBy', 'DuplicateList', 'DeleteList'],
            sortingMethods: ['Importance', 'Dua Date', 'Added To My Day', 'Alphabetically', 'Creation Date'],
            toggleDropDown: false,
            top: null,
            right: null,
            showPopUp: false,
            showRename: false,
            newName: '',
            toggleError: false,
            DuplicatedList: {},
            ReturnGroupOfListsArray: [],
            target: '',
            sortMethodTarget: '',
            showSortBy: false,
            reverseState: false
            // sendedArray: []
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists']),
        ...mapWritableState(allLists, ['lists']),
        ...mapWritableState(toggleAside, ['toggleState']),

        comListId() {
            return this.listId
        },
        comChildId() {
            return this.childId
        },
        ReturnGroupOfLists() {
            if (this.ReturnGroupOfListsArray.length > 0) {
                return true
            } else {
                return false
            }
        }
    },
    watch: {
        listId() {
            if (!this.childId) {
                this.allList = JSON.parse(localStorage.getItem("allListAndTasks")) || []
                this.chosenList = this.allList[this.listId]
                this.listName = this.chosenList.listName
                this.allTasks = this.chosenList.tasks;
                this.toggleShrink = this.closeDescription
            }
        },
        childId() {

            if (!!this.childId) {
                this.allList = JSON.parse(localStorage.getItem("allListAndTasks")) || []
                this.chosenList = this.allList[this.$route.params.listId]
                this.listName = this.chosenList.listsArray[this.$route.params.childId].listName
                this.allTasks = this.chosenList.listsArray[this.$route.params.childId].tasks;
                this.toggleShrink = this.closeDescription
            } else {
                this.descriptionTaskChildList = null
            }
        },
        lists: {
            handler(newValue, oldValue) {
                this.ReturnGroupOfListsArray = []
                this.lists.forEach((list) => {
                    if (list.listChildren) {
                        if (list.listChildren) {
                            this.ReturnGroupOfListsArray.push(list)
                        }
                    }
                })
            },
            deep: true
        }
    },
    methods: {
        openSideBarDescription() {
            this.toggleState = !this.toggleState
        },
        completeTask() {
            this.lists[this.listId].tasks[event.target.getAttribute('data-id')].complete = true
        },
        openDescription(listId, index, shrink, element) {
            if (!!this.childId) {
                this.descriptionTaskChildList = this.childId
            }
            this.descriptionTaskList = listId
            this.descriptionTaskIndex = index

            // this.toggleOpenDescription = !this.toggleOpenDescription
            this.toggleShrink = shrink
            this.element = element
            this.toggleDropDown = false
        },
        closeDescriptionMethod(value) {
            this.toggleShrink = value
        },
        openListDropDown() {
            this.parentElementDomRect = this.$refs.openListDropDown.getBoundingClientRect()

            this.top = this.parentElementDomRect.top + 20

            // this.top = this.elementDomRect.top - this.parentElementDomRect.top + 41

            if (!!this.toggleShrink) {
                this.right = 45 + 360
            } else {
                this.right = 45
            }
            this.toggleDropDown = !this.toggleDropDown
        },
        closeDropDown() {
            this.toggleDropDown = false
            this.moveGroupListToggle = false
        },
        togglePopUp(target) {
            this.toggleDropDown = !this.toggleDropDown
            if (target === 'move') {
                this.moveGroupListToggle = !this.moveGroupListToggle
                this.showPopUp = !this.showPopUp
                this.target = 'move'
            } else if (target === 'delete') {
                this.showPopUp = !this.showPopUp
                this.target = 'delete'
            } else {
                this.showPopUp = !this.showPopUp
                this.target = 'sort'
            }
        },
        closePopUp() {
            this.showPopUp = !this.showPopUp
            this.toggleDropDown = false
            this.moveGroupListToggle = false
            this.target = ''
        },
        deleteList() {
            this.lists.splice(this.listId, 1)
            this.lists.forEach((list, index) => {
                if (index >= this.listId) {
                    list.id = list.id - 1
                }
            })

            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))

            this.toggleDropDown = false
            this.showPopUp = !this.showPopUp
        },
        DuplicateList() {
            this.DuplicatedList.listName = this.lists[this.listId].listName + ' copy'
            // this.DuplicatedList.id = this.lists[this.listId].id + 1
            this.DuplicatedList.id = +this.listId + 1
            this.DuplicatedList.listChildren = this.lists[this.listId].listChildren
            this.DuplicatedList.tasks = this.lists[this.listId].tasks
            this.lists.splice(+this.listId + 1, 0, this.DuplicatedList)
            // this.lists.push(this.DuplicatedList)
            this.lists.forEach(((list, index) => {
                if (+this.listId + 1 <= index) {
                    list.id = index
                }
            }))

            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))

            this.toggleDropDown = false
            this.DuplicatedList = {}
        },
        closeRename() {
            this.showRename = !this.showRename
        },
        renameList() {
            this.showRename = !this.showRename
            this.newName = this.listName
        },
        newListName() {
            if (this.newName.length > 0) {
                if (!!this.descriptionTaskChildList) {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].listName = this.newName
                } else {
                    this.lists[this.listId].listName = this.newName
                }
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                this.listName = this.newName
                this.newName = ''
                this.showRename = !this.showRename
                this.toggleDropDown = !this.toggleDropDown
            } else {
                if (!!this.toggleError) {
                    this.toggleError = false
                    setTimeout(() => {
                        this.toggleError = true
                    }, 0)
                } else {
                    setTimeout(() => {
                        this.toggleError = true
                    }, 0)
                }
            }
        },
        MoveListTo() {
            this.lists[this.listId].id = this.lists[this.$refs.selectedGroupOfList.value].listsArray.length
            this.lists[this.$refs.selectedGroupOfList.value].listsArray.push(this.lists[this.listId])

            this.lists.splice(this.listId, 1)

            this.lists.forEach((list, index) => {
                if (index >= this.listId) {
                    list.id = list.id - 1
                }
            })

            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            this.toggleDropDown = false
            this.showPopUp = !this.showPopUp
            this.moveGroupListToggle = !this.moveGroupListToggle
        },
        sortBy() {
            this.showSortBy = true
            this.sortMethodTarget = this.sortingMethods[this.$refs.selectedSortValue.value]
            switch (this.sortingMethods[this.$refs.selectedSortValue.value]) {
                case 'Importance':
                    this.lists[this.listId].tasks.sort((a, b) => {
                        if (a.important < b.important) { return 1; }
                        if (a.important > b.important) { return -1; }
                        return 0;
                    })
                    break;

                case 'Dua Date':
                    this.lists[this.listId].tasks.sort((a, b) => {
                        if (new Date(a.dueTime).getTime() < new Date(b.dueTime).getTime()) { return -1; }
                        if (new Date(a.dueTime).getTime() > new Date(b.dueTime).getTime()) { return 1; }
                        return 0;
                    })
                    break;

                case 'Added To My Day':
                    this.lists[this.listId].tasks.sort((a, b) => {
                        if (a.addToMyDay < b.addToMyDay) { return 1; }
                        if (a.addToMyDay > b.addToMyDay) { return -1; }
                        return 0;
                    })
                    break;

                case 'Alphabetically':
                    this.lists[this.listId].tasks.sort((a, b) => {
                        if (a.name < b.name) { return -1; }
                        if (a.name > b.name) { return 1; }
                        return 0;
                    })
                    break;

                case 'Creation Date':
                    this.lists[this.listId].tasks.sort((a, b) => {
                        if (new Date(a.sortTime).getTime() < new Date(b.sortTime).getTime()) { return -1; }
                        if (new Date(a.sortTime).getTime() > new Date(b.sortTime).getTime()) { return 1; }
                        return 0;
                    })
                    break;

                default:

                    break;
            }
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            this.toggleDropDown = false
            this.showPopUp = !this.showPopUp
        },
        closeSort() {
            this.lists[this.listId].tasks.sort((a, b) => {
                if (a.name < b.name) { return -1; }
                if (a.name > b.name) { return 1; }
                return 0;
            })
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            this.showSortBy = false
        },
        reverseResults() {
            this.reverseState = !this.reverseState
            this.lists[this.listId].tasks.reverse()
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
        }
    }
}
</script>