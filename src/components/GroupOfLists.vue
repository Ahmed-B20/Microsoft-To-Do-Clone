<template>
    <!-- tabindex="0" @blur="closeDropDown" -->
    <div ref="groupOfLists" @contextmenu="openDropDown('parentList')" @click="toggleGroup"
        class="group-of-lists-controller">
        <p>
            <img src="@/assets/design-material/icons/tab.png" alt="single-list">
            {{ listName }}
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
                            placeholder="New Name" type="text" name="" id="" :class="{ error: toggleError }" />
                        <img @click="closeRename" src="@/assets/design-material/icons/close.png" alt="close rename" />
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
                            placeholder="New Name" type="text" name="" id="" :class="{ error: toggleError }" />
                        <img @click="closeNewList" src="@/assets/design-material/icons/close.png" alt="close rename" />
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
                        <input @keyup.enter="newChildListNameFun" required @focus="toggleErrorClass"
                            v-model="newChildListName" placeholder="New Name" type="text" name="" id=""
                            :class="{ error: toggleError }" />
                        <img @click="closeChildRename" src="@/assets/design-material/icons/close.png"
                            alt="close rename" />
                    </template>

                    <template v-else>
                        <img @click="renameChildList" src="@/assets/design-material/icons/rename.png"
                            alt="rename task" />
                        <span @click="renameChildList">Rename Child List</span>
                    </template>
                </div>
            </template>

            <template #PromoteToList>
                <div @click="PromoteToList">
                    <img src="@/assets/design-material/icons/plus.png" alt="">
                    <span>Promote to list</span>
                </div>
            </template>

            <template #MoveListTo v-if="ReturnGroupOfLists">
                <div @click="togglePopUp('move')">
                    <img src="@/assets/design-material/icons/curve-arrow.png" alt="">
                    <span>Move Child list to...</span>
                </div>
            </template>

            <template #DuplicateList>
                <div @click="DuplicateList">
                    <img src="@/assets/design-material/icons/copy.png" alt="">
                    <span>Duplicate Child list</span>
                </div>
            </template>

            <template #DeleteList>
                <div class="delete" @click="togglePopUp('deleteList')">
                    <img src="@/assets/design-material/icons/delete.png" alt="">
                    <span>Delete Child list</span>
                </div>
            </template>
        </DropDown>
    </transition>

    <!-- <transition name="toggle-group-of-list"> -->
    <!-- <ul :class="{active:groupOfListsToggle}"> -->
    <transition name="toggle-group-of-list">
        <ul v-if="groupOfListsToggle || lists[parentId].toggleChildList">
            <transition-group name="render-list">
                <li @contextmenu.self="openDropDown('childList')" @click="showChildListTasks"
                    :data-name="childrenList.listName" :data-id="childrenList.id"
                    v-for="childrenList in childrenListsArray" :key="childrenList.id">
                    <p @contextmenu="openDropDown('childList')" :data-name="childrenList.listName"
                        :data-id="childrenList.id">
                        <img :data-name="childrenList.listName" :data-id="childrenList.id"
                            src="@/assets/design-material/icons/menu.png" alt="single-list">
                        <span :data-name="childrenList.listName"
                            :data-id="childrenList.id">{{ childrenList.listName }}</span>

                        <span v-if="childrenList.tasks.length > 0" class="tasks-count">
                            {{ childrenList.tasks.length }}
                        </span>
                    </p>
                </li>
            </transition-group>
        </ul>
    </transition>
    <!-- </transition> -->

    <PopUp :showPopUp="showPopUp">
        <template #title>
            {{ togglePopupTarget === 'deleteList' ? `Delete Child Lists` : togglePopupTarget === 'deleteGroup' ? `Delete Group
                        Of Lists`: `Move Child List To`
            }}
        </template>

        <template #content>
            <div v-if="togglePopupTarget === 'move'" class="select-parent">
                <select ref="selectedLists" name="" id="">
                    <option v-for="(groupOfList, index) in ReturnGroupOfListsArray" :key="index"
                        :value="groupOfList.id">
                        {{ groupOfList.listName }}
                    </option>
                </select>
            </div>

            <p v-else>
                {{ togglePopupTarget === 'deleteList' ? `Child list: ${selectedChildListName} will be permanently
                                deleted`: `Group of list: ${listName} will be permanently deleted`
                }}
            </p>
        </template>

        <template #button>
            <button v-if="togglePopupTarget === 'deleteGroup'" class="delete" @click="deleteGroup">Delete</button>
            <button v-if="togglePopupTarget === 'deleteList'" class="delete" @click="deleteList">Delete</button>
            <button v-if="togglePopupTarget === 'move'" class="move" @click="MoveChildListTo">Move</button>
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
        this.lists.forEach((list, index) => {
            if (list.listChildren) {
                if (index != this.parentId) {
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
            dropDownSlotsChildList: ['RenameList', 'PromoteToList', 'MoveListTo', 'DuplicateList', 'DeleteList'],
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
            togglePopupTarget: '',
            newChildListName: '',
            promoteList: {},
            oldChildListId: null
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
                this.dropDownSlotsChildList = ['RenameList', 'PromoteToList', 'MoveListTo', 'DuplicateList', 'DeleteList']
                return true
            } else {
                this.dropDownSlotsChildList = ['RenameList', 'PromoteToList', 'DuplicateList', 'DeleteList']
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
        togglePopUp(target) {
            this.showPopUp = !this.showPopUp
            this.toggleDropDown = !this.toggleDropDown
            if (target === 'deleteList') {
                this.togglePopupTarget = 'deleteList'
            } else if (target === 'deleteGroup') {
                this.togglePopupTarget = 'deleteGroup'
            } else {
                this.togglePopupTarget = 'move'
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
        showChildListTasks() {
            this.listNameRoute = event.target.getAttribute('data-name')
            this.listIndex = event.target.getAttribute('data-id')
            this.teleportToggle = true
            this.$router.push({ name: 'child-list', params: { listId: this.parentId, childId: this.listIndex } })
            // this.$router.push({ name: 'child-list', params: { listId: this.parentId, childId: this.listIndex, closeDescription: false } })
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

                if (this.toggleDropDown) {
                    this.oldChildListId = this.groupOfListId
                } else {
                    if (+this.oldChildListId != +this.groupOfListId) {
                        this.toggleDropDown = false

                        this.oldChildListId = this.groupOfListId
                        this.showRename = false

                        setTimeout(() => {
                            this.toggleDropDown = true
                        }, 0)
                    }
                }
            } else if (target === 'childList') {
                this.parentElementDomRect = this.$refs.groupOfLists.parentElement.parentElement.getBoundingClientRect()

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

                if (this.toggleDropDown) {
                    this.oldChildListId = this.selectedChildListId
                } else {
                    if (+this.oldChildListId != +this.selectedChildListId) {
                        this.toggleDropDown = false

                        this.oldChildListId = this.selectedChildListId
                        this.showRename = false

                        setTimeout(() => {
                            this.toggleDropDown = true
                        }, 0)
                    }
                }
            }
        },
        closeDropDown() {
            this.toggleDropDown = false
            this.showRename = false
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
            // this.showRename = !this.showRename
            this.showRename = true
            this.showAddNewList = false

            this.newName = this.listName
            // this.$refs.inputFiled.focus()
        },
        addNewList() {
            // this.showAddNewList = !this.showAddNewList
            this.showAddNewList = true
            this.showRename = false

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
            // this.showRename = !this.showRename
            this.showRename = false
            this.newName = ''
        },
        closeNewList() {
            // this.showAddNewList = !this.showAddNewList
            this.showAddNewList = false
            this.newName = ''
            console.log('ff');
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
            this.newChildListName = this.selectedChildListName
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
        MoveChildListTo() {
            this.lists[this.$refs.selectedLists.value].listsArray.push(this.lists[this.parentId].listsArray[this.selectedChildListId])

            if (this.lists[this.$refs.selectedLists.value].listsArray.length > 0) {
                let index = this.lists[this.$refs.selectedLists.value].listsArray.length - 1
                this.lists[this.$refs.selectedLists.value].listsArray[index].id = this.lists[this.$refs.selectedLists.value].listsArray.length

                this.lists[this.parentId].listsArray.forEach((list, index) => {
                    if (index >= +this.selectedChildListId) {
                        list.id -= 1
                    }
                })
            } else {
                this.lists[this.$refs.selectedLists.value].listsArray[0].id = 0
            }

            this.lists[this.parentId].listsArray.splice(this.selectedChildListId, 1)
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            this.toggleDropDown = false
            this.taskElementId = null
            this.parentElementDomRect = null
            this.showPopUp = !this.showPopUp
            this.moveTaskToggle = !this.moveTaskToggle
        },
        PromoteToList() {
            let list = this.lists[this.parentId].listsArray[this.selectedChildListId]
            this.promoteList.id = this.lists.length
            this.promoteList.listName = list.listName
            this.promoteList.listChildren = false
            this.promoteList.tasks = []

            this.lists[this.parentId].listsArray.splice(this.selectedChildListId, 1)

            this.lists[this.parentId].listsArray.forEach((list, index) => {
                if (index >= +this.selectedChildListId) {
                    list.id -= 1
                }
            })

            this.lists.push(this.promoteList)
            this.promoteList = {}
            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))
            this.toggleDropDown = false
        }
    },
    watch: {
        lists: {
            handler(newValue, oldValue) {
                this.ReturnGroupOfListsArray = []
                this.lists.forEach((list, index) => {
                    if (list.listChildren) {
                        if (index != this.parentId) {
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