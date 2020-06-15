<template>
    <div>
        后台主页面
        <el-button @click="logout" type="info">退出</el-button>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    },
    created(){},
    methods: {
        // 退出登录
        logout(){
            // 清除 sessionStorage 中的token
            window.sessionStorage.clear()
            // 跳转到登录页面
            this.$router.push('/login')
        }
    }
}
</script>

<style lang="less" scoped>
    
</style>