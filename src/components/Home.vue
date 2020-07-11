<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>商品后台管理系统</span>
      </div>
      <el-button @click="logout" type="info">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 菜单栏折叠效果 -->
        <div class="toggle-button" :class="isCollapse ? 'togglePadE' : 'togglePadS'" @click="toggleCollapse"><span>菜单</span><i :class="isCollapse ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"></i> </div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#f3f3f3" text-color="#000" active-text-color="#409eff" 
        unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="(item, index) in menulist" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="inconlist[index]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
    data() {
        return {
          // 左侧菜单数据
          menulist: [],
          // 左侧菜单栏icon图标
          inconlist: ['el-icon-user-solid','el-icon-lock','el-icon-s-goods','el-icon-s-order','el-icon-s-data'],
          // 是否折叠
          isCollapse: false,
          // 被激活的链接地址
          activePath: ''
        }
    },
    created(){
      // 获取左侧菜单
      this.getMenuList()
      this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
        // 退出登录
        logout(){
            // 清除 sessionStorage 中的token
            window.sessionStorage.clear()
            // 跳转到登录页面
            this.$router.push('/login')
        },
        // 获取左侧菜单
        async getMenuList(){
          const {data: res} = await this.$http.get('menus')
          if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
          // 获取成功赋值
          this.menulist = res.data
          //console.log(this.menulist)
          this.$message.success(res.meta.msg)
        },
        // 点击按钮切换菜单的折叠和展开
        toggleCollapse(){
          this.isCollapse = !this.isCollapse
        },
        // 保存链接的激活状态
        saveNavState(activePath){
          window.sessionStorage.setItem('activePath', activePath )
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
        background-color: #f3f3f3;
        .el-menu{
          border-right: none;
        }
    }
    .el-main {
        background-color: rgba(225, 225, 225, 0.2);
    }
    // 折叠栏样式
    .toggle-button {
      background-color: rgba(225, 225, 225, 0.2);
      font-size: 12px;
      line-height: 24px;
      text-align: center;
      letter-spacing: 0.2px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .togglePadS {
      padding: 0 20px;
    }
    .togglePadE {
      padding: 0 5px;
    }
    
</style>