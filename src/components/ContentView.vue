<template>
    <div class="view-content-container">
        <div class="title">
            <h1>
                <slot name="title"></slot>
            </h1>
        </div>


        <ul class="tasks">
            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>

            <li>Lorem ipsum dolor sit</li>
        </ul>


        <div class="add-task">
            <div class="add-task-container" :class="{error:errorToggle}">
                <span :class="{active:activeToggle}" ref="addTask" @click="addTaskToList">
                    <img src="@/assets/design-material/icons/plus.png" alt="add-task" />
                </span>

                <input placeholder="add task" v-model="inputValue" ref="taskInput" type="text">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MainContent',
    data() {
        return {
            inputValue: '',
            activeToggle: false,
            errorToggle: false
        }
    },
    methods: {
        addTaskToList() {
            if (this.inputValue.length > 0) {
                this.errorToggle = false


                this.$refs.taskInput.value = ''
            } else {
                this.errorToggle = true
            }
        }
    },
    watch: {
        inputValue() {
            if (this.inputValue.length > 0) {
                this.activeToggle = true
                this.errorToggle = false

            } else {
                this.activeToggle = false
            }
        }
    }
}
</script>