<template>
    <transition name="render-list">
        <dev class="lists-parent">
            <ul tabindex="0" @blur.capture="closeDropDown" ref="listParent" class="lists-container">
                <transition-group name="render-list">
                    <li @contextmenu.self="openDropDown" @click.self="showListTasks" v-for="(list,index) in lists"
                        :data-name="list.listName" :data-id="index" :key="list.id"
                        :class='[ list.listChildren ? "group-of-lists" : "single-list"]'>


                        <template v-if="list.listChildren">
                            <GroupOfLists :childrenListsArray='list.listsArray' :listName="list.listName"
                                :parentId="list.id" />
                        </template>

                        <p @contextmenu="openDropDown" v-else>
                            <img src="@/assets/design-material/icons/menu.png" alt="single-list">
                            <span>{{list.listName}}</span>

                            <span class="tasks-count" v-if="!list.listChildren">
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
                                    <span @click="renameList">Rename Task</span>
                                </template>
                            </div>
                        </template>

                        <template #MoveListTo>
                            <div @click="MoveListTo">
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
                            <div @click="togglePopUp">
                                <img src="@/assets/design-material/icons/delete.png" alt="">
                                <span>Delete list</span>
                            </div>
                        </template>
                    </DropDown>
                </transition>
            </ul>
        </dev>
    </transition>

    <PopUp :showPopUp="showPopUp">
        <template #title>
            Delete List
        </template>

        <template #content>
            list {{listName}} will be permanently deleted
        </template>

        <template #button>
            <button class="delete" @click="deleteList">Delete</button>
            <button class="close" @click="togglePopUp">Cancel</button>
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
        }
    },
    computed: {
        ...mapState(allLists, ['returnLists']),
        ...mapWritableState(allLists, ['lists']),
    },
    methods: {
        openDropDown() {
            console.log(event.target);
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
                console.log('6');

            } else if (this.elementDomRect.top - this.parentElementDomRect.top > 160) {
                this.top = this.elementDomRect.top - this.parentElementDomRect.top - 160
                console.log('5');
            } else {
                this.top = this.elementDomRect.top - this.parentElementDomRect.top + 41
            }

            console.log(this.elementDomRect);
            console.log(this.parentElementDomRect);

            this.left = 38.5
        },
        closeDropDown() {
            this.toggleDropDown = false
        },
        togglePopUp() {
            this.showPopUp = !this.showPopUp
        },
        deleteList() {
            console.log(this.listId);
            console.log(this.lists);
            this.lists.splice(this.listId, 1)

            this.lists.forEach((list, index) => {
                if (index >= this.listId) {
                    list.id = list.id - 1
                    console.log(list.id);
                }
            })

            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))

            this.toggleDropDown = false
            this.showPopUp = !this.showPopUp
            this.listId = null
        },
        DuplicateList() {
            this.DuplicatedList.listName = this.lists[this.listId].listName + ' copy'
            // this.DuplicatedList.id = this.lists[this.listId].id + 1

            this.DuplicatedList.id = this.lists.length
            this.DuplicatedList.listChildren = this.lists[this.listId].listChildren

            this.DuplicatedList.tasks = this.lists[this.listId].tasks

            console.log(this.listId);

            console.log(this.DuplicatedList);
            // this.lists.splice(this.listId + 1, 0, this.DuplicatedList)

            this.lists.push(this.DuplicatedList)

            console.log(this.lists);

            // this.lists.forEach(((list, index) => {
            //     if (this.lists[this.listId].id + 1 === index) {
            //         list.id += 1
            //     }
            // }))

            localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))

            this.toggleDropDown = false
            this.DuplicatedList = {}
        },
        showListTasks() {
            this.toggleDropDown = false

            console.log('fgfg');

            if (event.target.tagName === 'LI' && event.target.classList.contains("single-list")) {
                this.listName = event.target.getAttribute('data-name')
                this.listIndex = event.target.getAttribute('data-id')
                this.$router.push({ name: 'list', params: { listId: this.listIndex, closeDescription: false } })
            } else if (event.target.tagName === 'P' && event.target.parentElement.classList.contains("single-list")) {
                this.listName = event.target.parentElement.getAttribute('data-name')
                this.listIndex = event.target.parentElement.getAttribute('data-id')
                this.$router.push({ name: 'list', params: { listId: this.listIndex, closeDescription: false } })
            } else if (event.target.parentElement.parentElement.classList.contains("single-list")) {
                this.listName = event.target.parentElement.parentElement.getAttribute('data-name')
                this.listIndex = event.target.parentElement.parentElement.getAttribute('data-id')
                this.$router.push({ name: 'list', params: { listId: this.listIndex, closeDescription: false } })
            }


            if (!!this.listIndex) {
                // this.allTasks = this.returnLists[this.listIndex].tasks


                // this.teleportToggle = true
                console.log('gkj');

                // this.$router.push({ name: 'list', params: { listId: this.listIndex } })
            } else {
                // console.log(event.target.parentElement);
            }
        },
        closeRename() {
            this.showRename = !this.showRename
        },
        renameList() {
            this.showRename = !this.showRename
            // this.$refs.listParent.addEventListener('blur', () => {
            //     event.preventDefault()
            //     console.log('fff');
            // })

            // this.toggleDropDown = true
        },
        newListName() {
            if (this.newName.length > 0) {
                if (!!this.descriptionTaskChildList) {
                    this.lists[this.descriptionTaskList].listsArray[this.descriptionTaskChildList].listName = this.newName
                } else {
                    this.lists[this.listId].listName = this.newName
                }
                localStorage.setItem("allListAndTasks", JSON.stringify(this.lists))

                console.log('ww');

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
    }
}
</script>