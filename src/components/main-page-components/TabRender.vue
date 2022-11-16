<template>
    <div class="view-content-container">
        <div class="title">
            <h1>
                <slot name="title"></slot>
            </h1>
        </div>


        <ul class="tasks">
            <slot name="allTaskSlot"></slot>
        </ul>


        <AddTask />
    </div>
</template>

<script>
import AddTask from './AddTask.vue'

export default {
    name: 'TabRender',
    components: {
        AddTask
    },
}
</script>