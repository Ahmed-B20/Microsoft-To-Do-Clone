<template>
    <div :class="{active:showPopUp}" class="pop-up-parent">
        <div class="pop-up-container">
            <transition name="pop-up-toggle">
                <div v-if="showPopUp" class="pop-up-content">
                    <h1 class="title">
                        <slot name="title"></slot>
                    </h1>

                    <p class="content">
                        <slot name="content"></slot>
                    </p>

                    <div class="button-container">
                        <slot name="button"></slot>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PopUp',
    props: ['showPopUp'],
    data() {
        return {

        }
    },
}
</script>