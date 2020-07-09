<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>商品后台管理系统</span>
      </div>
      <el-button @click="logout" type="primary">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#f3f3f3" text-color="#000" active-text-color="#000">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体区域 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
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
    .home_container {
        height: 100%;
    }
    .el-header{
        background: #99CCFF;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        font-size: 20px;
        > div {
            display: flex;
            align-items: center;
            > span {
                margin-left: 15px;
            }
        }
    }
    .el-aside {
        background-color: rgba(225, 225, 225, 0.2);
    }
    .el-main {
        background-color: rgba(225, 225, 225, 0.2);
    }
    
</style>