<template>
    <div class="add-item-container" :class="{error: toggleError}">
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
</template>
  
<script>
import { allLists } from '@/stores/allLists.js'
import { mapWritableState } from 'pinia'

export default {
    name: "add-new-item",
    beforeMount: function () {
        if (JSON.parse(localStorage.getItem("allListAndTasks"))) {
            this.allSavedList = JSON.parse(localStorage.getItem("allListAndTasks"));
        }

        this.taskNumber = this.lists.length
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
            toggleError: false
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
        addList() {
            if (this.itemValue.length > 0) {


                if (this.toggleListChildren) {
                    this.listObj.listChildren = true;
                    this.listObj.tasks = [];

                    this.childListObj.name = this.itemValue
                    this.childListObj.id = `${this.childListId}c`
                    this.childListsArray.push(this.childListObj)
                    this.listObj.listsArray = this.childListsArray
                    this.childListId++

                    this.listArray = JSON.parse(localStorage.getItem("allListAndTasks")) || [];
                    this.listArray.at(-1).listsArray = this.listObj.listsArray
                    localStorage.setItem("allListAndTasks", JSON.stringify(this.listArray));
                    this.lists = JSON.parse(localStorage.getItem("allListAndTasks"))

                } else {
                    this.listObj.listName = this.itemValue;
                    this.listObj.id = this.taskNumber;
                    this.listObj.listChildren = false;
                    this.listObj.tasks = [];

                    this.listArray = JSON.parse(localStorage.getItem("allListAndTasks")) || [];
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
                this.toggleError = true
            }
        },
        toggleErrorClass() {
            this.toggleError = false
        },
        addGroupOfList() {
            if (this.itemValue.length > 0 && !this.$refs.addGroupOfList.getAttribute('src').includes('close')) {
                this.listObj.listName = this.itemValue;
                this.listObj.id = this.taskNumber;
                this.listObj.listsArray = []
                this.listObj.listChildren = true;
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
                    this.toggleError = true
                } else {
                    this.$refs.addGroupOfList.setAttribute('src', this.$refs.addGroupOfList.getAttribute('src').replace('close', 'add'))
                    this.toggleListChildren = false
                    this.childListsArray = []
                }
            }
        }
    },
};
</script>