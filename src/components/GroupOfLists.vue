<template>
    <!-- tabindex="0" @blur="closeDropDown" -->
    <div ref="groupOfLists" @contextmenu="openDropDown" @click="toggleGroup" class="group-of-lists-controller">
        <p>
            <img src="@/assets/design-material/icons/tab.png" alt="single-list">
            {{listName}}
        </p>
        <span class="toggle">
            <img src="@/assets/design-material/icons/arrow-down-sign-to-navigate.png" alt="arrow-down-sign-to-navigate">
        </span>
    </div>

    <transition name="to-bottom">
        <DropDown :dropDownSlots="dropDownSlots" :top="top" :left="left" v-if="toggleDropDown">
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
                <div @click="togglePopUp">
                    <img src="@/assets/design-material/icons/delete.png" alt="">
                    <span>Delete group</span>
                </div>
            </template>
        </DropDown>
    </transition>

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

    <PopUp :showPopUp="showPopUp">
        <template #title>
            Delete Group Of Lists
        </template>

        <template #content>
            Group of list: {{listName}} will be permanently deleted
        </template>

        <template #button>
            <button class="delete" @click="deleteGroup">Delete</button>
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
    data() {
        return {
            groupOfListsToggle: false,
            listNameRoute: '',
            listIndex: 0,
            dropDownSlots: ['RenameGroup', 'NewList', 'UngroupLists', 'DeleteGroup'],
            toggleDropDown: false,
            showPopUp: false,
            elementDomRect: null,
            parentElementDomRect: null,
            groupOfListId: null,
            groupOfListName: '',
            ungroupListsArray: [],
            showRename: false,
            newName: '',
            toggleError: false,
            showAddNewList: false,
            newListName: '',
            newListObj: {}
        }
    },
    computed: {
        ...mapWritableState(allLists, ['lists']),
        showSlotForGroupOfList() {
            if (this.lists[this.groupOfListId].listsArray.length > 0) {
                return true
            } else {
                return false
            }
        }
    },
    methods: {
        togglePopUp() {
            this.showPopUp = !this.showPopUp
        },
        toggleGroup() {
            this.groupOfListsToggle = !this.groupOfListsToggle
        },
        showListTasks() {
            this.listNameRoute = event.target.getAttribute('data-name')
            this.listIndex = event.target.getAttribute('data-id')
            this.teleportToggle = true
            this.$router.push({ name: 'child-list', params: { listId: this.parentId, childId: this.listIndex, closeDescription: false } })
        },
        openDropDown() {
            event.preventDefault()

            this.parentElementDomRect = this.$refs.groupOfLists.parentElement.parentElement.getBoundingClientRect()
            if (event.target.tagName === 'SPAN' || event.target.tagName === 'P') {
                this.groupOfListId = event.target.parentElement.parentElement.getAttribute('data-id')
                this.groupOfListName = event.target.parentElement.parentElement.getAttribute('data-name')

                this.elementDomRect = event.target.parentElement.parentElement.getBoundingClientRect()
            } else if (event.target.tagName === 'IMG') {
                this.groupOfListId = event.target.parentElement.parentElement.parentElement.getAttribute('data-id')
                this.groupOfListName = event.target.parentElement.parentElement.parentElement.getAttribute('data-name')

                this.elementDomRect = event.target.parentElement.parentElement.parentElement.getBoundingClientRect()
            } else {
                this.groupOfListId = event.target.parentElement.getAttribute('data-id')
                this.groupOfListName = event.target.parentElement.getAttribute('data-name')

                this.elementDomRect = event.target.parentElement.getBoundingClientRect()
            }
            this.toggleDropDown = !this.toggleDropDown
            if (this.elementDomRect.top - this.parentElementDomRect.top > 150 && this.elementDomRect.top - this.parentElementDomRect.top < 160) {
                this.top = this.elementDomRect.top - this.parentElementDomRect.top - 200
            } else if (this.elementDomRect.top - this.parentElementDomRect.top > 160) {
                this.top = this.elementDomRect.top - this.parentElementDomRect.top - 120
            } else {
                this.top = this.elementDomRect.top - this.parentElementDomRect.top + 41
            }
            this.left = 38.5
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
        }
    }
}
</script>