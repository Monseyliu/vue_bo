<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-tex="#"
        border
      >
        <!-- 是否有效模板 -->
        <template v-slot:isok="slot">
          <i
            class="el-icon-success"
            v-if="slot.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序模板 -->
        <template v-slot:order="slot">
          <el-tag size="mini" v-if="slot.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="slot.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作模板 -->
        <template v-slot:opt="slot">
          <el-button icon="el-icon-edit" size="mini" type="primary">编辑</el-button>
          <el-button icon="el-icon-delete" type="danger" size="mini">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->

      <el-pagination
        @size-change="CateSizeChange"
        @current-change="CatePageChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 8, 10]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClose">
      <!-- 添加分类的表单区域 -->
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" >
            <el-form-item label="分类名称:" prop="cat_name">
              <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类:" >
             <!-- 引入级联选择器 -->
             <el-cascader
                v-model="selectedKeys" clearable change-on-select
                :options="parentCateLis" 
                :props="cascaderProps"
                @change="parentCateChanged"></el-cascader>
            </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return {
            // 查询条件
            querInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            // 商品分类的数据列表，默认为空
            catelist: [],
            // 总数据条数
            total: 0,
            // 为table指定列的定义
            columns: [{
                label: '分类名称',
                prop: 'cat_name'
                },
                {
                    label: '是否有效',
                    type: 'template', //将当前列定义为模板列
                    template: 'isok' //当前这列使用的模板名称
                },
                {
                    label: '排序',
                    type: 'template', //将当前列定义为模板列
                    template: 'order' //当前这列使用的模板名称
                }
                ,
                {
                    label: '操作',
                    type: 'template', //将当前列定义为模板列
                    template: 'opt' //当前这列使用的模板名称
                }
            ],
            // 控制添加分类对话框的显示与影藏
            addCateDialogVisible: false,
            // 添加分类的数据对象
            addCateForm: {
                // 将要添加分类的名称
                cat_name: '',
                // 父级分类ID
                cat_pid: 0,
                // 分类等级 默认级
                cat_level: 0
            },
            // 添加分类对话框验证规则
            addCateFormRules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            },
            parentCateLis: [], //父级分类的列表
            cascaderProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                expandTrigger: 'hover' ,
            },
            selectedKeys: [],  //选中的父级分类的ID数组
        }
    },
    created(){
        // 获取商品分类参数
        this.getCateList()
    },
    methods: {
        // 获取商品分类数据
        async getCateList(){
            const {data: res} = await this.$http.get('categories', { params: this.querInfo})
            if(res.meta.status !== 200) return this.$message.error('获取商品分类数据失败!')
            console.log(res)
            // 将获取的数据赋值给catelist total 赋值
            this.catelist = res.data.result
            this.total = res.data.total
        },
        // 分页条数改变时候触发
        CateSizeChange(newSize){
            this.querInfo.pagesize = newSize
            this.getCateList()
        },
        // 分页区域页码值改变时候触发
        CatePageChange(newNum){
            this.querInfo.pagenum = newNum
            this.getCateList()
        },
        // 点击按钮展示添加分类的对话框
        showAddCateDialog() {
            // 获取父级分类的数据
            this.geParentCateList()
            this.addCateDialogVisible = true
        },
        // 获取父级分类的数据
        async geParentCateList() {
            const {data: res} = await this.$http.get('categories', { params: {type:2}})
            if(res.meta.status !== 200) return this.$message.error('获取父级分类失败!')
            this.parentCateLis = res.data
        },
        // 级联选择框选择项发生变化触发
        parentCateChanged(){
            // 如果selectedKeys大于零证明有选中
            if(this.selectedKeys.length > 0) {
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length -1] //取出最后一个作为父级分类
                // 赋值
                this.addCateForm.cat_level = this.selectedKeys.length
                return 
            } else {
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        },
        // 点击按钮添加分类
        addCate() {
            // 预验证后发起请求
            this.$refs.addCateFormRef.validate(async valid => {
                if(!valid) return
                const {data: res} = await this.$http.post('categories', this.addCateForm)
                if(res.meta.status !== 201) return this.$message.error('添加分类失败!')
                // 刷新列表并关闭对话框提示成功
                this.getCateList()
                this.addCateDialogVisible = false
                this.$message.success('添加分类成功!')
            })
        },
        // 监听对话框关闭事件
        addCateDialogClose(){
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.cat_level = 0
            this.addCateForm.cat_pid = 0
        }
    }
}
</script>

<style lang="less" scoped>
    .treeTable{
        margin-top: 15px;
    }
    .el-cascader{
        width: 100%;
    }
</style>