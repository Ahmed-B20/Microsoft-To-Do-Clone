<template>
    <keep-alive>
        <content-view ref="tasksParent" :class="[toggleShrink? 'shrink': 'grow']" :key="listId">
            <template #toggle-sidebar>
                <button @click="openSideBarDescription">
                    <img src="@/assets/design-material/icons/menu.png" alt="open-sidebar">
                </button>
            </template>

            <template v-slot:title>
                {{listName}}
            </template>

            <template #toggle-description>
                <button ref="openListDropDown" class="toggle-list-nav" @click="openListDropDown">
                    <img src="@/assets/design-material/icons/ellipsis.png" alt="open list navbar">
                </button>
            </template>


            <template #allTaskSlot>
                <!-- <SingleTask :toggleShrink="toggleShrink" @openDescriptionEvent="openDescription" :listId="listId" /> -->
                <SingleTask :toggleShrink="toggleShrink" @openDescriptionEvent="openDescription" :listId="listId"
                    :childId="childId" />
            </template>
        </content-view>
    </keep-alive>

    <transition name="to-left">
        <TaskDescription :key="descriptionTaskIndex" :toggleShrink="toggleShrink" @closeDescription="closeDescriptionMethod"
            :descriptionTaskList="descriptionTaskList" :descriptionTaskChildList="descriptionTaskChildList"
            :descriptionTaskIndex="descriptionTaskIndex" v-if="toggleShrink" :element="element" />
    </transition>

    <transition name="to-bottom">
        <DropDown :dropDownSlots="dropDownSlots" :top="top" :right="right" v-if="toggleDropDown">
            <template #RenameList>
                <div class="renameList" @click.self="renameList">
                    <template v-if="showRename">
                        <img @click="newListName" class="renameTask" :class="{ active: itemDetect }"
                            src="@/assets/design-material/icons/plus.png" alt="add-item" />
                        <input @keyup.enter="newListName" required @focus="toggleErrorClass" v-model="newName"
                            placeholder="New Name" type="text" name="" id="" :class="{error:toggleError}" />
                        <img @click="closeRename" src="@/assets/design-material/icons/close.png" alt="close rename" />
                    </template>

                    <template v-else>
                        <img @click="renameList" src="@/assets/design-material/icons/rename.png" alt="rename task" />
                        <span @click="renameList">Rename List</span>
                    </template>
                </div>
            </template>

            <template #MoveListTo v-if="ReturnGroupOfLists">
                <div @click="togglePopUp('move')">
                    <img src="@/assets/design-material/icons/curve-arrow.png" alt="">
                    <span>Move list to...</span>
                </div>
            </template>

            <template #SortBy>
                <div @click="DuplicateList">
                    <img src="@/assets/design-material/icons/sort.png" alt="">
                    <span>Sort By</span>
                </div>
            </template>

            <template #DuplicateList>
                <div @click="DuplicateList">
                    <img src="@/assets/design-material/icons/copy.png" alt="">
                    <span>Duplicate list</span>
                </div>
            </template>

            <template #DeleteList>
                <div @click="togglePopUp('delete')">
                    <img src="@/assets/design-material/icons/delete.png" alt="">
                    <span>Delete list</span>
                </div>
            </template>
        </DropDown>
    </transition>

    <PopUp :showPopUp="showPopUp">
        <template #title>
            {{target=== 'move'? 'Move List': 'Delete List'}}
        </template>

        <template v-slot:content>
            <div v-if="moveGroupListToggle" class="select-parent">
                <select ref="selectedGroupOfList" name="" id="">
                    <option v-for="(groupOfList, index) in ReturnGroupOfListsArray" :key="index"
                        :value="groupOfList.id">
                        {{groupOfList.listName}}
                    </option>
                </select>
            </div>
            <p v-else>
                list {{listName}} will be permanently deleted
            </p>
        </template>

        <template #button>
            <button v-if="moveGroupListToggle" class="move" @click="MoveListTo">Move</button>
            <button v-else class="delete" @click="deleteList">Delete</button>
            <button class="close" @click="closePopUp">Cancel</button>
        </template>
    </PopUp>

    <!-- <transition name="to-bottom">
        <DropDown>
            <template #rename>
                <span>rename list</span>
            </template>

            <template #move-list>
                <span>move list</span>
            </template>

            <template #sort-by>
                <span>sort by</span>
            </template>

            <template #delete-list>
                <span>delete list</span>
            </template>
        </DropDown>
    </transition> -->
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

        this.lists.forEach((list) => {
            if (list.listChildren) {
                if (list.listChildren) {
                    this.ReturnGroupOfListsArray.push(list)
                }
            }
        })
        this.toggleShrink = this.closeDescription

        this.allList = this.returnLists || []

        if (!!this.$route.params.childId) {
            this.chosenList = this.allList[this.$route.params.listId]
            this.listName = this.chosenList.listsArray[this.$route.params.childId].listName
            this.allTasks = this.chosenList.listsArray[this.$route.params.childId].tasks;
        } else {
            this.chosenList = this.allList[this.listId]
            this.listName = this.chosenList.listName
            this.allTasks = this.chosenList.tasks;
        }
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
            toggleDropDown: false,
            top: null,
            right: null,
            showPopUp: false,
            showRename: false,
            newName: '',
            toggleError: false,
            DuplicatedList: {},
            ReturnGroupOfListsArray: []


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
            } else {
                this.showPopUp = !this.showPopUp
                this.target = 'delete'
            }
        },
        closePopUp() {
            this.showPopUp = !this.showPopUp
            this.toggleDropDown = !this.toggleDropDown
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
        }
    }
}
</script>