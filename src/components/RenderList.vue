<template>
    <transition name="render-list">
        <div class="lists-parent">
            <ul ref="listParent" class="lists-container">
                <transition-group name="render-list">
                    <li @contextmenu.self="openDropDown(list, index)" @click.self="showListTasks(list, index)"
                        v-for="(list,index) in lists" :key="list.id"
                        :class='[ list.listChildren ? "group-of-lists" : "single-list"]'>


                        <template v-if="list.listChildren">
                            <GroupOfLists :childrenListsArray='list.listsArray' :listName="list.listName"
                                :parentId="list.id" @closeParentDropDown="closeDropDown"
                                :childDropDown="childDropDown" />
                        </template>

                        <p @click="showListTasks(list, index)" @contextmenu="openDropDown(list, index)" v-else>
                            <img src="@/assets/design-material/icons/menu.png" alt="single-list">
                            <span>{{ list.listName }}</span>

                            <span class="tasks-count" v-if="!list.listChildren && list.tasks.length > 0">
                                {{ list.tasks.length }}
                            </span>
                        </p>
                    </li>
                </transition-group>

                <transition name="to-bottom">
                    <DropDown :dropDownSlots="dropDownSlots" :top="top" :left="left" v-if="toggleDropDown">
                        <template #RenameList>
                            <div class="renameList" @click.self="renameList">
                                <template v-if="showRename">
                                    <img @click="newListName" class="renameTask"
                                        src="@/assets/design-material/icons/plus.png" alt="add-item" />

                                    <input @keyup.enter="newListName" required @focus="toggleErrorClass"
                                        v-model="newName" placeholder="New Name" type="text" name="" id=""
                                        :class="{ error: toggleError }" />
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
            {{ target === 'move' ? 'Move List' : 'Delete List' }}
        </template>

        <template v-slot:content>
            <div v-if="moveGroupListToggle" class="select-parent">
                <select ref="selectedGroupOfList" name="" id="">
                    <option v-for="(groupOfList, index) in ReturnGroupOfListsArray" :key="index"
                        :value="groupOfList.id">
                        {{ groupOfList.listName }}
                    </option>
                </select>
            </div>
            <p v-else>
                list {{ listName }} will be permanently deleted
            </p>
        </template>

        <template #button>
            <button v-if="moveGroupListToggle" class="move" @click="MoveListTo">Move</button>
            <button v-else class="delete" @click="deleteList">Delete</button>
            <button class="close" @click="closePopUp">Cancel</button>
        </template>
    </PopUp>
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
            oldListId: null,
            result: '',
            characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            charactersLength: 0,
            listElement: '',
            top: 0,
            childDropDown: 'true',
            childDropDownValue: false
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
        },
        itemDetect() {
            if (this.newName.length > 0) {
                return true;
            } else {
                return false;
            }
        }
    },
    methods: {
        openDropDown(list, index) {
            this.parentElementDomRect = this.$refs.listParent.getBoundingClientRect()
            this.listId = index
            this.listName = list.listName

            if (event.target.tagName === 'SPAN' || event.target.tagName === 'IMG') {
                this.elementDomRect = event.target.parentElement.parentElement.getBoundingClientRect()
                this.listElement = event.target.parentElement.parentElement
            } else if (event.target.tagName === 'P') {
                this.elementDomRect = event.target.parentElement.getBoundingClientRect()
                this.listElement = event.target.parentElement
            } else {
                this.elementDomRect = event.target.getBoundingClientRect()
                this.listElement = event.target
            }
            event.preventDefault()
            this.toggleDropDown = !this.toggleDropDown

            if (this.elementDomRect.top - this.parentElementDomRect.top < 200) {
                this.top = this.elementDomRect.top - this.parentElementDomRect.top + 42
            } else {
                this.top = this.elementDomRect.top - this.parentElementDomRect.top + 42
            }

            this.listElement.scrollIntoView()

            this.left = 38.5

            if (this.toggleDropDown) {
                this.oldListId = index
                this.childDropDown = false
            } else {
                if (!this.childDropDownValue) {
                    this.childDropDown = false
                } else {
                    this.childDropDown = true
                }

                if (+this.oldListId !== index) {
                    this.toggleDropDown = false
                    this.oldListId = index
                    this.showRename = false

                    setTimeout(() => {
                        this.toggleDropDown = true
                    }, 0)
                }
            }

        },
        closeDropDown(value) {
            this.childDropDownValue = value
            this.toggleDropDown = false
            this.moveGroupListToggle = false
            this.childDropDown = true
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
            this.showPopUp = false
            this.toggleDropDown = false
            this.moveGroupListToggle = false
            this.target = ''
        },
        deleteList() {
            if (this.lists.length === 1) {
                this.$router.push({ name: 'my-day' })
            }

            this.lists.splice(this.listId, 1)
            this.lists.forEach((list, index) => {
                if (index >= this.listId) {
                    list.id = list.id - 1
                }
            })

            if (this.lists.length > 1 && !this.lists.at(0).listChildren) {
                if (+this.listId > +this.$route.params.listId && +this.$route.params.listId !== 0) {
                    if (!!this.$route.params.childId) {
                        this.$router.push({ name: 'child-list', params: { listId: this.$route.params.listId, childId: this.$route.params.childId }, props: { name: this.randomString(10), currentListName: this.listName } })
                    } else {
                        this.$router.push({ name: 'list', params: { listId: +this.$route.params.listId }, props: { name: this.randomString(10), currentListName: this.listName } })
                    }
                } else if (+this.$route.params.listId >= +this.listId && +this.$route.params.listId !== 0) {
                    if (!!this.$route.params.childId) {
                        this.$router.push({ name: 'child-list', params: { listId: this.$route.params.listId - 1, childId: this.$route.params.childId }, props: { name: this.randomString(10), currentListName: this.listName } })
                    } else {
                        this.$router.push({ name: 'list', params: { listId: this.$route.params.listId - 1 }, props: { name: this.randomString(10), currentListName: this.listName } })
                    }
                } else {
                    if (!!this.$route.params.childId) {
                        this.$router.push({ name: 'child-list', params: { listId: this.$route.params.listId, childId: this.$route.params.childId }, props: { name: this.randomString(10), currentListName: this.listName } })
                    } else {
                        this.$router.push({ name: 'list', params: { listId: this.$route.params.listId }, props: { name: this.randomString(10), currentListName: this.listName } })
                    }
                }
            } else {
                this.$router.push({ name: 'my-day' })
            }

            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))

            this.toggleDropDown = false
            this.showPopUp = !this.showPopUp
            this.listId = null
        },
        randomString(length) {
            this.charactersLength = this.characters.length
            for (var i = 0; i < length; i++) {
                this.result += this.characters.charAt(Math.floor(Math.random() * this.charactersLength));
            }
            return this.result
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
        showListTasks(list, index) {
            this.toggleDropDown = false

            this.listName = list.listName
            this.listIndex = index
            this.$router.push({ name: 'list', params: { listId: this.listIndex } })
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