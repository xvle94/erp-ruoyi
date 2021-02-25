<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
      
      <el-form-item label="物料名称" prop="materielName">
        <el-input
          v-model="queryParams.materielName"
          placeholder="请输入物料名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
       </el-form-item>
       <el-form-item label="所属供应商" >
        <el-input
          v-model="queryParams.supplierName"
          placeholder="请输入供应商名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="申请人" prop="createName">
        <el-input
          v-model="queryParams.createName"
          placeholder="请输入申请人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="申请日期" >
        <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      
      
      <el-form-item label="入库状态" prop="joinStatus">
        <el-select v-model="queryParams.joinStatus" placeholder="请选择入库状态" clearable size="small">
          <el-option
            v-for="dict in joinStatusOpstion"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
     
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['inOutStorehouse:joinWarehouse:export']"
        >导出</el-button>
      </el-col>
      <div class="top-right-btn">
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button size="mini" circle icon="el-icon-refresh" @click="handleQuery" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
          <el-button size="mini" circle icon="el-icon-search" @click="showSearch=!showSearch" />
        </el-tooltip>
      </div>
    </el-row>

    <el-table v-loading="loading" :data="joinWarehouseList" highlight-current-row>
      <el-table-column label="序号" align="center"  type="index" />
      <el-table-column label="入库编号" align="center" prop="joinWarehouseNo" />
      <el-table-column label="销售订单编号" align="center" prop="orderNo" />
      <el-table-column label="物料名称" align="center" prop="materielName" />
      <el-table-column label="所属供应商" align="center" prop="supplierName" />
      <el-table-column label="申请日期" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人员" align="center" prop="createName" />
      <el-table-column label="入库状态" align="center" prop="joinStatusValue" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,0)"
            v-hasPermi="['inOutStorehouse:joinWarehouse:edit']"
          >入库</el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-document"
              @click="handleUpdate(scope.row,1)"
            >详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改入库申请对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" v-if="this.title!='入库详情'">
        <el-row :gutter="20">
            <el-col :span="24">
              <div class="infoList">
                  <h4>入库列表</h4>
                  <el-table :data="form.infoList" style="width: 100%" >
                      <el-table-column label="序号" type="index">
                      </el-table-column>
                      <el-table-column prop="id" label="物料编号" min-width="110px">
                          <template slot-scope="scope">
                            <el-form-item>{{scope.row.materielCode}}</el-form-item>
                          </template>
                      </el-table-column>
                      <el-table-column prop="materielId" label="物料名称" min-width="185px">
                          <template slot-scope="scope">
                            <el-form-item>{{scope.row.materielName}}</el-form-item>
                          </template>
                      </el-table-column>
                      <el-table-column prop="purchaseDispose" label="实际采购配置" min-width="120px">
                          <template slot-scope="scope">
                            <el-form-item>{{scope.row.purchaseDispose}}</el-form-item>
                          </template>
                      </el-table-column>
                      <el-table-column prop="meteringId" label="计量单位">
                          <template slot-scope="scope">
                            <el-form-item>{{scope.row.meteringName}}</el-form-item>
                          </template>
                      </el-table-column>
                      <el-table-column prop="joinApplyNumber" label="入库数量">
                          <template slot-scope="scope">
                            <el-form-item>{{scope.row.joinApplyNumber}}</el-form-item>
                          </template>
                      </el-table-column>
                      <el-table-column prop="inJoinNumber" label="已入数量">
                          <template slot-scope="scope">
                            <el-form-item>{{scope.row.inJoinNumber}}</el-form-item>
                          </template>
                      </el-table-column>
                      <el-table-column prop="nowJoinCount" label="实际入库数量" min-width="120px">
                          <template slot-scope="scope">
                            <el-form-item :prop="'infoList.' + scope.$index + '.nowJoinCount'" :rules="rules.nowJoinCount">
                              <el-input v-model="scope.row.nowJoinCount"></el-input>
                            </el-form-item>
                          </template>
                      </el-table-column>
                      <el-table-column prop="warehouseId" label="仓库名称" min-width="140px">
                          <template slot-scope="scope">
                            <el-form-item :prop="'infoList.' + scope.$index + '.warehouseId'" :rules="rules.warehouseId">
                                  <el-select clearable v-model="scope.row.warehouseId">
                                      <el-option v-for="item in warehouseData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                  </el-select>
                            </el-form-item>
                          </template>
                      </el-table-column>
                  </el-table>
              </div>
            </el-col>
        </el-row>
      </el-form>
      <!-- 详情 -->
      <el-form ref="form" :model="form" :rules="rules" v-else>
        <el-row :gutter="20">
            <el-col :span="24">
              <div class="infoList detail">
                  <h4>入库列表</h4>
                  <el-table :data="form.infoList" style="width: 100%" >
                      <el-table-column label="序号" type="index">
                      </el-table-column>
                      <el-table-column prop="id" label="物料编号">
                          <template slot-scope="scope">
                            <el-form-item>{{scope.row.materielCode}}</el-form-item>
                          </template>
                      </el-table-column>
                      <el-table-column prop="materielId" label="物料名称">
                          <template slot-scope="scope">
                            <el-form-item>{{scope.row.materielName}}</el-form-item>
                          </template>
                      </el-table-column>
                      <el-table-column prop="purchaseDispose" label="实际采购配置">
                          <template slot-scope="scope">
                            <el-form-item>{{scope.row.purchaseDispose}}</el-form-item>
                          </template>
                      </el-table-column>
                      <el-table-column prop="meteringId" label="计量单位">
                          <template slot-scope="scope">
                            <el-form-item>{{scope.row.meteringName}}</el-form-item>
                          </template>
                      </el-table-column>
                      <el-table-column prop="joinApplyNumber" label="入库数量">
                          <template slot-scope="scope">
                            <el-form-item>{{scope.row.joinApplyNumber}}</el-form-item>
                          </template>
                      </el-table-column>
                      <el-table-column prop="inJoinNumber" label="已入数量">
                          <template slot-scope="scope">
                            <el-form-item>{{scope.row.inJoinNumber}}</el-form-item>
                          </template>
                      </el-table-column>
                      <el-table-column prop="warehouseId" label="仓库名称">
                          <template slot-scope="scope">
                            <el-form-item :prop="'infoList.' + scope.$index + '.warehouseId'" :rules="rules.warehouseId">
                                  <el-select v-model="scope.row.warehouseId" :disabled="true" placeholder="/">
                                      <el-option v-for="item in warehouseData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                  </el-select>
                            </el-form-item>
                          </template>
                      </el-table-column>
                  </el-table>
              </div>
            </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="this.title!='入库详情'">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listJoinWarehouse, getJoinWarehouse, updateJoinWarehouse, exportJoinWarehouse, getWarehouse} from "@/api/inOutStorehouse/joinWarehouse";

export default {
  name: "JoinWarehouse",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 入库申请表格数据
      joinWarehouseList: [],
      //入库状态
      joinStatusOpstion: [],
      // 弹出层标题
      title: "",
      // 申请日期
      dateRange: [],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        createName: null,
        materielName: null,
        joinStatus: null,
        supplierName: null,
      },
      // 表单参数
      form: {
        infoList:[]
      },
      //仓库数据
      warehouseData:[],
      // 表单校验
      rules: {
        nowJoinCount: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        warehouseId: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        updateBy: [
          { required: true, message: "修改人不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "修改时间不能为空", trigger: "blur" }
        ],
        delFlag: [
          { required: true, message: "是否删除(0未删除,1已删除)不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getWarehouse();
    this.getList();
    this.getDicts("purchase_info_inStatus").then(response =>{
      this.joinStatusOpstion = response.data;
    })
  },
  methods: {
    /** 查询入库申请列表 */
    getList() {
      this.loading = true;
      listJoinWarehouse(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.joinWarehouseList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        infoList:[{
          id: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          delFlag: null,
          remarks: null,
          purchaseId: null,
          purchaseDetailId: null,
          purchaseMoney: null,
          materielId: null,
          purchaseDispose: null,
          meteringId: null,
          purchaseNumber: null,
          joinApplyNumber: null,
          inJoinNumber: null,
          warehouseId: null,
          joinWarehouseBy: null,
          joinWarehouseTime: null,
          joinStatus: "0"
        }]
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        createName: null,
        materielName: null,
        joinStatus: null,
        supplierName: null,
      }
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加入库申请";
    },
    /** 修改按钮操作 */
    handleUpdate(row,modelType) {
      this.reset();
      const id = {
        joinWarehouseNo:row.joinWarehouseNo
      }
      getJoinWarehouse(id).then(response => {
        this.form.infoList = response.data;
        this.open = true;
      });
      if(modelType==0){
        this.title = "修改入库申请";
      }else{
        this.title = "入库详情"
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
            updateJoinWarehouse(this.form.infoList).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
        }
      });
    },
    // 查询仓库
    getWarehouse(){
      getWarehouse().then(response=>{
        this.warehouseData=response.data;
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有点数入库申?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportJoinWarehouse(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
<style>
  .el-form h4{
    margin-top: 0
  }
  .infoList .el-form-item {
    margin-bottom: 18px;
  }
  .detail .el-input__suffix{
    display: none;
  }
  .detail .is-disabled input{
    border:none
  }
  .detail .el-input--suffix .el-input__inner{
    padding-right: 0px;
  }
  .detail .is-disabled input:hover{
    background:#F5F7FA
  }
  .detail .el-input.is-disabled .el-input__inner{
    background: transparent;
    color: #606266
  }
  .detail .el-form-item__content{
    margin-left:0px
  }
</style>
