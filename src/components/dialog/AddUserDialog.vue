<template>
  <div>
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
  </div>
</template>

<script>
export default {
    data() {
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
        return {
            // 控制添加用户对话框的显示和隐藏
            addDialogVisible: false,
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
            }
        }
    },
    created(){
        
    },
    methods: {
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
                this.$parent.getUserList()
            })
        },
        // 监听添加用户对话框的关闭事件 重置表单
        addDialogClose() {
            this.$refs.addFormRef.resetFields()
        },
    }
}
</script>

<style lang="less" scoped>
    
</style>