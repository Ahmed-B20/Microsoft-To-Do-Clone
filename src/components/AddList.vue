<template>
    <div class="add-item-container" ref="addItemParent">
        <div class="add-item">

            <div class="single-list">
                <img src="@/assets/design-material/icons/add.png" alt="add-item" />
                <input v-model="itemValue" placeholder="Add New List" type="text" name="" id="" />
            </div>

            <span @click="addList" :class="{ disabled: itemDetect }" ref="addItem">
                <img src="@/assets/design-material/icons/sticky-notes (1).png" alt="add-item" />
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
        };
    },

    computed: {
        itemDetect() {
            if (this.itemValue.length > 0) {
                this.$refs.addItemParent.classList.remove("error");
                return false;
            } else {
                return true;
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
                this.$refs.addItemParent.classList.add("error");
            }
        },
    },
};
</script>