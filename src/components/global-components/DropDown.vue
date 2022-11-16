<template>
    <div :style="{top: top + 'px', right: right + 'px',left: left + 'px'}" class="drop-down">
        <ul class="drop-down-item">
            <li v-for="(name, index) in  dropDownSlots" :key="index">
                <slot :name='name'></slot>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'DropDown',
    props: ['top', 'right', 'dropDownSlots', 'left']
}
</script>