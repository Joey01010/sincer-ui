<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 产品信息
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="handle-box">
        <el-button type="primary"
                   icon="el-icon-delete"
                   class="handle-del mr10"
                   @click="delAllSelection">批量删除
        </el-button>

        <el-select v-model="query.column"
                   placeholder="产品名称"
                   class="handle-select mr10">
          <el-option v-for="item in multipleSelection"
                     :key="item.id"
                     :label="item.key"
                     :value="item.value"/>
        </el-select>

        <el-input v-model="query.columnValue"
                  placeholder="请输入相应查询条件"
                  class="handle-input mr10"></el-input>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="getData">搜索
        </el-button>
        <el-button type="primary"
                   icon="el-icon-zoom-in"
                   @click="handleAdd">添加
        </el-button>
        <el-button type="primary"
                   @click="handleUpload">上传
          <i class="el-icon-upload el-icon--right"></i>
        </el-button>
        <el-button icon="el-icon-download"
                   @click="handleExportData">导出
        </el-button>
      </div>
      <el-table :data="tableData"
                max-height="600"
                border
                stripe
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="55"
                         align="center"></el-table-column>

        <el-table-column prop="pdId"
                         label="日报编号"
                         sortable
                         width="110"
                         align="center"></el-table-column>
        <el-table-column prop="pdLine"
                         label="生产产线"
                         align="center"></el-table-column>
        <el-table-column prop="type"
                         label="车型"
                         align="center"></el-table-column>
        <el-table-column prop="pdCode"
                         label="产品编号"
                         width="170"
                         align="center"></el-table-column>
        <el-table-column prop="pdName"
                         label="产品名称"
                         width="190"
                         align="center"></el-table-column>
        <el-table-column prop="spec"
                         label="工艺"
                         width="120"
                         align="center"></el-table-column>
        <el-table-column prop="ct"
                         label="CT/秒"
                         align="center"></el-table-column>
        <el-table-column prop="count"
                         label="打点数"
                         align="center"></el-table-column>
        <el-table-column prop="processNo"
                         label="工序号"
                         align="center"></el-table-column>
        <el-table-column prop="assist"
                         label="辅助"
                         align="center"></el-table-column>
        <el-table-column prop="mcCode"
                         label="机台"
                         width="120"
                         align="center"></el-table-column>

        <el-table-column label="操作"
                         width="180"
                         align="center"
                         fixed="right">
          <template slot-scope="scope">
            <el-button type="text"
                       icon="el-icon-edit"
                       @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button type="text"
                       icon="el-icon-delete"
                       class="red"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>

      </el-table>

      <div class="pagination">
        <el-pagination background
                       layout="total, sizes, prev, pager, next, jumper"
                       @current-change="handleCurrentChange"
                       @size-change="handleSizeChange"
                       :current-page="query.pageIndex"
                       :page-size="query.pageSize"
                       :page-sizes="pageSizes"
                       :total="pageTotal"></el-pagination>
      </div>
    </div>

    <!-- 编辑修改框 -->
    <el-dialog title="编辑"
               :visible.sync="editVisible"
               width="30%">
      <el-form ref="editForm"
               :model="editForm"
               label-width="95px">

        <el-form-item label="日报编号">
          <el-input v-model="editForm.pdId" readonly></el-input>
        </el-form-item>
        <el-form-item label="生产产线">
          <el-input v-model="editForm.pdLine"></el-input>
        </el-form-item>
        <el-form-item label="车型">
          <el-input v-model="editForm.type"></el-input>
        </el-form-item>
        <el-form-item label="产品编号">
          <el-input v-model="editForm.pdCode"></el-input>
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input v-model="editForm.pdName"></el-input>
        </el-form-item>
        <el-form-item label="工艺">
          <el-input v-model="editForm.spec"></el-input>
        </el-form-item>
        <el-form-item label="CT/秒">
          <el-input v-model="editForm.ct"
                    onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
        </el-form-item>
        <el-form-item label="打点数">
          <el-input v-model="editForm.count"
                    onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
        </el-form-item>
        <el-form-item label="工序号">
          <el-input v-model="editForm.processNo"></el-input>
        </el-form-item>
        <el-form-item label="辅助">
          <el-input v-model="editForm.assist"
                    onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
        </el-form-item>
        <el-form-item label="机台">
          <el-input v-model="editForm.mcCode"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑添加框 -->
    <el-dialog title="添加"
               :visible.sync="addVisible"
               width="30%">
      <el-form ref="addForm"
               :model="addForm"
               label-width="95px">

        <el-form-item label="日报编号">
          <el-input v-model="addForm.pdId"></el-input>
        </el-form-item>
        <el-form-item label="生产产线">
          <el-input v-model="addForm.pdLine"></el-input>
        </el-form-item>
        <el-form-item label="车型">
          <el-input v-model="addForm.type"></el-input>
        </el-form-item>
        <el-form-item label="产品编号">
          <el-input v-model="addForm.pdCode"></el-input>
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input v-model="addForm.pdName"></el-input>
        </el-form-item>
        <el-form-item label="工艺">
          <el-input v-model="addForm.spec"></el-input>
        </el-form-item>
        <el-form-item label="CT/秒">
          <el-input v-model="addForm.ct"
                    onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
        </el-form-item>
        <el-form-item label="打点数">
          <el-input v-model="addForm.count"
                    onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
        </el-form-item>
        <el-form-item label="工序号">
          <el-input v-model="addForm.processNo"></el-input>
        </el-form-item>
        <el-form-item label="辅助">
          <el-input v-model="addForm.assist"
                    onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
        </el-form-item>
        <el-form-item label="机台">
          <el-input v-model="addForm.mcCode"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 上传添加框 -->
    <el-dialog title="上传Excel"
               :visible.sync="uploadVisible"
               width="30%">
      <el-upload
          class="upload-demo"
          action="#"
          ref="upload"
          name="file"
          accept=".xlsx,.xls"
          :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="handleUploadData">上传数据</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过500MB</div>
      </el-upload>
    </el-dialog>
  </div>

</template>


<script>
import {fetchData} from '../../api/index';

export default {
  name: 'weld_product',

  data() {
    return {
      query: {
        pageIndex: 1,
        pageSize: 20,
        column: '',
        columnValue: ''
      },
      multipleSelection: [
        {
          id: 0,
          key: '<-选择类型->',
          value: '',
        },
        {
          id: 1,
          key: '日报编号',
          value: 'pd_id',
        },
        {
          id: 2,
          key: '产品名称',
          value: 'pd_name',
        },
        {
          id: 3,
          key: '产品编号',
          value: 'pd_code',
        },
        {
          id: 4,
          key: '生产产线',
          value: 'pd_line',
        },
      ],
      multipleDelSelection: [],
      tableData: [],
      delList: [],
      editVisible: false,
      addVisible: false,
      uploadVisible: false,
      pageTotal: 0,
      pageSizes: [5, 10, 20, 50],
      editForm: {},
      addForm: {},
      index: -1,
      id: -1
    };
  },

  created() {
    this.getData();
  },

  methods: {
    getData() {
      //查询全部
      // this.$axios.get('/api/weld/pd/all').then((res) => {
      //   this.tableData = res.data.body;
      // });

      if (this.query.columnValue == '') {
        this.searchAll();
      } else {
        this.searchByParams();
      }

    },
    //分页查询
    searchAll() {
      this.$axios.get('/api/weld/pd/allByPage',{
        params: {
          pageIndex: this.query.pageIndex,
          pageSize: this.query.pageSize
        }
      }).then((res) => {
        this.handlePageData(res);
      });
    },

    //条件查询
    searchByParams() {
      this.$axios.get('/api/weld/pd/search', {
        params: {
          column: this.query.column,
          columnValue: this.query.columnValue,
          pageIndex: this.query.pageIndex,
          pageSize: this.query.pageSize
        }
      }).then((res) => {
        this.handlePageData(res);
      });
    },

    // 删除操作
    handleDelete(index, row) {
      // 二次确认删除
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
          .then(() => {
            this.tableData.splice(index, 1);
            this.$axios.post('/api/weld/pd/del/' + row.id).then((res) => {
              this.tableData = this.getData();
              if(res.data.code == '200'){
                return this.$message.success(res.data.message);
              }
              return this.$message.error(res.data.message);
            });
          })
          .catch(() => {
          });
    },

    // 多选操作
    handleSelectionChange(val) {
      this.multipleDelSelection = val;
    },
    delAllSelection() {
      const length = this.multipleDelSelection.length;
      if(length == 0){
        return this.$message.warning('未选中记录');
      }
      let str = '';
      this.delList = this.delList.concat(this.multipleDelSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleDelSelection[i].id + ' ';
        this.$axios.post('/api/weld/pd/del/' + this.multipleDelSelection[i].id).then((res) => {
          // if (res.data.code == '200') {
          //   return this.$message.success(`删除了${str}`);
          // }
          // return this.$message.error(res.data.message);
        });
      }
      this.getData();
      return this.$message.success(`删除了${str}`);
    },
    // 编辑操作
    handleEdit(index, row) {
      this.index = index;
      this.editForm = row;
      this.editVisible = true;
    },
    //添加操作
    handleAdd(index, row) {
      this.addVisible = true;
    },
    // 保存编辑
    saveEdit() {
      this.editVisible = false;
      this.$axios.put('/api/weld/pd/edit', this.editForm).then((res) => {
        this.eidtForm= this.$options.data().eidtForm;
        if(res.data.code == '200'){
          return this.$message.success(res.data.message);
        }
        return this.$message.error(res.data.message);
      }).catch(() => {
        this.eidtForm= this.$options.data().eidtForm;
        return this.$message.error((res.data.message));
      });
      this.$set(this.tableData, this.index, this.editForm);
      this.getData();
    },
    // 保存添加
    saveAdd() {
      this.addVisible = false;
      this.$axios.post('/api/weld/pd/add', this.addForm).then((res) => {
        this.getData();
        this.addForm= this.$options.data().addForm;
        if(res.data.code == '200'){
          return this.$message.success(res.data.message);
        }
      }).catch(() => {
        this.addForm= this.$options.data().addForm;
        return this.$message.error('添加失败');
      });
      this.getData();
    },

    // 分页导航(当前页)
    handleCurrentChange(val) {
      this.$set(this.query, 'pageIndex', val);
      this.getData();
    },

    // 分页导航(条数)
    handleSizeChange(val) {
      this.$set(this.query, 'pageSize', val);
      this.getData();
    },

    //分页数据处理
    handlePageData(res) {
      this.tableData = res.data.body.list;
      this.query.pageIndex = res.data.body.pageNum;
      this.query.pageSize = res.data.body.pageSize;
      this.pageTotal = res.data.body.total;
    },

    //上传窗口
    handleUpload() {
      this.uploadVisible = true;
    },

    //上传数据
    handleUploadData() {
      if (this.$refs.upload.uploadFiles.length == 0) {
        return this.$message.warning("请选取文件后再上传");
      }

      let file = this.$refs.upload.uploadFiles.pop().raw;
      let formData = new FormData();
      formData.append("file", file);

      this.$axios.post('/api/weld/pd/upload', formData).then((res) => {
        if (res.data.code == '200') {
          this.uploadVisible = false;
          this.$message.success(res.data.message);
        } else {
          this.$message.error(res.data.message);
        }
        this.getData();
      });
    },

    //导出数据
    handleExportData() {
      //to do
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
