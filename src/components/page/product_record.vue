<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 日报记录
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
                   placeholder="查询类型"
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
                   @click="handleAdd">录入
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
                         align="center"
                         width="110"
                         fixed="left"></el-table-column>
        <el-table-column prop="pdDate"
                         label="制造日期"
                         sortable
                         width="110"
                         align="center"></el-table-column>
        <el-table-column prop="productList.pdCode"
                         label="产品编号"
                         width="170"
                         align="center"></el-table-column>
        <el-table-column prop="productList.pdLine"
                         label="生产产线"
                         align="center"></el-table-column>
        <el-table-column prop="planOp"
                         label="计划产量"
                         align="center"></el-table-column>
        <el-table-column prop="planTime"
                         label="计划用时"
                         align="center"></el-table-column>
        <el-table-column prop="startTime"
                         label="开始时间"
                         sortable
                         :formatter="formatDate"
                         width="110"
                         align="center"></el-table-column>
        <el-table-column prop="endTime"
                         label="结束时间"
                         :formatter="formatDate"
                         align="center"></el-table-column>
        <el-table-column prop="restTime"
                         label="休息时间"
                         align="center"></el-table-column>
        <el-table-column prop="className"
                         label="班次"
                         align="center"></el-table-column>
        <el-table-column prop="saveCount"
                         label="入库数"
                         align="center"></el-table-column>
        <el-table-column prop="ruinCount"
                         label="全破坏数"
                         align="center"></el-table-column>
        <el-table-column prop="halfRuinCount"
                         label="半破坏数"
                         align="center"></el-table-column>
        <el-table-column prop="refuseCount"
                         label="不良数"
                         align="center"></el-table-column>
        <el-table-column prop="pdStaff"
                         label="作业者"
                         align="center"></el-table-column>
        <el-table-column prop="bfClassMt"
                         label="班会前"
                         align="center"></el-table-column>
        <el-table-column prop="bfStart"
                         label="始业点检"
                         align="center"></el-table-column>
        <el-table-column prop="qcTime"
                         label="品质确认"
                         align="center"></el-table-column>
        <el-table-column prop="threeS"
                         label="3S"
                         align="center"></el-table-column>
        <el-table-column prop="dvTime"
                         label="设备保养"
                         align="center"></el-table-column>
        <el-table-column prop="newCmTime"
                         label="新品调试"
                         align="center"></el-table-column>
        <el-table-column prop="custmCm"
                         label="客户对应"
                         align="center"></el-table-column>
        <el-table-column prop="planStop"
                         label="计划停止"
                         align="center"></el-table-column>
        <el-table-column prop="dvBroken"
                         label="设备故障"
                         align="center"></el-table-column>
        <el-table-column prop="lackTime"
                         label="单品欠料"
                         align="center"></el-table-column>
        <el-table-column prop="dlWait"
                         label="配送等待"
                         align="center"></el-table-column>
        <el-table-column prop="anQa"
                         label="品质异常"
                         align="center"></el-table-column>
        <el-table-column prop="remark"
                         label="备注"
                         align="center"></el-table-column>
        <el-table-column prop="result.opTime"
                         label="操作时间"
                         align="center"></el-table-column>
        <el-table-column prop="result.loadTime"
                         label="负荷时间"
                         align="center"></el-table-column>
        <el-table-column prop="result.processTime"
                         label="纯生产时间"
                         width="110"
                         align="center"></el-table-column>
        <el-table-column prop="result.theoryRate"
                         label="理论稼动率"
                         width="110"
                         :formatter="formatPercent"
                         align="center"></el-table-column>
        <el-table-column prop="result.timeRate"
                         label="时间稼动率"
                         width="110"
                         :formatter="formatPercent"
                         align="center"></el-table-column>
        <el-table-column prop="result.performanceRate"
                         label="性能稼动率"
                         width="110"
                         :formatter="formatPercent"
                         align="center"></el-table-column>
        <el-table-column prop="result.passPdCount"
                         label="工序内良品数"
                         width="115"
                         align="center"></el-table-column>
        <el-table-column prop="result.theoryHigh"
                         label="理论出来高"
                         width="110"
                         :formatter="formatTo2Point"
                         align="center"></el-table-column>
        <el-table-column prop="result.passRate"
                         label="良品率"
                         :formatter="formatPercent"
                         align="center"></el-table-column>
        <el-table-column prop="result.dvUseRate"
                         label="设备使用率"
                         width="110"
                         :formatter="formatPercent"
                         align="center"></el-table-column>
        <el-table-column prop="result.realCt"
                         label="实际CT"
                         :formatter="formatTo2Point"
                         align="center"></el-table-column>
        <el-table-column prop="result.sumPoint"
                         label="总打点数"
                         align="center"></el-table-column>
        <el-table-column prop="result.theoryPerTime"
                         label="理论对应时间"
                         width="110"
                         :formatter="formatTo2Point"
                         align="center"></el-table-column>
        <el-table-column prop="result.dvCompRate"
                         label="设备综合稼动率"
                         width="120"
                         :formatter="formatPercent"
                         align="center"></el-table-column>
        <el-table-column prop="result.realHigh"
                         label="实际出来高"
                         width="110"
                         :formatter="formatTo2Point"
                         align="center"></el-table-column>
        <el-table-column prop="result.overRate"
                         label="完结率"
                         sortable
                         width="100"
                         :formatter="formatPercent"
                         align="center"></el-table-column>
        <el-table-column label="操作"
                         width="180"
                         align="center"
                         fixed="right">
          <template slot-scope="scope">
            <el-button type="text"
                       icon="el-icon-data-analysis"
                       @click="handleDetail(scope.$index, scope.row)">详情
            </el-button>
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

    <!-- 编辑添加框 -->
    <el-dialog title="日报录入"
               :visible.sync="addVisible"
               width="60%">
      <el-form ref="addForm"
               :rules="rules"
               status-icon
               label-width="95px">

        <el-row>
          <el-col :span="12">
            <el-form-item label="制造日期" prop="pdDate">
              <el-date-picker style="width: 200px;"
                              v-model="addForm.pdDate"
                              type="date"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                              placeholder="请选择：年/月/日">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日报编号" prop="pdId">
              <el-input style="width: 200px;" v-model="addForm.pdId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="计划产量" prop="planOp">
              <el-input style="width: 200px;" v-model="addForm.planOp"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库数" prop="saveCount">
              <el-input style="width: 200px;" v-model="addForm.saveCount"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-time-picker
                  style="width: 200px;"
                  v-model="addForm.startTime"
                  type="datetime"
                  format="HH:mm"
                  value-format="HH:mm"
                  placeholder="请选择：时/分">
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime">
              <el-time-picker
                  style="width: 200px;"
                  v-model="addForm.endTime"
                  type="datetime"
                  format="HH:mm"
                  value-format="HH:mm"
                  placeholder="请选择：时/分">
              </el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="休息时间" prop="restTime">
              <el-input style="width: 200px;" v-model="addForm.restTime"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="全破坏数" prop="ruinCount">
              <el-input style="width: 200px;" v-model="addForm.ruinCount"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="半破坏数" prop="halfRuinCount">
              <el-input style="width: 200px;" v-model="addForm.halfRuinCount"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="不良数" prop="refuseCount">
              <el-input style="width: 200px;" v-model="addForm.refuseCount"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="作业者" prop="pdStaff">
              <el-input style="width: 200px;" v-model="addForm.pdStaff"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班会前" prop="bfClassMt">
              <el-input style="width: 200px;" v-model="addForm.bfClassMt"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="始业点检" prop="bfStart">
              <el-input style="width: 200px;" v-model="addForm.bfStart"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品质确认" prop="qcTime">
              <el-input style="width: 200px;" v-model="addForm.qcTime"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="3S" prop="threeS">
              <el-input style="width: 200px;" v-model="addForm.threeS"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备保养" prop="dvTime">
              <el-input style="width: 200px;" v-model="addForm.dvTime"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="新品调试" prop="newCmTime">
              <el-input style="width: 200px;" v-model="addForm.newCmTime"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户对应" prop="custmCm">
              <el-input style="width: 200px;" v-model="addForm.custmCm"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="计划停止" prop="planStop">
              <el-input style="width: 200px;" v-model="addForm.planStop"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备故障" prop="dvBroken">
              <el-input style="width: 200px;" v-model="addForm.dvBroken"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单品欠料" prop="lackTime">
              <el-input style="width: 200px;" v-model="addForm.lackTime"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="配送等待" prop="dlWait">
              <el-input style="width: 200px;" v-model="addForm.dlWait"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="品质异常" prop="anQa">
              <el-input style="width: 200px;" v-model="addForm.anQa"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input style="width: 200px;" v-model="addForm.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveAdd">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑修改框 -->
    <el-dialog title="日报修改"
               :visible.sync="editVisible"
               width="60%">
      <el-form ref="editForm"
               :rules="rules"
               status-icon
               label-width="95px">

        <el-row>
          <el-col :span="12">
            <el-form-item label="制造日期" prop="pdDate">
              <el-date-picker style="width: 200px;"
                              v-model="editForm.pdDate"
                              type="date"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                              placeholder="请选择：年/月/日">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日报编号" prop="pdId">
              <el-input style="width: 200px;" v-model="editForm.pdId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="计划产量" prop="planOp">
              <el-input style="width: 200px;" v-model="editForm.planOp"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库数" prop="saveCount">
              <el-input style="width: 200px;" v-model="editForm.saveCount"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-time-picker
                  style="width: 200px;"
                  v-model="editForm.startTime"
                  type="datetime"
                  format="HH:mm"
                  value-format="HH:mm:ss"
                  placeholder="请选择：时/分">
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime">
              <el-time-picker
                  style="width: 200px;"
                  v-model="editForm.endTime"
                  type="datetime"
                  format="HH:mm"
                  value-format="HH:mm:ss"
                  placeholder="请选择：时/分">
              </el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="休息时间" prop="restTime">
              <el-input style="width: 200px;" v-model="editForm.restTime"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="全破坏数" prop="ruinCount">
              <el-input style="width: 200px;" v-model="editForm.ruinCount"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="半破坏数" prop="halfRuinCount">
              <el-input style="width: 200px;" v-model="editForm.halfRuinCount"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="不良数" prop="refuseCount">
              <el-input style="width: 200px;" v-model="editForm.refuseCount"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="作业者" prop="pdStaff">
              <el-input style="width: 200px;" v-model="editForm.pdStaff"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班会前" prop="bfClassMt">
              <el-input style="width: 200px;" v-model="editForm.bfClassMt"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="始业点检" prop="bfStart">
              <el-input style="width: 200px;" v-model="editForm.bfStart"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品质确认" prop="qcTime">
              <el-input style="width: 200px;" v-model="editForm.qcTime"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="3S" prop="threeS">
              <el-input style="width: 200px;" v-model="editForm.threeS"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备保养" prop="dvTime">
              <el-input style="width: 200px;" v-model="editForm.dvTime"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="新品调试" prop="newCmTime">
              <el-input style="width: 200px;" v-model="editForm.newCmTime"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户对应" prop="custmCm">
              <el-input style="width: 200px;" v-model="editForm.custmCm"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="计划停止" prop="planStop">
              <el-input style="width: 200px;" v-model="editForm.planStop"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备故障" prop="dvBroken">
              <el-input style="width: 200px;" v-model="editForm.dvBroken"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单品欠料" prop="lackTime">
              <el-input style="width: 200px;" v-model="editForm.lackTime"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="配送等待" prop="dlWait">
              <el-input style="width: 200px;" v-model="editForm.dlWait"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="品质异常" prop="anQa">
              <el-input style="width: 200px;" v-model="editForm.anQa"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input style="width: 200px;" v-model="editForm.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="数据分析"
               :visible.sync="detailVisible"
               width="60%">
      <div class="container">
        <div class="schart-box">
          <div class="content-title">{{ this.editForm.productList.pdLine }}：折线图</div>
          <schart class="schart" canvasId="line" :options="options1"></schart>
        </div>


      </div>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="detailVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

  </div>

</template>


<script>
import {fetchData} from '../../api/index';
import Schart from "vue-schart";

export default {
  name: 'product_record',

  components: {
    Schart
  },

  data() {
    //日报编号校验
    let checkPdId = (rule, value, callback) => {
      if (!this.addForm.pdId) {
        return callback(new Error('日报编号不能为空'));
      }
      this.$axios.get('/api/weld/pd/' + this.addForm.pdId).then((res) => {
        if (!res.data.body) {
          return callback(new Error('日报编号不存在'));
        }
        return callback();
      });
    };
    return {
      options1: {
        type: 'line',
        title: {
          text: '最近一周各类稼动率趋势图'
        },
        bgColor: '#fbfbfb',
        labels: ['6月', '7月', '8月', '9月', '10月'],
        datasets: [
          {
            label: '时间稼动率',
            data: [234, 278, 270, 190, 230]
          },
          {
            label: '设备稼动率',
            data: [164, 178, 150, 135, 160]
          },
          {
            label: '良品率',
            data: [114, 138, 200, 235, 190]
          }
        ]
      },
      rules: {
        pdId: [
          {validator: checkPdId, trigger: 'blur'}
        ],
      },
      query: {
        pageIndex: 0,
        pageSize: 20,
        column: '',
        columnValue: ''
      },
      tableData: [],
      search: {},
      multipleSelection: [
        {
          id: 0,
          key: '<-选择类型->',
          value: '',
        },
        {
          id: 1,
          key: '制造日期',
          value: 'pd_date',
        },
        {
          id: 2,
          key: '日报编号',
          value: 'pd_id',
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
        {
          id: 5,
          key: '作业者',
          value: 'pd_staff',
        },
      ],
      delList: [],
      editVisible: false,
      addVisible: false,
      detailVisible: false,
      pageTotal: 0,
      addForm: {
        pdDate: '',
        pdId: '',
        planOp: '',
        saveCount: '',
        startTime: '',
        endTime: '',
        restTime: 0,
        ruinCount: 0,
        halfRuinCount: 0,
        refuseCount: 0,
        pdStaff: '',
        bfClassMt: '',
        bfStart: 5,
        qcTime: '',
        threeS: 10,
        dvTime: 0,
        newCmTime: 0,
        custmCm: 0,
        planStop: 0,
        dvBroken: 0,
        lackTime: 0,
        dlWait: 0,
        anQa: 0,
        remark: 0
      },
      editForm: {
        productList: {
          pdLine: ''
        }
      },
      pageSizes: [5, 10, 20, 50],
      index: -1,
      id: -1,
      size: ''
    };
  },

  created() {
    this.getData();
  },

  methods: {
    getData() {
      if (this.query.columnValue == '') {
        this.searchAll();
      } else {
        this.searchByParams();
      }
    },

    //分页查询
    searchAll() {
      this.$axios.get('/api/weld/record/allByPage', {
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
      this.$axios.get('/api/weld/record/search', {
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
            this.$axios.post('/api/weld/record/del/' + row.id).then((res) => {
              this.tableData = this.getData();
              if (res.data.code == '200') {
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
      this.multipleSelection = val;
    },
    delAllSelection() {
      const length = this.multipleSelection.length;
      if (length == 0) {
        return this.$message.warning('未选中记录');
      }
      let str = '';
      this.delList = this.delList.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].id + ' ';
        this.$axios.post('/api/weld/record/del/' + this.multipleSelection[i].id).then((res) => {
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

    // 添加操作
    handleAdd(index, row) {
      this.addVisible = true;
    },
    // 详情查看
    handleDetail(index, row) {
      this.index = index;
      this.editForm = row;
      this.detailVisible = true;
    },

    // 保存编辑
    saveEdit() {
      this.editVisible = false;
      this.addForm.startTime = this.startTime;
      this.addForm.endTime = this.endTime;
      this.$axios.post('/api/weld/record/edit', this.editForm).then((res) => {
        // this.$message.success(`修改第 ${this.index + 1} 行成功`);
        this.eidtForm = this.$options.data().eidtForm;
        if (res.data.code == '200') {
          return this.$message.success(res.data.message);
        }
        return this.$message.error(res.data.message);
      }).catch(() => {
        this.eidtForm = this.$options.data().eidtForm;
      });
      this.$set(this.tableData, this.index, this.editForm);
      this.getData();
    },
    // 保存添加
    saveAdd() {
      this.addVisible = false;
      this.addForm.startTime = this.startTime;
      this.addForm.endTime = this.endTime;
      this.$axios.post('/api/weld/record/add', this.addForm).then((res) => {
        this.getData();
        this.addForm = this.$options.data().addForm;
        if (res.data.code == '200') {
          return this.$message.success(res.data.message);
        }
      }).catch(() => {
        this.addForm = this.$options.data().addForm;
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

    //日期格式工具
    formatDate(row, column, cellValue) {
      if (cellValue == null || cellValue == '') {
        return cellValue;
      }
      let idx1 = cellValue.lastIndexOf(':');
      cellValue = cellValue.substring(0, idx1);
      let idx2 = cellValue.indexOf(' ');
      cellValue = cellValue.substring(idx2 + 1);
      return cellValue;
    },

    //百分比格式化工具
    formatPercent(row, column, cellValue) {
      if (cellValue == null || cellValue == '') {
        return cellValue;
      }
      cellValue = cellValue * 100;
      let rep = /[.]/;
      if (rep.test(cellValue)) {
        cellValue = cellValue.toFixed(2) + '%';
      } else {
        cellValue = cellValue + '%';
      }
      return cellValue;
    },

    //小数点数值格式化工具
    formatTo2Point(row, column, cellValue) {
      if (cellValue == null || cellValue == '') {
        return cellValue;
      }

      let rep = /[.]/;
      if (rep.test(cellValue)) {
        cellValue = cellValue.toFixed(2);
      }
      return cellValue;
    },
  },

  computed: {
    startTime: function () {
      if (this.addForm.pdDate == '' || this.addForm.pdDate == null) {
        return this.addForm.startTime;
      }
      return this.addForm.pdDate + ' ' + this.addForm.startTime;
    },
    endTime: function () {
      if (this.addForm.pdDate == '' || this.addForm.pdDate == null) {
        return this.addForm.endTime;
      }
      return this.addForm.pdDate + ' ' + this.addForm.endTime;
    }
  },

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

.schart-box {
  display: inline-block;
  margin: 20px;
}

.schart {
  width: 600px;
  height: 400px;
}

.content-title {
  clear: both;
  font-weight: 400;
  line-height: 50px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}

.content-data {
  display: inline-block;
  position: fixed;
  width: 300px;
  height: 400px;
}

</style>
