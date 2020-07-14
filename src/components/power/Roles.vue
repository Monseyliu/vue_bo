<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表表格区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="slot">
            <el-row
              v-for="(item1, i1) in slot.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '' , 'vcenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag  @close="removeRightById(slot.row,item1.id)" closable>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过 for循环嵌套渲染二级权限 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success" closable  @close="removeRightById(slot.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(slot.row,item3.id)"
                      type="warning"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="slot">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="ShowSetRightDialog(slot.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <SetRightDialog ref="SetRightDialogVisibleRef"></SetRightDialog>
  </div>
</template>

<script>
// 导入分配权限对话框组件
import SetRightDialog from '.././dialog/SetRightDialog.vue'

export default {
    data(){
        return {
            // 角色列表
            roleList: []
        }
    },
    created(){
        this.getRolesList()
    },
    methods: {
        // 获取所有角色列表
        async getRolesList(){
           const {data: res} = await this.$http.get('roles')
           if(res.meta.status !== 200) return this.$message.error('获取角色列表失败')
           this.roleList = res.data
           console.log(this.roleList)
        },
        // 根据ID删除对应的权限
        async removeRightById(role, id) {
            // 弹框提示用户是否删除
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err => err)
            if(confirmResult !== 'confirm') return this.$message.error('取消了删除')
            // 发起删除请求正式删除
            const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${id}`)
            if(res.meta.status !== 200) return this.$message.error('删除权限失败')
            // 重新获取权限列表会刷新页面导致展开栏关闭 这个时候可以重新赋值解决
            role.children = res.data
            this.$message.success('删除权限成功')
        },
        // 控制分配权限对话框展示
        async ShowSetRightDialog(role) {
            // 获取所有权限的数据 赋值给子组件 并展示对话框
            const {data: res} = await this.$http.get('rights/tree')
            if(res.meta.status !== 200) return this.$message.error('获取权限数据失败!')
            this.$refs.SetRightDialogVisibleRef.rightslist = res.data
            // 将ID保存起来，以便后续操作权限使用
            this.$refs.SetRightDialogVisibleRef.roleId = role.id
            // 递归获取三级权限节点的ID
            this.$refs.SetRightDialogVisibleRef.getLeafKeys(role, this.$refs.SetRightDialogVisibleRef.defKeys)
            this.$refs.SetRightDialogVisibleRef._data.SetRightDialogVisible = true
        }
    },
    components: {
        SetRightDialog
    }
}
</script>

<style lang="less" scoped>
    .el-tag {
        margin: 7px;
    }
    .bdtop{
        border-top: 1px solid #eee;
    }
     .bdbottom{
        border-bottom: 1px solid #eee;
    }
    .vcenter {
        display: flex;
        align-items: center;
    }
</style>