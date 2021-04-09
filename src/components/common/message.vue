<template>
    <div></div>
</template>
<script>
export default {
    mounted() {
        MessageBox({
            title: '',
            message: 'ddd?',
            showCancelButton: true,
            cancelButtonText: '取消',
            confirmButtonText: '重试一次',
            confirmButtonClass: 'confirmButton',
            cancelButtonClass: 'cancelButton'
        }).then(action => {
            if (action === 'cancel') {
                this.$emit('cancel');
            }
        });
    }
};
</script>
<style lang="scss">
.cancelButton {
    font-size: 16px;
    color: #7a7f85;
    letter-spacing: 0;
    text-align: center;
    line-height: 16px;
}
.confirmButton {
    font-size: 16px;
    color: #0a9c70;
    letter-spacing: 0;
    text-align: center;
    line-height: 16px;
}
</style>
