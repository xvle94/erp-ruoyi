<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="订单类型" prop="orderType">
        <el-select v-model="queryParams.orderType" placeholder="请选择订单类型" clearable size="small">
          <el-option
            v-for="dict in orderTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属项目" prop="projectId">
        <!-- <el-select v-model="queryParams.projectId" placeholder="请选择所属项目" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select> -->
         <el-select v-model="queryParams.projectId" filterable placeholder="请选择所属项目">
            <el-option
              v-for="item in projectData"
              :key="item.id"
              :label="item.projectName"
              :value="item.id"
            ></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="订单编号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单日期" prop="orderTime">
        <el-date-picker
              v-model="orderTime"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="申请人" prop="createName">
        <el-input
          v-model="queryParams.createName"
          placeholder="请输入申请人姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      
      <el-form-item label="申请日期" prop="createTime">
        <el-date-picker
              v-model="createTime"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="物料名" prop="materielName">
        <el-input
          v-model="queryParams.materielName"
          placeholder="请输入物料名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="配件是否齐全" prop="lackParts">
        <el-select v-model="queryParams.lackParts" placeholder="请选择" clearable size="small">
          <el-option
            v-for="dict in lackPartsOptions"
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
          v-hasPermi="['inOutStorehouse:deliverParent:export']"
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

    <el-table v-loading="loading" :data="deliverParentList" highlight-current-row>
      <el-table-column label="序号" align="center"  type="index" />
      <el-table-column label="订单类型" align="center" prop="orderType" />
      <el-table-column label="订单日期" align="center" prop="orderTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属项目" align="center" prop="projectName" />
      <el-table-column label="订单编号" align="center" prop="orderNo" />
      <el-table-column label="送货单编号" align="center" prop="deliverNo" />
      <el-table-column label="出库物料" align="center" prop="materielName" />
      <el-table-column label="发货状态" align="center" prop="deliverGoodsStatusValue"  />
      <el-table-column label="配件是否齐全" align="center" prop="lackParts" />
      <el-table-column label="申请人" align="center" prop="createName" />
      <el-table-column label="申请时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="送货状态" align="center" prop="deliverStatusValue"/>
      
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-show="scope.row.deliverStatusValue!='全部送货'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,0)"
            v-hasPermi="['inOutStorehouse:deliverParent:edit']"
          >编辑</el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-document"
              @click="handleUpdate(scope.row,1)"
            >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleExportInfo(scope.row)"
            v-hasPermi="['inOutStorehouse:deliverParent:export']"
          >导出</el-button>
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

    <!-- 添加或修改送货单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <!-- 编辑 -->
      <el-form ref="form" :model="form" :rules="rules" v-if="this.title!='送货单详情'">
        <el-form-item label="订单编号" prop="orderNo">
            <el-link @click="toOrderDetail(form.id)" type="primary">{{form.orderNo}}</el-link>
        </el-form-item>
        <el-row :gutter="20">
            <el-col :span="24">
              <div class="w_table">
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
                      <el-table-column prop="purchaseDispose" label="配置">
                          <template slot-scope="scope">
                            <el-form-item>{{scope.row.purchaseDispose}}</el-form-item>
                          </template>
                      </el-table-column>
                      <el-table-column prop="meteringId" label="单位">
                          <template slot-scope="scope">
                            <el-form-item>{{scope.row.meteringName}}</el-form-item>
                          </template>
                      </el-table-column>
                      <el-table-column prop="purchaseNumber" label="需要送货数量">
                          <template slot-scope="scope">
                            <el-form-item>{{scope.row.purchaseNumber}}</el-form-item>
                          </template>
                      </el-table-column>
                      <el-table-column prop="warehouseId" label="仓库">
                          <template slot-scope="scope">
                            <el-form-item :prop="'infoList.' + scope.$index + '.warehouseId'" :rules="rules.warehouseId">
                              <el-select :disabled="true" v-model="scope.row.warehouseId">
                                  <el-option v-for="item in warehouseData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                              </el-select>
                            </el-form-item>
                          </template>
                      </el-table-column>
                  </el-table>
              </div>
            </el-col>
        </el-row>
        <div class="list">
          <el-row :gutter="20">
              <el-col :span="12">
                  <el-form-item label="送货编号" prop="deliverNo">
                    <el-input v-model="form.deliverNo" :disabled="true"/>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item label="送货日期" prop="invoiceTime">
                    <el-date-picker clearable size="small" style="width:100%"
                      :picker-options="pickerBeginDateBefore"
                      v-model="form.invoiceTime"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择送货日期"
                      >
                    </el-date-picker>
                  </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
              <el-col :span="12">
                  <el-form-item label="送货人员" prop="deliverMan">
                    <el-input v-model="form.deliverMan" placeholder="请输入送货人" />
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="送货费用(元)" prop="deliverMoney">
                  <el-input v-model="form.deliverMoney" placeholder="请输入送货费用" />
                </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="送货状态" prop="deliverStatus">
                  <el-select v-model="form.deliverStatus" style="width:100%" clearable>
                      <el-option v-for="dict in deliverStatusOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel" :value="dict.dictValue"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="送货数量" prop="deliverNumber">
                  <el-input v-model="form.deliverNumber" placeholder="请输入送货数量" />
                </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="配件是否齐全" prop="lackParts">
                  <el-select v-model="form.lackParts" placeholder="请选择配件是否齐全" clearable style="width:100%">
                    <el-option
                      v-for="dict in lackPartsOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item label="联系电话" prop="linkPhone">
                    <el-input v-model="form.linkPhone" placeholder="请输入联系电话" />
                  </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
              <el-col :span="12">
                  <el-form-item label="送货地址" prop="deliverAddress">
                    <el-input v-model="form.deliverAddress" placeholder="请输入送货地址" maxlength="200"/>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注" prop="remarks">
                  <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容" maxlength="500"/>
                </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="送货附件" prop="deliverFile">
                  <el-upload :limit="5" multiple :on-exceed="handleExceed" :on-remove="handleRemove" :on-change="deliverHandleChange" :http-request="deliverRequestUpload"  :file-list="deliverFileList"  action="#"
                  :before-upload="beforeUpload">
                    <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
                  </el-upload>
                <el-input v-model="form.deliverFile"  placeholder="请输入内容" disabled v-show="false" />
                </el-form-item>
              </el-col>
          </el-row>
        </div>
      </el-form>
     
      <!-- 详情 -->
      <el-form ref="form" :model="form" :rules="rules" v-else>
        <el-form-item label="订单编号" prop="orderNo">
            <el-link @click="toOrderDetail(form.id)" type="primary">{{form.orderNo}}</el-link>
        </el-form-item>
        <el-row :gutter="20">
            <el-col :span="24">
              <div class="w_table">
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
                      <el-table-column prop="purchaseDispose" label="配置">
                          <template slot-scope="scope">
                            <el-form-item>{{scope.row.purchaseDispose}}</el-form-item>
                          </template>
                      </el-table-column>
                      <el-table-column prop="meteringId" label="单位">
                          <template slot-scope="scope">
                            <el-form-item>{{scope.row.meteringName}}</el-form-item>
                          </template>
                      </el-table-column>
                      <el-table-column prop="purchaseNumber" label="需要送货数量">
                          <template slot-scope="scope">
                            <el-form-item>{{scope.row.purchaseNumber}}</el-form-item>
                          </template>
                      </el-table-column>
                      <el-table-column prop="warehouseId" label="仓库">
                          <template slot-scope="scope">
                            <el-form-item :prop="'infoList.' + scope.$index + '.warehouseId'" :rules="rules.warehouseId">
                              <el-select :disabled="true" v-model="scope.row.warehouseId">
                                  <el-option v-for="item in warehouseData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                              </el-select>
                            </el-form-item>
                          </template>
                      </el-table-column>
                  </el-table>
              </div>
            </el-col>
        </el-row>
        <div class="list">
          <el-row :gutter="20">
              <el-col :span="12">
                  <el-form-item label="送货编号" prop="deliverNo">
                    <el-input v-model="form.deliverNo" :disabled="true"/>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item label="送货日期" prop="invoiceTime">
                    <el-date-picker size="small" style="width:100%"
                      :disabled="true"
                      v-model="form.invoiceTime"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="/">
                    </el-date-picker>
                  </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
              <el-col :span="12">
                  <el-form-item label="送货人员" prop="deliverMan">
                    <el-input v-model="form.deliverMan" placeholder="/" :disabled="true"/>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="送货费用" prop="deliverMoney">
                  <el-input v-model="form.deliverMoney" placeholder="/" :disabled="true"/>
                </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="送货状态">
                  <el-select v-model="form.deliverStatus" style="width:100%" :disabled="true">
                      <el-option v-for="dict in deliverStatusOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel" :value="dict.dictValue"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="送货数量" prop="sum">
                  <el-input v-model="sum" :disabled="true" placeholder="请输入送货数量" />
                </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="配件是否齐全" prop="lackParts">
                  <el-select v-model="form.lackParts" placeholder="请选择配件是否齐全" clearable style="width:100%" :disabled="true">
                    <el-option
                      v-for="dict in lackPartsOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item label="联系电话" prop="linkPhone">
                    <el-input v-model="form.linkPhone" placeholder="/" :disabled="true"/>
                  </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
              <el-col :span="12">
                  <el-form-item label="送货地址" prop="deliverAddress">
                    <el-input v-model="form.deliverAddress" placeholder="/" :disabled="true"/>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注" prop="remarks">
                  <el-input v-model="form.remarks" type="textarea" placeholder="/" :disabled="true"/>
                </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="送货附件" prop="deliverFile">
                <template v-if="form.fileUrl==null">
                  <el-link disabled type="primary" target="_blank">暂无</el-link>
                </template>
                <template v-else>
                  <el-link v-for="(item,index) in form.fileUrl" :href="item.contractUrl" type="primary" target="_blank">附件{{index+1}} </el-link>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
         </div>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="this.title!='送货单详情'">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDeliverParent, getDeliverParent, delDeliverParent, addDeliverParent, updateDeliverParent, exportDeliverParent, projectAll, exportInfo, getWarehouse, uploadFile} from "@/api/inOutStorehouse/deliverParent";

export default {
  name: "DeliverParent",
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
      // 送货单表格数据
      deliverParentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 送货状态字典
      deliverStatusOptions: [],
      // 配件是否齐全字典
      lackPartsOptions: [],
      // 删除状态(0-正常、1-删除)字典
      delFlagOptions: [],
      // 项目下拉框
      projectData: [],
      // 订单类型字典
      orderTypeOptions: [],
      // 日期范围
      dateRange: [],
      createTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectId: null,
        orderType: null,
        lackParts: null,
        createName: null,
        materielName: null,
        orderNo: null,
        beginCreateTime:null,
        endCreateTime: null,
        beginOrderTime:null,
        endOrderTime: null
      },
      //申请时间
      createTime:[],
      //订单时间
      orderTime:[],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        invoiceTime: [
          { required: true, message: "送货日期不能为空", trigger: "blur" }
        ],
        deliverMan: [
          { required: true, message: "送货人员不能为空", trigger: "blur" }
        ],
        deliverStatus: [
          { required: true, message: "送货状态不能为空", trigger: "blur" }
        ],
        lackParts:[
          { required: true, message: "配件是否齐全不能为空", trigger: "blur" }
        ],
        linkPhone:[
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        deliverAddress:[
          { required: true, message: "送货地址不能为空", trigger: "blur" }
        ],
        deliverMoney:[
           { pattern:/^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{0,2})?$/, message: "仅限小数点前最大9位数，后2位数", trigger: "blur" }
        ]
      },
      //仓库数据
      warehouseData:[],
      //安装要求文件列表
      deliverFileList: [],
      deliverFormData: [],
      sum:0,
      // 禁用当前之后日期
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("deliver_status").then(response => {
      this.deliverStatusOptions = response.data;
    });
    this.getDicts("del_dist").then(response => {
      this.lackPartsOptions = response.data;
    });
    this.getDicts("del_dist").then(response => {
      this.delFlagOptions = response.data;
    });
    this.getDicts("contract_type").then(response => {
      this.orderTypeOptions = response.data;
    });
    // 项目下拉框
    this.getProjectInfo();
    // 仓库数据
    this.getWarehouse();
  },
  methods: {
    /** 查询送货单列表 */
    getList() {
      this.loading = true;
      //申请时间
      if (this.createTime != null && this.createTime !== '') {
        this.queryParams.beginCreateTime = this.createTime[0]
        this.queryParams.endCreateTime = this.createTime[1]
      }
      //订单时间
      if (this.orderTime != null && this.orderTime !== '') {
        this.queryParams.beginOrderTime = this.orderTime[0]
        this.queryParams.endOrderTime = this.orderTime[1]
      }
      listDeliverParent(this.queryParams).then(response => {
        this.deliverParentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 送货状态字典翻译
    deliverStatusFormat(row, column) {
      return this.selectDictLabel(this.deliverStatusOptions, row.deliverStatus);
    },
    // 配件是否齐全字典翻译
    lackPartsFormat(row, column) {
      return this.selectDictLabel(this.lackPartsOptions, row.lackParts);
    },
    // 删除状态(0-正常、1-删除)字典翻译
    delFlagFormat(row, column) {
      return this.selectDictLabel(this.delFlagOptions, row.delFlag);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        orderId: null,
        deliverNo: null,
        deliverMan: null,
        deliverMoney: null,
        deliverStatus: "0",
        deliverNumber: null,
        lackParts: null,
        deliverAddress: null,
        deliverFile: null,
        linkPhone: null,
        invoiceTime: null,
        remarks: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null
      };
      this.sum=0;
      this.deliverFileList=[]
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      //申请时间
      this.createTime = [],
      //订单时间
      this.orderTime = [],
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        projectId: null,
        orderType: null,
        lackParts: null,
        createName: null,
        materielName: null,
        orderNo: null,
        beginCreateTime:null,
        endCreateTime: null,
        beginOrderTime:null,
        endOrderTime: null
      };
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
      this.title = "添加送货单";
    },
    /** 修改按钮操作 */
    handleUpdate(row,modalType) {
      this.reset();
      const id = row.id || this.ids
      getDeliverParent(id).then(response => {
        this.form = response.data;
        this.form.linkPhone=response.data.linkPhoneValue
        this.form.deliverAddress=response.data.deliverAddressValue
        // 图片
        let vm = this;
        if(response.data.fileUrl){
          let a = response.data.fileUrl
            if(a.length > 0) {
              a.forEach(item => {
                var obj = {} 
                  vm.$set(obj,'name',item.fileName);
                  vm.$set(obj,'url',item.contractUrl);  
                  vm.deliverFileList.push(obj);
              })
            }
        }
        this.open = true;
        // if(this.form.infoList){
        //   this.form.infoList.map((item,index) =>{
        //      this.form.deliverNumber +=item.purchaseNumber
        //   });
        // }else{

        // }

      });
      if(modalType==0){
        this.title = "送货单编辑";
      }else{
        this.title="送货单详情"
      }
    },
    //项目信息下拉框
    getProjectInfo(){
      projectAll().then(response=>{
        this.projectData=response.data;
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDeliverParent(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("编辑成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addDeliverParent(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除送货单编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDeliverParent(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有送货单数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDeliverParent(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    /** 导出项目立项单 */
    handleExportInfo(row){
      exportInfo({"deliverId": row.id}).then(res =>{
        if(res){
            const blob = res;
            const fileName =  row.deliverNo + "送货单.doc";
          if (window.navigator.msSaveOrOpenBlob) {
            // IE浏览器下
            navigator.msSaveBlob(blob, fileName);
          } else {
            const binaryData = [];
            binaryData.push(blob);
 
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(
              new Blob(binaryData, { type: 'application/x-download;charset=UTF-8' })
            );
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(link.href);
          }
        }else{
          this.$message.error('导出失败');
        }
           
      })

    },
     // 查询仓库
    getWarehouse(){
      getWarehouse().then(response=>{
        this.warehouseData=response.data;
      })
    },
    //上传之前检验文件
    beforeUpload(file){
      var fileSize = file.size / 1024 / 1024;
      if(fileSize > 5){
         this.$message.error('文件不能超过5MB');
         return false;
      }
      let fileName=file.name.substring(file.name.lastIndexOf('.')+1)
      const extension = fileName === 'png'
      const extension2 = fileName=== 'pdf'
      const extension3 = fileName=== 'jpg'
      if(!extension && !extension2 && !extension3) {
        this.$message({
            message: '上传文件只能是 pdf、png、jpg格式!',
            type: 'warning'
        });
        return false
      }
    },
     // 删除文件事件
    handleRemove(file, fileList){
      this.form.deliverFile= 0;
      this.form.fileUrl=null
    },
    // 超出文件个数
    handleExceed(files, fileList){
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    //保存项目安装要求文件
    deliverHandleChange(file,fileList){
      let formdata = new FormData();
      formdata.append('file',file.raw);//传文件
      this.deliverFormData = formdata;
    },
    //文件上传
    deliverRequestUpload(file,fileList){
      const that = this;
      //项目安装要求
      uploadFile(this.deliverFormData).then(res => {
        if(res.data){
            that.form.deliverFile = res.data.fileId;
        }
      });
    },
    // 跳转项目详情
    toOrderDetail(id){
      this.$router.push({path: '/order/orderAdd',query: { id:id ,type:1}})
      this.open = false;
    }
  }
};
</script>
<style>
  .el-form h4{
    margin-top: 0
  }
  .w_table {
    margin-bottom: 20px;
  }
  .w_table .el-form-item {
    margin-bottom: 18px;
  }
  .w_table .is-disabled input{
    border:none
  }
  .w_table .el-input--suffix .el-input__inner{
    padding-right: 0px;
  }
  .w_table .is-disabled input:hover{
    background:#F5F7FA
  }
  .w_table .el-input.is-disabled .el-input__inner{
    background: transparent;
    color: #606266
  }
  .list .el-form-item__content{
    margin-left: 120px
  }
  .w_table .el-form-item__content{
    margin-left:0px
  }
  .list label{
    width: 120px
  }
  .is-disabled .el-input__suffix{
    display: none;
  }
</style>


