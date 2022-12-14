<template>
    <content-view ref="tasksParent" :class="[toggleShrink ? 'shrink' : 'grow']" :childId="childId" :listId="listId"
        :key="childId ? childId : listId">
        <template #toggle-sidebar>
            <button @click="openSideBarDescription">
                <img src="@/assets/design-material/icons/menu.png" alt="open-sidebar">
            </button>
        </template>

        <template v-slot:title>
            {{ returnListName }}
        </template>

        <template #toggle-description>
            <button ref="openListDropDownElement" class="toggle-list-nav" @click="openListDropDown">
                <img src="@/assets/design-material/icons/ellipsis.png" alt="open list navbar">
            </button>
        </template>

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

        <template #allTaskSlot>
            <SingleTask :toggleShrink="toggleShrink" @openDescriptionEvent="openDescription" :listId="listId"
                :childId="childId" />
        </template>
    </content-view>

    <transition name="to-left" :css="animated">
        <TaskDescription :key="descriptionTaskIndex" :toggleShrink="toggleShrink"
            @closeDescription="closeDescriptionMethod" :descriptionTaskList="descriptionTaskList"
            :descriptionTaskChildList="descriptionTaskChildList" :descriptionTaskIndex="descriptionTaskIndex"
            v-if="toggleShrink" :element="element" />
    </transition>

    <transition name="to-bottom">
        <DropDown :dropDownSlots="dropDownSlots" :top="top" :right="right" v-if="toggleDropDown">
            <template #RenameList>
                <div class="renameList" @click.self="renameList">
                    <template v-if="showRename">
                        <img @click="newListName" class="renameTask" :class="{ active: itemDetect }"
                            src="@/assets/design-material/icons/plus.png" alt="add-item" />
                        <input @keypress.enter="newListName" required @focus="toggleErrorClass" v-model="newName"
                            placeholder="New Name" type="text" name="" id="" :class="{ error: toggleError }" />
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

            <template v-if="hasTasks" #SortBy>
                <div @click="togglePopUp('sort')">
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
            {{ target === 'move' ? 'Move List' : target === 'delete' ? 'Delete List' : 'Sort By' }}
        </template>

        <template v-slot:content>
            <div v-if="target === 'move'" class="select-parent">
                <select ref="selectedGroupOfList" name="" id="">
                    <option v-for="(groupOfList, index) in ReturnGroupOfListsArray" :key="index"
                        :value="groupOfList.id">
                        {{ groupOfList.listName }}
                    </option>
                </select>
            </div>

            <div v-else-if="target === 'sort'" class="select-parent">
                <select ref="selectedSortValue" name="" id="">
                    <option v-for="(sortMethod, index) in sortingMethods" :key="index" :value="index">
                        {{ sortMethod }}
                    </option>
                </select>
            </div>
            <p v-else>
                list {{ listName }} will be permanently deleted
            </p>
        </template>

        <template #button>
            <button v-if="target === 'move'" class="move" @click="MoveListTo">Move</button>
            <button v-else-if="target === 'sort'" class="sort" @click="sortBy">Sort</button>
            <button v-else class="delete" @click="deleteList">Delete</button>
            <button class="close" @click="closePopUp">Cancel</button>
        </template>
    </PopUp>
</template>

<script>

import ContentView from '@/components/main-page-components/ContentView.vue';
import SingleTask from '@/components/task/SingleTask.vue';
import TaskDescription from '@/components/task/TaskDescription.vue'
import DropDown from '@/components/global-components/DropDown.vue';
import PopUp from '@/components/global-components/PopUp.vue'


import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'
import { toggleAside } from '@/stores/toggleAside.js'


export default {
    name: 'List',
    props: ['listId', 'childId', 'closeDescription', 'name', 'currentListName'],
    components: {
        ContentView,
        SingleTask,
        TaskDescription,
        DropDown,
        PopUp
    },
    provide() {
        return {
            chosenListId: () => this.comListId,
            chosenChildIdListId: () => this.comChildId
        }
    },
    beforeRouteEnter(to, from, next) {
        if (!!JSON.parse(localStorage.getItem("allUsers"))[0].idOfLoginUser) {
            if (to.params.listId >= JSON.parse(localStorage.getItem("allListAndTasks"))?.length || to.params?.childId > JSON.parse(localStorage.getItem("allListAndTasks"))[to.params.listId]?.listsArray?.length) {
                next({ name: 'not-found' })
            } else if (JSON.parse(localStorage.getItem("allListAndTasks"))[to.params.listId].listChildren && !to.params?.childId) {
                next({ name: 'not-found' })
            } else {
                next()
            }
        } else {
            next({ name: 'login' })
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

        this.lists[4].tasks = []
    },
    data() {
        return {
            parentElementDomRect: null,
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
            reverseState: false,
            oldTaskIndex: null,
            animated: true,
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
        },
        itemDetect() {
            if (this.newName.length > 0) {
                return true;
            } else {
                return false;
            }
        },
        returnListName() {
            if (!!this.$route.params.childId) {
                return this.lists[this.$route.params.listId]?.listsArray[this.$route.params.childId].listName
            } else {
                return this.lists[this.$route.params.listId]?.listName
            }
        },
        hasTasks() {
            if (!!this.$route.params.childId) {
                if (this.lists[this.$route.params.listId].listsArray[this.$route.params.childId].tasks.length > 0) {
                    return true
                } else {
                    return false
                }
            } else if (!!this.lists[this.$route.params.listId]) {
                if (this.lists[this.$route.params.listId].tasks.length > 0) {
                    return true
                } else {
                    return false
                }
            }

        }
    },
    watch: {
        listId() {
            this.toggleDropDown = false
            this.parentElementDomRect = this.$refs.openListDropDownElement.getBoundingClientRect()
            this.top = null
            this.right = null


            if (!this.childId) {
                this.allList = JSON.parse(localStorage.getItem("allListAndTasks")) || []
                this.chosenList = this.allList[this.listId]
                this.listName = this.chosenList.listName
                this.allTasks = this.chosenList.tasks;
                this.toggleShrink = this.closeDescription
            }
        },
        childId() {
            this.toggleDropDown = false
            this.parentElementDomRect = this.$refs.openListDropDownElement.getBoundingClientRect()
            this.top = null
            this.right = null

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
        },
        'this.$route': {
            handler: function () {
                if (this.$route.params.name) {
                    this.$forceUpdate()
                }
            },
            deep: true,
            immediate: true
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

            if (shrink) {
                if (+this.oldTaskIndex !== +index && this.oldTaskIndex !== null) {

                    this.animated = false
                    this.toggleShrink = true
                    this.oldTaskIndex = index
                } else {
                    this.animated = true
                    this.toggleShrink = true
                    this.oldTaskIndex = index
                }
            } else {
                this.animated = true
                this.toggleShrink = shrink
                this.oldTaskIndex = index
            }

            this.element = element
            this.toggleDropDown = false
        },
        closeDescriptionMethod(value) {
            this.toggleShrink = value
        },
        openListDropDown() {
            this.parentElementDomRect = this.$refs.openListDropDownElement.getBoundingClientRect()
            this.top = 82.5
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
            this.DuplicatedList.id = +this.listId + 1
            this.DuplicatedList.listChildren = this.lists[this.listId].listChildren
            this.DuplicatedList.tasks = this.lists[this.listId].tasks
            this.lists.splice(+this.listId + 1, 0, this.DuplicatedList)
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