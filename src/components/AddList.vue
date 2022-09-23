<template>
    <div class="add-item-container" :class="{error: toggleError}">
        <div class="add-item">

            <div class="single-list">
                <span @click="addList">
                    <img :class="{ active: itemDetect }" src="@/assets/design-material/icons/plus.png" alt="add-item" />
                </span>
                <input @focus="toggleErrorClass" v-model="itemValue" placeholder="Add New List" type="text" name=""
                    id="" />
            </div>

            <span>
                <img :class="{ active: itemDetect }" src="@/assets/design-material/icons/add.png"
                    alt="add-item" />
            </span>
        </div>
    </div>
</template>
  
<script>

export default {
    name: "add-new-item",
    beforeMount: function () {
        if (JSON.parse(localStorage.getItem("allListAndTasks"))) {
            this.allSavedList = JSON.parse(localStorage.getItem("allListAndTasks"));
        }
    },


    data() {
        return {
            itemValue: "",
            listArray: [],
            listObj: {},
            taskNumber: 0,
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
    },

    methods: {
        addList() {
            if (this.itemValue.length > 0) {
                this.listObj.listName = this.itemValue;
                this.listObj.id = this.taskNumber;

                this.listArray = JSON.parse(localStorage.getItem("allListAndTasks")) || [];
                this.listArray.push(this.listObj);
                localStorage.setItem("allListAndTasks", JSON.stringify(this.listArray));

                if (localStorage.getItem("allListAndTasks")) {
                    this.allSavedList = JSON.parse(
                        localStorage.getItem("allListAndTasks")
                    );
                }

                this.itemValue = "";
                this.listObj = {};
                this.taskNumber++;
            } else {
                this.toggleError = true
            }
        },
        toggleErrorClass() {
            this.toggleError = false
        }
    },
};
</script>