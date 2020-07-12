<template>
  <div>
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
            // 控制修改用户对话框显示和影藏
            editDialogVisible: false,
             // 查询到的用户信息 用于显示在修改用户对话框中
            editForm: {},
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
    methods: {
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
                this.$parent.getUserList()
                this.editDialogVisible = false
                this.$message.success('更新用户信息成功!')
            })
        },
    }
}
</script>

<style lang="less" scoped>
    
</style>