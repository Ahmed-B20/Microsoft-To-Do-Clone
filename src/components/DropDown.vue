<template>
    <div class="drop-down">
        <ul>
            <li>
                <slot name="rename"></slot>
            </li>
            <li>
                <slot name="move-list"></slot>
            </li>
            <li>
                <slot name="sort-by"></slot>
            </li>
            <li>
                <slot name="delete-list"></slot>
            </li>
        </ul>
    </div>
</template>