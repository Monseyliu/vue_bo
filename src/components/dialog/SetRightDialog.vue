<template>
  <div>
      <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="SetRightDialogVisible" width="50%" @close="resetDialog" >
      <!-- 树形控件 -->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox  default-expand-all ref="treeRef"
      node-key="id" :default-checked-keys="defKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="SetRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data() {
        return {
            // 控制分配权限对话框显示和影藏
            SetRightDialogVisible: false,
            // 所有权限的数据
            rightslist: [],
            // 树形控件的属性绑定对象
            treeProps: {
              label: 'authName',
              children: 'children'
            },
            // 默认选中的节点ID值
            defKeys: [],
            // 当前即将分配权限的ID
            roleId:  ''
        }
    },
    created() {
        
    },
    methods: {
        // 通过递归的形式，获取角色下所有三级权限的ID
        getLeafKeys(node, arr) {
          if(!node.children) {
            // 如果当前节点不包含children属性，则是三级节点
            return arr.push(node.id)
          }
          node.children.forEach(item => {
            this.getLeafKeys(item, arr)
          });
        },
        // 监听关闭对话框事件
        resetDialog() {
          // 清空ID值
          this.defKeys = []
        },
        // 点击为角色分配权限
        async SetRights() {
          const keys = [
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
          ]
          // 以逗号整理获取到的ID
          const idStr = keys.join(',')
          // 根据获取到的ID将权限发送给服务器保存
          const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
          if(res.meta.status !== 200) return this.$message.error('分配权限失败!')
          this.$message.success('分配权限成功!')
          // 刷新父组件中数据列表 关闭对话框 清空当前保存的roleid
          this.$parent.getRolesList()
          this.SetRightDialogVisible = false
          this.roleId = ''
        }

    }
}
</script>

<style lang="less" scope>
    
</style>