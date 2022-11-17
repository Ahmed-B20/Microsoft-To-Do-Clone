<template>
    <transition name="to-top">
        <div v-if="showWarning" class="warning-message-container">
            <div class="warning-message-content">
                <slot name="warningIcon"></slot>
                <slot name="warningMessage"></slot>
                <slot name="closeWarning"></slot>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'WarningMessage',
    props: ['showWarning']
}
</script>