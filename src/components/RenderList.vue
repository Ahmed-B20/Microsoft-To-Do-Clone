<template>
    <transition name="render-list">
        <div class="lists-parent">
            <ul ref="listParent" class="lists-container">
                <transition-group name="render-list">
                    <li @contextmenu.self="openDropDown" @click.self="showListTasks" v-for="(list,index) in lists"
                        :data-name="list.listName" :data-id="index" :key="list.id"
                        :class='[ list.listChildren ? "group-of-lists" : "single-list"]'>


                        <template v-if="list.listChildren">
                            <GroupOfLists :childrenListsArray='list.listsArray' :listName="list.listName"
                                :parentId="list.id" />
                        </template>

                        <p @click="showListTasks" @contextmenu="openDropDown" v-else>
                            <img src="@/assets/design-material/icons/menu.png" alt="single-list">
                            <span>{{list.listName}}</span>

                            <span class="tasks-count" v-if="!list.listChildren && list.tasks.length > 0">
                                {{list.tasks.length}}
                            </span>
                        </p>
                    </li>
                </transition-group>

                <transition name="to-bottom">
                    <DropDown :dropDownSlots="dropDownSlots" :top="top" :left="left" v-if="toggleDropDown">
                        <template #RenameList>
                            <div class="renameList" @click.self="renameList">
                                <template v-if="showRename">
                                    <img @click="newListName" class="renameTask" :class="{ active: itemDetect }"
                                        src="@/assets/design-material/icons/plus.png" alt="add-item" />
                                    <input @keyup.enter="newListName" required @focus="toggleErrorClass"
                                        v-model="newName" placeholder="New Name" type="text" name="" id=""
                                        :class="{error:toggleError}" />
                                    <img @click="closeRename" src="@/assets/design-material/icons/close.png"
                                        alt="close rename" />
                                </template>

                                <template v-else>
                                    <img @click="renameList" src="@/assets/design-material/icons/rename.png"
                                        alt="rename task" />
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

                        <template #DuplicateList>
                            <div @click="DuplicateList">
                                <img src="@/assets/design-material/icons/copy.png" alt="">
                                <span>Duplicate list</span>
                            </div>
                        </template>

                        <template #DeleteList>
                            <div class="delete" @click="togglePopUp('delete')">
                                <img src="@/assets/design-material/icons/delete.png" alt="">
                                <span>Delete list</span>
                            </div>
                        </template>
                    </DropDown>
                </transition>
            </ul>
        </div>
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

    <!-- <teleport v-if="teleportToggle" to='.view-content-container'>
        <content-view>
            <template v-slot:title>
                {{listName}}
            </template>

            <template v-slot:allTask>
                <li v-for="(index, task) in allTasks" :key="index">{{task}}</li>
            </template>
        </content-view>
    </teleport> -->

</template>

<script>

import ContentView from './ContentView.vue';
import GroupOfLists from './GroupOfLists.vue';
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

import PopUp from './PopUp.vue'
import DropDown from '../components/DropDown.vue';

export default {
    name: 'render-list',
    components: {
        GroupOfLists,
        ContentView,
        PopUp,
        DropDown
    },
    beforeMount() {
        this.assignArrayOfLists
    },
    data() {
        return {
            arrayOfLists: [],
            teleportToggle: false,
            listName: '',
            listIndex: 0,
            allTasks: [],
            closeDescription: false,
            dropDownSlots: ['RenameList', 'MoveListTo', 'DuplicateList', 'DeleteList'],
            toggleDropDown: false,
            showPopUp: false,
            listId: null,
            listName: '',
            DuplicatedList: {},
            elementDomRect: null,
            parentElementDomRect: null,
            showRename: false,
            newName: '',
            toggleError: false,
            ReturnGroupOfListsArray: [],
            moveGroupListToggle: false,
            target: '',
            oldListId: null
        }
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
    computed: {
        ...mapState(allLists, ['returnLists']),
        ...mapWritableState(allLists, ['lists']),
        ReturnGroupOfLists() {
            if (this.ReturnGroupOfListsArray.length > 0) {
                return true
            } else {
                return false
            }
        }
    },
    methods: {
        openDropDown() {
            this.parentElementDomRect = this.$refs.listParent.getBoundingClientRect()
            if (event.target.tagName === 'SPAN' || event.target.tagName === 'IMG') {
                this.listId = event.target.parentElement.parentElement.getAttribute('data-id')
                this.listName = event.target.parentElement.parentElement.getAttribute('data-name')

                this.elementDomRect = event.target.parentElement.parentElement.getBoundingClientRect()
            } else if (event.target.tagName === 'P') {
                this.listId = event.target.parentElement.getAttribute('data-id')
                this.listName = event.target.parentElement.getAttribute('data-name')

                this.elementDomRect = event.target.parentElement.getBoundingClientRect()
            } else {
                this.listId = event.target.getAttribute('data-id')
                this.listName = event.target.getAttribute('data-name')

                this.elementDomRect = event.target.getBoundingClientRect()
            }
            event.preventDefault()
            this.toggleDropDown = !this.toggleDropDown
            if (this.elementDomRect.top - this.parentElementDomRect.top > 150 && this.elementDomRect.top - this.parentElementDomRect.top < 160) {
                this.top = this.elementDomRect.top - this.parentElementDomRect.top - 200
            } else if (this.elementDomRect.top - this.parentElementDomRect.top > 160) {
                this.top = this.elementDomRect.top - this.parentElementDomRect.top - 160
            } else {
                this.top = this.elementDomRect.top - this.parentElementDomRect.top + 41
            }

            this.left = 38.5

            if (this.toggleDropDown) {
                this.oldListId = this.listId
                console.log(this.oldListId);
            } else {
                if (+this.oldListId != +this.listId) {
                    this.toggleDropDown = false

                    this.oldListId = this.listId
                    this.showRename = false

                    setTimeout(() => {
                        this.toggleDropDown = true
                    }, 0)
                    console.log(+this.oldListId, +this.listId);
                }
            }
        },
        closeDropDown() {
            this.toggleDropDown = false
            this.moveGroupListToggle = false
        },
        togglePopUp(target) {
            if (target === 'move') {
                this.moveGroupListToggle = !this.moveGroupListToggle
                this.showPopUp = !this.showPopUp
                this.target = 'move'
            } else {
                this.showPopUp = !this.showPopUp
                this.target = 'delete'
            }
            this.toggleDropDown = !this.toggleDropDown
        },
        closePopUp() {
            this.showRename = false
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
            this.listId = null

            this.$router.push({ name: 'list', params: { listId: 0 } })
            // this.$router.push({ name: 'list', params: { listId: 0, closeDescription: false } })
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
        showListTasks() {
            this.toggleDropDown = false
            if (event.target.tagName === 'LI' && event.target.classList.contains("single-list")) {
                this.listName = event.target.getAttribute('data-name')
                this.listIndex = event.target.getAttribute('data-id')
                // this.$router.push({ name: 'list', params: { listId: this.listIndex, closeDescription: false } })
                this.$router.push({ name: 'list', params: { listId: this.listIndex } })
            } else if (event.target.tagName === 'P' && event.target.parentElement.classList.contains("single-list")) {
                this.listName = event.target.parentElement.getAttribute('data-name')
                this.listIndex = event.target.parentElement.getAttribute('data-id')
                // this.$router.push({ name: 'list', params: { listId: this.listIndex, closeDescription: false } })
                this.$router.push({ name: 'list', params: { listId: this.listIndex } })
            } else if (event.target.tagName === 'SPAN' || event.target.tagName === 'IMG' || event.target.parentElement.parentElement.classList.contains("single-list")) {
                this.listName = event.target.parentElement.parentElement.getAttribute('data-name')
                this.listIndex = event.target.parentElement.parentElement.getAttribute('data-id')
                // this.$router.push({ name: 'list', params: { listId: this.listIndex, closeDescription: false } })
                this.$router.push({ name: 'list', params: { listId: this.listIndex } })
            }
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
            this.toggleDropDown = !this.toggleDropDown
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
            this.listId = null
            this.moveGroupListToggle = !this.moveGroupListToggle
        }
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