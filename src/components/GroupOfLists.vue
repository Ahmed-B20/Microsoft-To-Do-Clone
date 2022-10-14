<template>
    <!-- tabindex="0" @blur="closeDropDown" -->
    <div ref="groupOfLists" @contextmenu="openDropDown('parentList')" @click="toggleGroup"
        class="group-of-lists-controller">
        <p>
            <img src="@/assets/design-material/icons/tab.png" alt="single-list">
            {{listName}}
        </p>
        <span class="toggle">
            <img src="@/assets/design-material/icons/arrow-down-sign-to-navigate.png" alt="arrow-down-sign-to-navigate">
        </span>
    </div>

    <transition name="to-bottom">
        <DropDown :dropDownSlots="dropDownSlots" :top="top" :left="left"
            v-if="toggleDropDown && theColor === 'parentList'">
            <template #RenameGroup>
                <div class="renameList" @click.self="renameGroup">
                    <template v-if="showRename">
                        <img @click="newGroupName" class="renameTask" :class="{ active: itemDetect }"
                            src="@/assets/design-material/icons/plus.png" alt="add-item" />
                        <input ref="inputFiled" @keyup.enter="newGroupName" required v-model="newName"
                            placeholder="New Name" type="text" name="" id="" :class="{error:toggleError}" />
                        <img @click="closeNewList" src="@/assets/design-material/icons/close.png" alt="close rename" />
                    </template>

                    <template v-else>
                        <img @click="renameGroup" src="@/assets/design-material/icons/rename.png" alt="rename task" />
                        <span @click="renameGroup">Rename group</span>
                    </template>
                </div>
            </template>

            <template #NewList>
                <div @click.self="addNewList">
                    <template v-if="showAddNewList">
                        <img @click="newChildList" class="renameTask" :class="{ active: itemDetect }"
                            src="@/assets/design-material/icons/plus.png" alt="add-item" />
                        <input ref="inputFiled" @keyup.enter="newChildList" required v-model="newListName"
                            placeholder="New Name" type="text" name="" id="" :class="{error:toggleError}" />
                        <img @click="closeRename" src="@/assets/design-material/icons/close.png" alt="close rename" />
                    </template>

                    <template v-else>
                        <img @click="addNewList" src="@/assets/design-material/icons/plus.png" alt="rename task" />
                        <span @click="addNewList">New list</span>
                    </template>
                </div>
            </template>

            <template v-if="showSlotForGroupOfList" #UngroupLists>
                <div @click="ungroupLists">
                    <img src="@/assets/design-material/icons/ungroup.png" alt="">
                    <span>Ungroup lists</span>
                </div>
            </template>

            <template v-if="!showSlotForGroupOfList" #DeleteGroup>
                <div class="delete" @click="togglePopUp('deleteGroup')">
                    <img src="@/assets/design-material/icons/delete.png" alt="">
                    <span>Delete group</span>
                </div>
            </template>
        </DropDown>
    </transition>

    <transition name="to-bottom">
        <DropDown :dropDownSlots="dropDownSlotsChildList" :bottom="bottom" :top="top" :left="left"
            v-if="toggleDropDown && theColor === 'childList'">
            <template #RenameList>
                <div class="renameList" @click.self="renameChildList">
                    <template v-if="showChildRename">
                        <img @click="newChildListNameFun" class="renameTask" :class="{ active: itemDetect }"
                            src="@/assets/design-material/icons/plus.png" alt="add-item" />
                        <input @keyup.enter="newChildListNameFun" required @focus="toggleErrorClass" v-model="newName"
                            placeholder="New Name" type="text" name="" id="" :class="{error:toggleError}" />
                        <img @click="closeChildRename" src="@/assets/design-material/icons/close.png"
                            alt="close rename" />
                    </template>

                    <template v-else>
                        <img @click="renameChildList" src="@/assets/design-material/icons/rename.png"
                            alt="rename task" />
                        <span @click="renameChildList">Rename List</span>
                    </template>
                </div>
            </template>

            <template #MoveListTo v-if="ReturnGroupOfLists">
                <div @click="togglePopUp('move')">
                    <img src="@/assets/design-material/icons/curve-arrow.png" alt="">
                    <span>Move list to...</span>
                </div>
            </template>

            <template #DuplicateList>
                <div @click="DuplicateList">
                    <img src="@/assets/design-material/icons/copy.png" alt="">
                    <span>Duplicate list</span>
                </div>
            </template>

            <template #DeleteList>
                <div class="delete" @click="togglePopUp('deleteList')">
                    <img src="@/assets/design-material/icons/delete.png" alt="">
                    <span>Delete list</span>
                </div>
            </template>
        </DropDown>
    </transition>

    <!-- <transition name="toggle-group-of-list"> -->
    <!-- <ul :class="{active:groupOfListsToggle}"> -->
    <transition name="toggle-group-of-list">
        <ul v-if="groupOfListsToggle || lists[parentId].toggleChildList">
            <transition-group name="render-list">
                <li @contextmenu.self="openDropDown('childList')" @click="showListTasks"
                    :data-name="childrenList.listName" :data-id="childrenList.id"
                    v-for="childrenList in childrenListsArray" :key="childrenList.id">
                    <p @contextmenu="openDropDown('childList')" :data-name="childrenList.listName"
                        :data-id="childrenList.id">
                        <img :data-name="childrenList.listName" :data-id="childrenList.id"
                            src="@/assets/design-material/icons/menu.png" alt="single-list">
                        <span :data-name="childrenList.listName"
                            :data-id="childrenList.id">{{childrenList.listName}}</span>

                        <span v-if="childrenList.tasks.length > 0" class="tasks-count">
                            {{childrenList.tasks.length}}
                        </span>
                    </p>
                </li>
            </transition-group>
        </ul>
    </transition>
    <!-- </transition> -->

    <PopUp :showPopUp="showPopUp">
        <template #title>
            {{deleteTarget === 'deleteList'?'Delete Child Lists':'Delete Group Of Lists'}}
        </template>

        <template #content>
            {{deleteTarget === 'deleteList'?`Child list: ${selectedChildListName} will be permanently deleted`:`Group of
            list:
            ${listName} will
            be permanently deleted`}}

        </template>

        <template #button>
            <button v-if="deleteTarget === 'deleteGroup'" class="delete" @click="deleteGroup">Delete</button>
            <button v-if="deleteTarget === 'deleteList'" class="delete" @click="deleteList">Delete</button>
            <button class="close" @click="togglePopUp">Cancel</button>
        </template>
    </PopUp>
</template>

<script>
import PopUp from './PopUp.vue'
import DropDown from '../components/DropDown.vue';

import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'
export default {
    name: 'group-of-list',
    props: ['childrenListsArray', 'listName', 'parentId'],
    components: {
        PopUp,
        DropDown
    },
    beforeMount() {
        this.lists.forEach((list) => {
            if (list.listChildren) {
                if (list.listChildren) {
                    this.ReturnGroupOfListsArray.push(list)
                }
            }
        })
    },
    data() {
        return {
            groupOfListsToggle: false,
            listNameRoute: '',
            listIndex: 0,
            dropDownSlots: ['RenameGroup', 'NewList', 'UngroupLists', 'DeleteGroup'],
            dropDownSlotsChildList: ['RenameList', 'MoveListTo', 'DuplicateList', 'DeleteList'],
            toggleDropDown: false,
            showPopUp: false,
            elementDomRect: null,
            parentElementDomRect: null,
            groupOfListId: null,
            groupOfListName: '',
            ungroupListsArray: [],
            showRename: false,
            showChildRename: false,
            newName: '',
            toggleError: false,
            showAddNewList: false,
            newListName: '',
            newListObj: {},
            theColor: '',
            ReturnGroupOfListsArray: [],
            top: null,
            bottom: null,
            left: null,
            selectedChildListId: null,
            selectedChildListName: '',
            DuplicatedList: {},
            deleteTarget: '',
            newChildListName: ''
        }
    },
    computed: {
        ...mapWritableState(allLists, ['lists']),
        showSlotForGroupOfList() {
            if (this.lists[this.groupOfListId].listsArray.length > 0) {
                this.dropDownSlots.splice(3, 1)
                return true
            } else {
                this.dropDownSlots.splice(2, 1)
                return false
            }
        },
        ReturnGroupOfLists() {
            if (this.ReturnGroupOfListsArray.length > 0) {
                return true
            } else {
                return false
            }
        }
    },
    methods: {
        togglePopUp(target) {
            this.showPopUp = !this.showPopUp
            this.toggleDropDown = !this.toggleDropDown
            if (target === 'deleteList') {
                this.deleteTarget = 'deleteList'
            } else {
                this.deleteTarget = 'deleteGroup'
            }
        },
        toggleGroup() {
            if (this.lists[this.parentId].toggleChildList) {
                this.lists[this.parentId].toggleChildList = false
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                this.groupOfListsToggle = false
            } else {
                this.groupOfListsToggle = !this.groupOfListsToggle
            }
        },
        showListTasks() {
            this.listNameRoute = event.target.getAttribute('data-name')
            this.listIndex = event.target.getAttribute('data-id')
            this.teleportToggle = true
            this.$router.push({ name: 'child-list', params: { listId: this.parentId, childId: this.listIndex, closeDescription: false } })
        },
        openDropDown(target) {
            event.preventDefault()

            if (event.target.tagName === 'SPAN' || event.target.tagName === 'P') {
                if (target === 'parentList') {
                    this.groupOfListId = event.target.parentElement.parentElement.getAttribute('data-id')
                    this.groupOfListName = event.target.parentElement.parentElement.getAttribute('data-name')
                    this.elementDomRect = event.target.parentElement.parentElement.getBoundingClientRect()
                } else if (target === 'childList') {
                    if (event.target.tagName === 'P') {
                        this.selectedChildListId = event.target.parentElement.getAttribute('data-id')
                        this.selectedChildListName = event.target.parentElement.getAttribute('data-name')
                        this.elementDomRect = event.target.parentElement.getBoundingClientRect()
                    } else {
                        this.selectedChildListId = event.target.parentElement.parentElement.getAttribute('data-id')
                        this.selectedChildListName = event.target.parentElement.parentElement.getAttribute('data-name')
                        this.elementDomRect = event.target.parentElement.parentElement.getBoundingClientRect()
                    }
                }

            } else if (event.target.tagName === 'IMG') {
                if (target === 'parentList') {
                    this.groupOfListId = event.target.parentElement.parentElement.parentElement.getAttribute('data-id')
                    this.groupOfListName = event.target.parentElement.parentElement.parentElement.getAttribute('data-name')
                    this.elementDomRect = event.target.parentElement.parentElement.parentElement.getBoundingClientRect()
                } else if (target === 'childList') {
                    this.selectedChildListId = event.target.parentElement.parentElement.getAttribute('data-id')
                    this.selectedChildListName = event.target.parentElement.parentElement.getAttribute('data-name')
                    this.elementDomRect = event.target.parentElement.parentElement.getBoundingClientRect()
                }
            } else {
                if (target === 'parentList') {
                    this.groupOfListId = event.target.parentElement.getAttribute('data-id')
                    this.groupOfListName = event.target.parentElement.getAttribute('data-name')
                    this.elementDomRect = event.target.parentElement.getBoundingClientRect()
                } else if (target === 'childList') {
                    this.selectedChildListId = event.target.getAttribute('data-id')
                    this.selectedChildListName = event.target.getAttribute('data-name')
                    this.elementDomRect = event.target.getBoundingClientRect()
                }
            }

            if (target === 'parentList') {
                this.theColor = target
                this.parentElementDomRect = this.$refs.groupOfLists.parentElement.parentElement.getBoundingClientRect()


                this.toggleDropDown = !this.toggleDropDown
                if (this.elementDomRect.top - this.parentElementDomRect.top > 150 && this.elementDomRect.top - this.parentElementDomRect.top < 160) {
                    this.top = this.elementDomRect.top - this.parentElementDomRect.top - 200
                } else if (this.elementDomRect.top - this.parentElementDomRect.top > 160) {
                    this.top = this.elementDomRect.top - this.parentElementDomRect.top - 127
                } else {
                    this.top = this.elementDomRect.top - this.parentElementDomRect.top + 41
                }
                this.left = 38.5
            } else if (target === 'childList') {
                this.parentElementDomRect = this.$refs.groupOfLists.getBoundingClientRect()
                this.theColor = target
                this.toggleDropDown = !this.toggleDropDown
                this.left = 38.5
                this.top = 200
                if (this.elementDomRect.top - this.parentElementDomRect.top > 150 && this.elementDomRect.top - this.parentElementDomRect.top < 160) {
                    this.top = this.elementDomRect.top - this.parentElementDomRect.top - 200
                } else if (this.elementDomRect.top - this.parentElementDomRect.top > 160) {
                    this.top = this.elementDomRect.top - this.parentElementDomRect.top - 170
                } else {
                    this.top = this.elementDomRect.top - this.parentElementDomRect.top + 45
                }
            }

        },
        closeDropDown() {
            this.toggleDropDown = false
        },
        deleteGroup() {
            this.lists.splice(this.groupOfListId, 1)

            this.lists.forEach((list, index) => {
                if (index >= this.groupOfListId) {
                    list.id = list.id - 1
                }
            })

            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))

            this.toggleDropDown = false
            this.showPopUp = !this.showPopUp
            this.groupOfListId = null
        },
        ungroupLists() {
            this.lists[this.groupOfListId].listsArray.forEach((childList, index, arr) => {
                childList.id = +this.groupOfListId + index
                this.ungroupListsArray.push(childList)

                if (index + 1 === arr.length) {
                    this.lists.splice(this.groupOfListId, 0, ...this.ungroupListsArray)
                    this.lists.splice(+this.groupOfListId + arr.length, 1)

                    this.lists.forEach((list, index) => {

                        if (index >= +this.groupOfListId + arr.length - 2) {
                            list.id = index
                        }
                    })
                    localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                    this.ungroupListsArray = []
                }
            })
        },
        renameGroup() {
            this.showRename = !this.showRename
            this.newName = this.listName
            // this.$refs.inputFiled.focus()
        },
        addNewList() {
            this.showAddNewList = !this.showAddNewList
        },
        newGroupName() {
            if (this.newName.length > 0) {
                this.lists[this.groupOfListId].listName = this.newName
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
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
        newChildList() {
            if (this.newListName.length > 0) {
                this.newListObj.listName = this.newListName
                this.newListObj.id = this.lists[this.groupOfListId].listsArray.length
                this.newListObj.listChildren = false
                this.newListObj.tasks = []

                this.lists[this.groupOfListId].listsArray.push(this.newListObj)

                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))


                this.newListName = ''
                this.showAddNewList = !this.showAddNewList
                this.toggleDropDown = !this.toggleDropDown
                this.newListObj = {}
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
        closeRename() {
            this.showRename = !this.showRename
            this.newName = ''
        },
        closeNewList() {
            this.showAddNewList = !this.showAddNewList
            this.newName = ''
        },
        deleteList() {
            this.lists[this.parentId].listsArray.splice(this.selectedChildListId, 1)
            this.lists[this.parentId].listsArray.forEach((list, index) => {
                if (index >= this.selectedChildListId) {
                    list.id = list.id - 1
                }
            })

            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))

            this.toggleDropDown = false
            this.showPopUp = !this.showPopUp
            this.selectedChildListId = null
        },
        DuplicateList() {
            this.DuplicatedList.listName = this.lists[this.parentId].listsArray[this.selectedChildListId].listName + ' copy'
            this.DuplicatedList.id = +this.selectedChildListId + 1
            this.DuplicatedList.listChildren = this.lists[this.parentId].listsArray[this.selectedChildListId].listChildren
            this.DuplicatedList.tasks = this.lists[this.parentId].listsArray[this.selectedChildListId].tasks
            this.lists[this.parentId].listsArray.splice(+this.selectedChildListId + 1, 0, this.DuplicatedList)
            this.lists[this.parentId].listsArray.forEach(((list, index) => {
                if (+this.selectedChildListId + 1 <= index) {
                    list.id = index
                }
            }))

            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))

            this.toggleDropDown = false
            this.DuplicatedList = {}
            this.selectedChildListId = ''
        },
        closeChildRename() {
            this.showChildRename = !this.showChildRename
        },
        renameChildList() {
            this.showChildRename = !this.showChildRename
            console.log(this.selectedChildListName);
            this.newChildListName = this.selectedChildListName
            console.log(this.showChildRename);
        },
        newChildListNameFun() {
            if (this.newChildListName.length > 0) {
                if (!!this.descriptionTaskChildList) {
                    this.lists[this.parentId].listsArray[this.selectedChildListId] = this.newChildListName
                } else {
                    this.lists[this.parentId].listsArray[this.selectedChildListId].listName = this.newChildListName
                }
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
                this.newChildListName = ''
                this.showChildRename = !this.showChildRename
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
    },
    watch: {
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
    }
}
</script>