<template>
    <div class="add-item-container" :class="{ error: toggleError }">
        <div class="add-item">
            <div class="single-list">
                <span @click="addList">
                    <img :class="{ active: itemDetect }" src="@/assets/design-material/icons/plus.png" alt="add-item" />
                </span>
                <input @keyup.enter="addList" required @focus="toggleErrorClass" v-model="itemValue"
                    placeholder="Add New List" type="text" name="" id="" />
            </div>

            <span @click="addGroupOfList">
                <img ref="addGroupOfList" :class="{ active: itemDetect }" src="@/assets/design-material/icons/add.png"
                    alt="add-group-of-list" />
            </span>
        </div>
    </div>

    <PopUp :showPopUp="showPopUp">
        <template #title>
            Warning Message
        </template>

        <template #content>
            you must at list add one child list to {{ groupOfListsName }}
        </template>

        <template #button>
            <button class="close" @click="togglePopup">Cancel</button>
        </template>
    </PopUp>
</template>
  
<script>
import { allLists } from '@/stores/allLists.js'
import { mapWritableState } from 'pinia'
import PopUp from './PopUp.vue'


export default {
    name: "add-new-item",
    beforeMount: function () {
        if (JSON.parse(localStorage.getItem("allListAndTasks"))) {
            this.allSavedList = JSON.parse(localStorage.getItem("allListAndTasks"));
        }

        this.taskNumber = this.lists.length
    },
    components: {
        PopUp
    },
    data() {
        return {
            itemValue: "",
            listArray: [],
            childListsArray: [],
            childListObj: {},
            toggleListChildren: false,
            listObj: {},
            taskNumber: 0,
            childListId: 0,
            allSavedList: [],
            toggleError: false,
            showPopUp: false,
            groupOfListsName: '',
            childId: 0
        };
    },

    computed: {
        itemDetect() {
            if (this.itemValue.length > 0) {
                return true;
            } else {
                return false;
            }
        },
        ...mapWritableState(allLists, ['lists']),
    },

    methods: {
        togglePopup() {
            this.showPopUp = !this.showPopUp
        },
        addList() {
            if (this.itemValue.length > 0) {
                if (this.toggleListChildren) {
                    this.listObj.listChildren = true;
                    this.listObj.tasks = [];

                    this.childListObj.listName = this.itemValue
                    this.childListObj.id = this.childId
                    this.childListObj.listChildren = false
                    this.childListObj.tasks = [];

                    this.childListsArray.push(this.childListObj)
                    this.listObj.listsArray = this.childListsArray
                    this.childId++

                    // this.listArray = JSON.parse(localStorage.getItem("allListAndTasks")) || [];
                    this.listArray = this.lists;
                    this.listArray.at(-1).listsArray = this.listObj.listsArray
                    localStorage.setItem("allListAndTasks", JSON.stringify(this.listArray));
                    this.lists = JSON.parse(localStorage.getItem("allListAndTasks"))
                } else {
                    this.listObj.listName = this.itemValue;
                    this.listObj.id = this.taskNumber;
                    this.listObj.listChildren = false;
                    this.listObj.tasks = [];

                    // this.listArray = JSON.parse(localStorage.getItem("allListAndTasks")) || [];
                    this.listArray = this.lists;
                    this.listArray.push(this.listObj);
                    localStorage.setItem("allListAndTasks", JSON.stringify(this.listArray));
                    this.lists = JSON.parse(localStorage.getItem("allListAndTasks"))
                    this.taskNumber++;
                }

                if (localStorage.getItem("allListAndTasks")) {
                    this.allSavedList = JSON.parse(
                        localStorage.getItem("allListAndTasks")
                    );
                }

                this.itemValue = "";
                this.listObj = {};
                this.childListObj = {}
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
        toggleErrorClass() {
            this.toggleError = false
        },
        addGroupOfList() {
            if (!this.$refs.addGroupOfList.getAttribute('src').includes('close')) {
                this.groupOfListsName = this.itemValue
            }
            if (this.itemValue.length > 0 && !this.$refs.addGroupOfList.getAttribute('src').includes('close')) {
                this.listObj.listName = this.itemValue;
                this.listObj.id = this.taskNumber;
                this.listObj.listsArray = []
                this.listObj.listChildren = true;
                this.listObj.toggleChildList = true;
                this.toggleListChildren = !this.toggleListChildren

                this.listArray = JSON.parse(localStorage.getItem("allListAndTasks")) || [];
                this.listArray.push(this.listObj);
                localStorage.setItem("allListAndTasks", JSON.stringify(this.listArray));
                this.lists = JSON.parse(localStorage.getItem("allListAndTasks"))

                if (localStorage.getItem("allListAndTasks")) {
                    this.allSavedList = JSON.parse(
                        localStorage.getItem("allListAndTasks")
                    );
                }
                this.$refs.addGroupOfList.setAttribute('src', this.$refs.addGroupOfList.getAttribute('src').replace('add', 'close'))

                this.itemValue = "";
                this.listObj = {};
                this.taskNumber++;
            } else {
                if (this.toggleListChildren === false) {
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
                } else {
                    if (this.childListsArray.length > 0) {
                        this.$refs.addGroupOfList.setAttribute('src', this.$refs.addGroupOfList.getAttribute('src').replace('close', 'add'))
                        this.toggleListChildren = false
                        this.childListsArray = []
                        this.lists[this.lists.length - 1].toggleChildList = false;
                        this.childId = 0
                    } else {
                        this.showPopUp = !this.showPopUp
                    }
                }
            }
        },
    },
    watch: {
        lists: {
            handler(newValue, oldValue) {
                this.taskNumber = this.lists.length
            },
            deep: true
        }
    }
};
</script>