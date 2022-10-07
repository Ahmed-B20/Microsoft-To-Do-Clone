<template>
    <div class="view-content-container">
        <div class="title">

            <div class="toggle">
                <slot name="toggle-sidebar"></slot>
            </div>
            
            <h1>
                <slot name="title"></slot>
            </h1>

            <slot name="toggle-description"></slot>
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
    name: 'RenderContent',
    components: {
        AddTask
    },
}
</script>