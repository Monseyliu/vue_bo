<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索和添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddUserDialog">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <!-- 状态作用域插槽 -->
          <template v-slot="slot">
            <!-- {{slot.row}} -->
            <el-switch v-model="slot.row.mg_state" @change="userStateChange(slot.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <!-- 操作 作用插槽 -->
          <template v-slot="slot">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(slot.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(slot.row.id)"
            ></el-button>
            <!-- 设置按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户的对话框 -->
    <AddUserDialog ref="subAddUserDialog"></AddUserDialog>

    <!-- 修改用户的对话框 -->
    <EditUserDialog ref="subEditUserDialog"></EditUserDialog>

    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
// 引入添加和编辑用户对话框的子组件
import AddUserDialog from '.././dialog/AddUserDialog.vue'
import EditUserDialog from '.././dialog/EditUserDialog.vue'

export default {
    data(){
        return{
            // 获取用户列表的参数对象
            queryInfo: {
                query: '',
                // 当前页码
                pagenum: 1,
                // 每页显示多少条
                pagesize: 2
            },
            // 用户列表
            userlist: [],
            total: 0,
        }
    },
    created(){
        this.getUserList()
    },
    mounted(){

    },
    methods: {
        // 控制添加用户对话框子组件显示
        showAddUserDialog(){
          this.$refs.subAddUserDialog._data.addDialogVisible = true
        },
        // 获取用户列表
        async getUserList(){
            const {data: res} = await this.$http.get('users',{ params: this.queryInfo})
            // console.log(res)
            if(res.meta.status !== 200) return this.$message.error('获取用户列表失败')
            this.userlist = res.data.users
            this.total = res.data.total
        },
        // 监听 pagesize 改变的事件
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            // pagesize 发生变化 重新发起请求
            this.getUserList()
        },
        // 监听 页码值改变的事件
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            // 页码值发生改变 重新发起请求
            this.getUserList()
        },
        // 监听 状态栏改变 并调用接口保存
        async userStateChange(userinfo) {
            // 发起修改状态请求 传参
            const {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if(res.meta.status !== 200) {
                // 更新失败取反页面状态
                userinfo.mg_state = !userinfo.mg_state
                this.$message.error('更新用户状态失败!')
            } 
            this.$message.success('更新用户状态成功!')
        },
        // 展示编辑用户的对话框
        async showEditDialog(id) {
            const {data: res} = await this.$http.get(`users/` + id)
            if(res.meta.status !== 200) return this.$message.error('查询用户信息失败!')
            this.$refs.subEditUserDialog._data.editForm = res.data
            this.$refs.subEditUserDialog._data.editDialogVisible = true
        },
        // 根据ID 删除相对应用户信息
        async removeById(id) {
            // 询问用户是否确认删除数据
            const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch(err => err) //捕获错误消息，并return 出去
            // 用户确定了 返回 confirm 如果取消了 则返回 cancel
            if(confirmResult !== 'confirm') return this.$message.info('已经取消删除!')
            // 发起删除请求
            const {data: res} = await this.$http.delete(`users/` + id)
            if(res.meta.status !== 200) return this.$message.error('删除用户失败')
            // 更新用户列表 和 提示用户删除成功
            this.getUserList()
            this.$message.success('删除用户信息成功!')
        }
    },
    components: {
      AddUserDialog,
      EditUserDialog
    }
}
</script>

<style lang="less" scoped>
    
</style>