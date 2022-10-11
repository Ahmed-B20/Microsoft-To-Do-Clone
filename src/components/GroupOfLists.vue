<template>
    <div ref="groupOfLists" tabindex="0" @blur="closeDropDown" @contextmenu="openDropDown" @click="toggleGroup" class="group-of-lists-controller">
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
                        <span @click="renameList">Rename Task</span>
                    </template>
                </div>
            </template>

            <template #NewList>
                <div @click="MoveListTo">
                    <img src="@/assets/design-material/icons/curve-arrow.png" alt="">
                    <span>Move list to...</span>
                </div>
            </template>

            <template #UngroupLists>
                <div @click="DuplicateList">
                    <img src="@/assets/design-material/icons/copy.png" alt="">
                    <span>Duplicate list</span>
                </div>
            </template>

            <template #DeleteGroup>
                <div @click="togglePopUp">
                    <img src="@/assets/design-material/icons/delete.png" alt="">
                    <span>Delete list</span>
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
</template>

<script>
import PopUp from './PopUp.vue'
import DropDown from '../components/DropDown.vue';

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
        }
    },
    beforeMount() {
        // console.log(this.listName);
    },
    methods: {
        toggleGroup() {
            this.groupOfListsToggle = !this.groupOfListsToggle
        },
        showListTasks() {
            this.listNameRoute = event.target.getAttribute('data-name')
            this.listIndex = event.target.getAttribute('data-id')
            this.teleportToggle = true
            console.log(this.parentId, this.listIndex);
            this.$router.push({ name: 'child-list', params: { listId: this.parentId, childId: this.listIndex, closeDescription: false } })

            // console.log(this.listIndex);
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
                console.log(event.target.parentElement);
                this.groupOfListId = event.target.parentElement.getAttribute('data-id')
                this.groupOfListName = event.target.parentElement.getAttribute('data-name')

                this.elementDomRect = event.target.parentElement.getBoundingClientRect()
            }
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
        }
    }
}
</script>