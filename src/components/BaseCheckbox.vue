<template>
    <div class="container">
        <label for>
            <input
                type="checkbox"
                v-bind:checked="checked"
                v-on:change="$emit('change', $event.target.checked)"
            />
            <span>
                <slot>{{ label }}</slot>
            </span>
        </label>
    </div>
</template>

<script>
export default {
    name: 'BaseCheckbox',
    model: {
        prop: 'checked',
        event: 'change'
    },
    props: {
        checked: Boolean,
        label: String
    },
    data() {
        return {};
    }
};
</script>

<style></style>
