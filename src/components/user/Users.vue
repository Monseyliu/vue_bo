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
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
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
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <!-- 内容主体表单区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <!-- 手机 -->
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <!-- 内容主体表单区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <!-- 用户名 -->
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <!-- 手机 -->
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

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
export default {
    data(){
         // 校验手机的规则
    var checkMobile = (rule, value, cb) => {
        // 验证手机号的正则表达式
        const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]18[0-9]|14[57])[0-9]{8}$/
        if(regMobile.test(value)) {
            return cb()
        }
        cb(new Error('请输入合法的手机号'))
    }
    // 校验邮箱的规则
    var checkEmail = (rule, value, cb) => {
        // 验证邮箱正则
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if(regEmail.test(value)) {
            // 合法邮箱
            return cb()
        }
        cb(new Error('请输入合法邮箱'))
    }
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
            // 控制添加用户对话框的显示和隐藏
            addDialogVisible: false,
            // 控制修改用户对话框显示和影藏
            editDialogVisible: false,
            // 查询到的用户信息 用于显示在修改用户对话框中
            editForm: {},
            // 添加用户的表单数据
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            // 添加用户表单的验证规则
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '用户名长度在3~10个子字符直接', trigger: 'blur'}
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '用户名长度在6~16个子字符直接', trigger: 'blur'}
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur'}
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur'}
                ]
            },
            // 修改用户表单验证规则
            editFormRules: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur'}
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur'}
                ]
            }
        }
    },
    created(){
        this.getUserList()
    },
    methods: {
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
        // 监听添加用户对话框的关闭事件 重置表单
        addDialogClose() {
            this.$refs.addFormRef.resetFields()
        },
        // 点击按钮添加新用户
        addUser() {
            this.$refs.addFormRef.validate(async valid => {
                if(!valid) return
                // 发起真正的用户请求
                const {data: res} = await this.$http.post('users', this.addForm)
                if(res.meta.status !== 201) return this.$message.error('添加用户失败!')
                this.$message.success('添加用户成功！')
                // 隐藏对话框 和 重新获取用户列表
                this.addDialogVisible = false
                this.getUserList()
            })
        },
        // 展示编辑用户的对话框
        async showEditDialog(id) {
            const {data: res} = await this.$http.get(`users/` + id)
            if(res.meta.status !== 200) return this.$message.error('查询用户信息失败!')
            this.editForm = res.data
            this.editDialogVisible = true
        },
        // 监听修改用户对话框关闭事件 重置表单
        editDialogClose(){
            this.$refs.editFormRef.resetFields()
        },
        // 点击提交修改用户信息
        editUser() {
            this.$refs.editFormRef.validate(async valid => {
                if(!valid) return
                // 发起修改用户信息请求
                const {data: res} = await this.$http.put(`users/` + this.editForm.id, {
                    email: this.editForm.email,
                    mobile: this.editForm.mobile
                })
                if(res.meta.status !== 200) return this.$message.error('更新用户信息失败!')
                // 关闭对话框 和 更新用户列表 和关闭对话框 和通知用户修改成功
                this.getUserList()
                this.editDialogVisible = false
                this.$message.success('更新用户信息成功!')
            })
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
    }
}
</script>

<style lang="less" scoped>
    
</style>