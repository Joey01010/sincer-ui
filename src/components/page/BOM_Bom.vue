<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 设备维修记录
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="query.address" placeholder="Bom名称" class="handle-select mr10">
                    <el-option key="1" label="Bom名称" value="equip_no"></el-option>

                </el-select>
                <el-input v-model="query.name" placeholder="请输入相应查询条件" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-zoom-in" @click="handleAdd">添加</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" @selection-change="handleSelectionChange">


                    <el-table-column prop="bomname" label="Bom名称"></el-table-column>
                    <el-table-column prop="bomversion" label="Bom版本"></el-table-column>
                    <el-table-column prop="status" label="Bom状态"></el-table-column>
                    <el-table-column prop="updateDate" label="修改时间"></el-table-column>




                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>


            </el-table>


            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="95px">


                <el-form-item label="Bom名称"><el-input v-model="form.bomname"></el-input></el-form-item>
                <el-form-item label="Bom版本"><el-input v-model="form.bomversion"></el-input></el-form-item>
                <el-form-item label="Bom状态"><el-input v-model="form.status"></el-input></el-form-item>
                <el-form-item label="所属产品"><el-input v-model="form.updateDate"></el-input></el-form-item>


            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑添加框 -->
        <el-dialog title="添加" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="95px">


                <el-form-item label="Bom名称"><el-input v-model="form.bomname"></el-input></el-form-item>
                <el-form-item label="Bom版本"><el-input v-model="form.bomversion"></el-input></el-form-item>
                <el-form-item label="Bom状态"><el-input v-model="form.status"></el-input></el-form-item>
                <el-form-item label="所属产品"><el-input v-model="form.firstcheck"></el-input></el-form-item>



            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData } from '../../api/index';
export default {
    name: 'bom_bom',
    data() {
        return {
            query: {
                address: 'equip_no',
                name: '',
                pageIndex: 0,
                pageSize: 20
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();

    },
    methods: {

        getData() {
            this.$axios.get('/api/basBom/selectAll').then(res =>{
                this.tableData = res.data;
            })
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.$axios.get('/api/basBom/selectname?name='+this.query.name).then(res=>{
              this.tableData = res.data
            })
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.tableData.splice(index, 1);
                    this.$axios.get('/api/basBom/deleteById?id='+row.id).then(res=>{
                        this.$message.success("删除成功");
                    })
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].id + ' ';
                this.$axios.get('/api/basBom/deleteById?id='+this.multipleSelection[i].id).then(res=>{
                })
            }
            this.$message.success(`删除了${str}`);
            this.getData();
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            console.log(this.form)
            this.editVisible = true;
        },
        //添加操作
        handleAdd(index, row) {
            this.addVisible = true;
        },
        // 保存编辑
        saveEdit() {
            console.log(this.form)
            this.editVisible = false;
            this.form.reportPerson = JSON.parse(localStorage.getItem("userInfo")).name;


            this.$axios.post('/api/basBom/edit',this.form).then(res=>{
                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            })
            this.$set(this.tableData, this.idx, this.form);
        },
        // 保存添加
        saveAdd() {
            console.log(this.form)
            this.addVisible = false;
            this.form.reportPerson = JSON.parse(localStorage.getItem("userInfo")).name;


            this.$axios.post('/api/basBom/add',this.form).then(res=>{
                this.$message.success(`添加成功`);
            })
            this.getData();
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            // this.query.pageIndex = val;
            this.getData();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
