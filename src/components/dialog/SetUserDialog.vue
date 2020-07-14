<template>
  <div>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setUserDialogVisible" width="50%" @close="CloseDialog">
      <div>
        <p>当前用户：{{userInfo.username}}</p>
        <p>当前角色: {{userInfo.role_name}}</p>
        <p>
          分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInof">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return {
            // 控制对话框显示影藏
            setUserDialogVisible: false,
            // 需要被分配角色的用户信息
            userInfo: {},
            // 需要被分区角色的权限信息
            rolesList: [],
            // 已选中的角色ID值
            selectedRoleId:''
        }
    },
    methods: {
        // 保存选中的用户角色信息
        async saveRoleInof(){
            if(!this.selectedRoleId) return this.$message.error('请选择角色!')
            // 发起请求修改角色信息
            const {data: res} = await this.$http.put(`users/${this.userInfo.id}/role`, {rid: this.selectedRoleId})
            console.log(res)
            if(res.meta.status !== 200) {
                this.$message.error(res.meta.msg)
                this.setUserDialogVisible = false
            }
            // 更新完成后 重新获取父组件中的用户列表方法 影藏对话框
            this.$parent.getUserList()
            this.setUserDialogVisible = false
        },
        // 监听对话框关闭事件 重置数据
        CloseDialog(){
            this.selectedRoleId = ''
            this.userInfo = {}
        }
    }
}
</script>

<style lang="less" scopred>
    
</style>