<template>
    <div class="form-box">
      <h4 class="titles">{{title}}</h4>
      <!-- 新增编辑 -->
      <el-form ref="form" :model="form" :rules="rules" v-if="this.title!='订单详情'&&this.title!='审核订单'">
        <div class="add">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="销售标题" prop="title">
                  <el-input v-model="form.title" placeholder="请输入销售标题" maxlength="50"/>
              </el-form-item>
              </el-col>
              <el-col :span="12">
              <el-form-item label="客户名称" prop="customerId">
                  <el-select clearable v-model="form.customerId" placeholder="请选择客户名称" :disabled="form.projectId!=null && form.orderType!='ct02' ? true : false">
                      <el-option v-for="item in customerData" :key="item.id" :label="item.name" :value="item.id"/>
                  </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
              <el-col :span="12">
              <el-form-item label="订单类型" prop="orderType">
                  <el-select v-model="form.orderType" placeholder="请选择订单类型" @change="changeOrderType">
                      <el-option
                          v-for="dict in orderTypeOptions"
                          :key="dict.dictValue"
                          :label="dict.dictLabel"
                          :value="dict.dictValue"
                      ></el-option>
                  </el-select>
              </el-form-item>
              </el-col>
              <el-col :span="12">
              <el-form-item label="联系人" prop="linkMan">
                  <el-input v-model="form.linkMan" placeholder="请输入联系人" />
              </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
              <el-col :span="12">
              <el-form-item label="项目名称">
                  <el-select @change="getContractInfo" v-model="form.projectId" placeholder="请选择项目名称" :disabled="form.orderType=='ct02' ? true : false" clearable>
                      <el-option v-for="item in projectData" :key="item.id" :label="item.projectName" :value="item.id"/>
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
              <el-form-item label="是否过单" prop="overOrderStatus">
                <el-select @change="changeOverOrder" clearable v-model="form.overOrderStatus" placeholder="请选择是否过单">
                  <el-option
                      v-for="dict in delDist"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="交付地址" prop="payAddress">
                <el-input v-model="form.payAddress" placeholder="请输入交付地址" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="销售金额(元)" :prop="form.overOrderStatus==1 ? 'saleMoney2' : 'saleMoney'">
                <el-input v-model="form.saleMoney" placeholder="请输入销售金额" :disabled="form.projectId!=null && form.orderType!='ct02' || form.overOrderStatus==1 ? true : false"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="交付日期" prop="payTime">
                <el-date-picker clearable size="small" style="width:100%"
                  :picker-options="pickerBeginDataAfter"
                  @change ="checkTime"
                  v-model="form.payTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择交付日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="过单后金额(元)" :prop="form.overOrderStatus==0 ? 'overOrderMoney2' : 'overOrderMoney'">
                <el-input v-model="form.overOrderMoney" placeholder="请输入过单后金额" :disabled="form.overOrderStatus==0 ? true : false"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同双方盖章" prop="seal">
                <el-input v-model="seal" :disabled="true"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
              <el-col :span="12">
              <el-form-item label="过单人" :prop="form.overOrderStatus==0 ? 'saleMans' : 'saleMan'">
                  <el-input v-model="form.saleMan" placeholder="请输入过单人" maxlength="10" :disabled="form.overOrderStatus==0 ? true : false"/>
              </el-form-item>
              </el-col>
              <el-col :span="12">
              <el-form-item label="合同副本" prop="contract">
                  <el-link v-if="this.contractUrl==null" type="primary" disabled>暂无</el-link>
                  <el-link v-else :href="this.contractUrl" type="primary" target="_blank">合同副本</el-link>
              </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="最终用户" prop="endUser">
                    <el-input v-model="form.endUser" placeholder="请输入最终用户" maxlength="50" :disabled="form.overOrderStatus==0 ? true : false"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公司名称" prop="companyId">
                  <el-select @change="changeCompany" clearable v-model="form.companyId" placeholder="请选择公司名称">
                    <el-option v-for="item in companyData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="过单税点(%)" prop="overOrderTax">
                    <el-input v-model="form.overOrderTax" placeholder="请输入过单税点" :disabled="form.overOrderStatus==0 ? true : false"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="订单日期" prop="orderTime">
                    <el-date-picker clearable size="small" style="width:100%"
                    @change ="checkTime"
                    v-model="form.orderTime"
                    :picker-options="pickerBeginDateBefore"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择订单日期">
                    </el-date-picker>
                </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="折扣金额(元)" prop="discountMoney">
                    <el-input v-model="form.discountMoney" placeholder="请输入折扣金额" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发票类型">
                    <el-select v-model="form.invoiceType" placeholder="请选择发票类型">
                    <el-option
                        v-for="dict in invoiceTypeOptions"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                    ></el-option>
                    </el-select>
                </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="采购类型" prop="purchaseType">
                  <el-select v-model="form.purchaseType" placeholder="请选择采购类型">
                  <el-option
                      v-for="dict in purchaseTypeOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                  ></el-option>
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="点击型号及配置" prop="modelDispose">
                  <el-input v-model="form.modelDispose" type="textarea" placeholder="请输入内容" maxlength="500"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="备注" prop="remarks">
                  <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容" maxlength="500"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="图片" prop="orderFile">
                  <el-upload :limit="5" :on-exceed="handleExceed" accept=".png,.pdf,.jpg,.bmp" :multiple="false" :on-change="orderHandleChange" :http-request="orderRequestUpload"  :file-list="orderFileList"  action="#"
                    :before-upload="beforeUpload" :on-remove="handleRemove">
                    <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
                  </el-upload>
                  <el-input v-model="form.orderFile"  placeholder="请输入内容" disabled v-show="false" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="infoList">
              <h4>订单明细</h4>
              <el-table :data="form.infoList" style="width: 100%" >
                <!-- show-summary :summary-method="getSummaries" -->
                  <el-table-column label="序号" type="index">
                  </el-table-column>
                  <el-table-column prop="materielId" label="物料名称">
                    <template slot-scope="scope">
                      <el-form-item :prop="'infoList.'+ scope.$index +'.materielId'" :rules="rules.materielId">
                        <el-cascader filterable v-model="scope.row.materielId" :props="optionProps" @change="handleChange($event,scope.$index,)" :options="materielData" :show-all-levels="false"></el-cascader>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="modelDispose" label="实际供货型号及配置">
                    <template slot-scope="scope">
                      <el-form-item :prop="'infoList.' + scope.$index + '.modelDispose'">
                        <el-input v-model="scope.row.modelDispose" placeholder="实际供货型号及配置"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="meteringId" label="计量单位">
                    <template slot-scope="scope">
                      <el-form-item :prop="'infoList.'+ scope.$index +'.meteringId'" :rules="rules.meteringId">
                        <el-select filterable v-model="scope.row.meteringId" placeholder="请选择计量单位">
                            <el-option v-for="item in meteringData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="saleMoney" label="销售单价">
                    <template slot-scope="scope">
                      <el-form-item :prop="'infoList.'+ scope.$index +'.saleMoney'" :rules="rules.saleMoney">
                        <el-input v-model="scope.row.saleMoney" placeholder="销售单价"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="number" label="数量">
                    <template slot-scope="scope">
                      <el-form-item :prop="'infoList.' + scope.$index + '.number'" :rules="rules.number">
                        <el-input v-model="scope.row.number" placeholder="数量"></el-input>
                        <!-- <el-input @change="checkNum($event,value)" v-model="scope.row.number" placeholder="数量"></el-input> -->
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ratio" label="税率(%)">
                    <template slot-scope="scope">
                      <el-form-item :prop="'infoList.'+ scope.$index +'.ratio'">
                        <el-input v-model="scope.row.ratio" :disabled="true"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="money" label="金额(元)">
                    <template slot-scope="scope">
                      <el-form-item :prop="'infoList.'+ scope.$index +'.money'">  
                        <el-input :disabled="true" v-model="scope.row.money = scope.row.saleMoney/(1+scope.row.ratio/100)*scope.row.ratio/100"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ratioMoney" label="税额(元)">
                    <template slot-scope="scope">
                      <el-form-item :prop="'infoList.'+ scope.$index +'.ratioMoney'">
                        <el-input :disabled="true" v-model="scope.row.ratioMoney=scope.row.saleMoney*scope.row.number/(1+scope.row.ratio/100)+scope.row.ratio/100-scope.row.ratio/100"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" min-width="40">
                    <template slot-scope="scope">
                      <el-form-item>
                        <i class="el-icon-delete form-icon" @click.prevent="removeLine(scope.row)" v-show="scope.$index!=0"></i>
                        <i class="el-icon-circle-plus-outline form-icon" @click="addLine" v-show="scope.$index==0"></i>
                      </el-form-item>
                    </template>
                  </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
        <div class="total">
          <span>合计：</span> 
          <div>销售总价：{{columnTotal}}元 </div>
          <div>税额：{{taxAmount}}元 </div>
          <div>金额：{{moneyTotal}}元</div>
        </div>
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="page-footer">
              <el-button @click="cancel">取 消</el-button>
              <el-button type="primary" @click="submitForm(1)">提交审核</el-button>
              <el-button type="primary" @click="submitForm(0)">草稿保存</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <!-- 详情、审核 -->
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" v-else>
        <div class="detail">
          <el-row :gutter="20">
              <el-col :span="12">
              <el-form-item label="销售标题" prop="title">
                  <el-input v-model="form.title" :disabled="true" maxlength="50"/>
              </el-form-item>
              </el-col>
              <el-col :span="12">
              <el-form-item label="客户名称" prop="customerId">
                  <el-select :disabled="true" v-model="form.customerId">
                      <el-option v-for="item in customerData" :key="item.id" :label="item.name" :value="item.id"/>
                  </el-select>
              </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
              <el-col :span="12">
              <el-form-item label="订单类型" prop="orderType">
                  <el-select v-model="form.orderType" :disabled="true">
                    <el-option
                        v-for="dict in orderTypeOptions"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                    ></el-option>
                  </el-select>
              </el-form-item>
              </el-col>
              <el-col :span="12">
              <el-form-item label="联系人" prop="linkMan">
                  <el-input v-model="form.linkMan" :disabled="true"/>
              </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="项目名称">
                <el-select :disabled="true" v-model="form.projectId" placeholder="/">
                  <el-option v-for="item in projectData" :key="item.id" :label="item.projectName" :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="linkPhone">
                <el-input v-model="form.linkPhone" :disabled="true"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
              <el-col :span="12">
              <el-form-item label="是否过单">
                  <el-select :disabled="true" v-model="form.overOrderStatus">
                  <el-option
                      v-for="dict in delDist"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                  ></el-option>
                  </el-select>
              </el-form-item>
              </el-col>
              <el-col :span="12">
              <el-form-item label="交付地址" prop="payAddress">
                  <el-input v-model="form.payAddress" :disabled="true"/>
              </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
              <el-col :span="12">
              <el-form-item label="销售金额" :prop="form.overOrderStatus==0 ? 'saleMoney' : 'saleMoney1'">
                  <el-input v-model="form.saleMoney" :disabled="true"/>
              </el-form-item>
              </el-col>
              <el-col :span="12">
              <el-form-item label="交付日期" prop="payTime">
                  <el-date-picker :disabled="true" size="small" style="width:100%"
                  v-model="form.payTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择交付日期">
                  </el-date-picker>
              </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
              <el-col :span="12">
              <el-form-item label="过单后金额" :prop="form.overOrderStatus==0 ? 'overOrderMoneys' : 'overOrderMoney'">
                  <el-input v-model="form.overOrderMoney" :disabled="true"/>
              </el-form-item>
              </el-col>
              <el-col :span="12">
              <el-form-item label="合同双方盖章" prop="seal">
                <el-input v-model="seal" :disabled="true"/>
              </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="过单人" :prop="form.overOrderStatus==0 ? 'saleMans' : 'saleMan'">
                  <el-input v-model="form.saleMan"  maxlength="10" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同副本" prop="contractUrl">
                <el-link v-if="form.contractUrl==null" type="primary" disabled>暂无</el-link>
                <el-link v-else :href="form.contractUrl" type="primary" target="_blank">合同副本</el-link>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="最终用户" prop="endUser">
                  <el-input v-model="form.endUser" maxlength="50" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司名称" prop="companyId">
                  <el-select v-model="form.companyId" :disabled="true">
                  <el-option v-for="item in companyData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="过单税点" prop="overOrderTax">
                    <el-input v-model="form.overOrderTax" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="订单日期" prop="orderTime">
                    <el-date-picker :disabled="true" size="small" style="width:100%"
                    v-model="form.orderTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择订单日期">
                    </el-date-picker>
                </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="折扣金额" prop="discountMoney">
                    <el-input v-model="form.discountMoney" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发票类型">
                    <el-select v-model="form.invoiceType" :disabled="true">
                    <el-option
                        v-for="dict in invoiceTypeOptions"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                    ></el-option>
                    </el-select>
                </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="采购类型">
                <el-select v-model="form.purchaseType" :disabled="true">
                  <el-option
                      v-for="dict in purchaseTypeOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="点击型号及配置" prop="modelDispose">
                <el-input v-model="form.modelDispose" type="textarea" :disabled="true"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="备注" prop="remarks">
                  <el-input v-model="form.remarks" type="textarea" :disabled="true" maxlength="500"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="图片" prop="fileUrl">
                <template v-if="form.fileUrl==null">
                  <el-link type="primary" disabled>暂无</el-link>
                </template>
                <template v-else>
                  <el-link v-for="(item,index) in form.fileUrl" :href="item.contractUrl" type="primary" target="_blank">图片{{index+1}} </el-link>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <div class="infoList">
                <h4>订单明细</h4>
                <el-table :data="form.infoList" style="width: 100%">
                    <el-table-column label="序号" type="index">
                    </el-table-column>
                    <el-table-column prop="materielId" label="物料名称">
                        <template slot-scope="scope">
                            <el-cascader v-model="scope.row.materielId" :props="optionProps" :disabled="true" :options="materielData" :show-all-levels="false"></el-cascader>
                        </template>
                    </el-table-column>
                    <el-table-column prop="modelDispose" label="实际供货型号及配置">
                        <template slot-scope="scope">
                        <el-input v-model="scope.row.modelDispose" :disabled="true"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="meteringId" label="计量单位">
                        <template slot-scope="scope">
                        <el-select v-model="scope.row.meteringId" :disabled="true">
                            <el-option v-for="item in meteringData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="saleMoney" label="销售单价">
                        <template slot-scope="scope">
                        <el-input v-model="scope.row.saleMoney" :disabled="true"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="number" label="数量">
                        <template slot-scope="scope">
                        <el-input v-model="scope.row.number" :disabled="true"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ratio" label="税率">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.ratio" :disabled="true"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="money" label="金额(元)">
                        <template slot-scope="scope">
                        <el-input :disabled="true" v-model="scope.row.money"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ratioMoney" label="税额(元)">
                        <template slot-scope="scope">
                        <el-input :disabled="true" v-model="scope.row.ratioMoney"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
              </div>
            </el-col>
          </el-row>
          <div class="total">
            <span>合计：</span> 
            <div> 销售总价：{{columnTotal}}元 </div>
            <div> 税额：{{taxAmount}}元  </div>
            <div> 金额：{{moneyTotal}}元 </div>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="提交人员" prop="createName">
                <el-input v-model="form.createName" :disabled="true"/>  
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 带审核的订单详情 -->
          <template v-if="this.title=='订单详情'">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="审核结果" prop="operatorStatus">
                  <el-select v-model="form.operatorStatus" :disabled="true">
                    <el-option
                        v-for="dict in examineOptions"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注说明" prop="operatorRemarks" v-show="operatorStatus=='e02'">
                  <el-input v-model="form.operatorRemarks" :disabled="true"/>  
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="审核人员" prop="operatorName" v-show="operatorStatus=='e02'">
                  <el-input v-model="form.operatorName" :disabled="true"/>  
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="审核时间" prop="operatorTime" v-show="operatorStatus=='e02'">
                  <el-input v-model="form.operatorTime" :disabled="true"/>  
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <!-- 审核 -->
          <template v-else>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="备注说明" prop="operatorRemarks" >
                  <el-input v-model="form.operatorRemarks"/>  
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <el-row :gutter="20">
            <el-col :span="24" v-show="this.title=='审核订单'">
              <div class="page-footer">
                <el-button @click="toExamine('e03')">不通过</el-button>
                <el-button type="primary" @click="toExamine('e02')">通过</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
</template>

<script>
import { getOrderParent, addOrderParent, updateOrderParent, exportOrderParent, projectAll, customerAll, companyAll, materielAll, meteringAll, contractInfo, uploadFile, getExamine} from "@/api/order/orderParent";

export default {
  name: "OrderHandle",
  data() {
    return {
      // 标题
      title: "",
      value:[],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 订单类型字典
      orderTypeOptions: [],
      // 是否过单字典
      delDist:[],
      // 发票类型字典
      invoiceTypeOptions: [],
      // 采购类型字典
      purchaseTypeOptions: [],

      // 采购状态字典
      purchaseStatusOptions: [],
      // 发货状态字典
      deliverGoodsStatusOptions: [],
      //审核状态字典项
      examineOptions: [],
      // 合同双方盖章
      sealOptions:[],
      // 项目下拉框
      projectData: [],
      companyData:[],
      customerData:[],
      // 物料下拉框
      materielData:[],
      // 计量单位下拉框
      meteringData :[],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orderType: [
          { required: true, message: "订单类型不能为空", trigger: "blur" }
        ],
        projectId: [
          { required: true, message: "所属项目不能为空", trigger: "blur" }
        ],
        orderNo: [
          { required: true, message: "订单编号不能为空", trigger: "blur" }
        ],
        // title: [
        //   { required: true, message: "销售标题不能为空", trigger: "blur" }
        // ],
        customerId: [
          { required: true, message: "客户名称不能为空", trigger: "blur" }
        ],
        linkMan: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ],
        linkPhone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" },
        ],
        payAddress: [
          { required: true, message: "交付地址不能为空", trigger: "blur" }
        ],
        payTime: [
          { required: true, message: "交付日期不能为空", trigger: "blur" }
        ],
        overOrderStatus: [
          { required: true, message: "是否过单不能为空", trigger: "blur" }
        ],
        companyId: [
          { required: true, message: "所属销售组织机构不能为空", trigger: "blur" }
        ],
        orderTime: [
          { required: true, message: "订单日期不能为空", trigger: "blur" }
        ],
        modelDispose: [
          { required: true, message: "点击型号及配置不能为空", trigger: "blur" }
        ],
        purchaseType: [
          { required: true, message: "采购类型不能为空", trigger: "blur" }
        ],

        saleMan:[
          { required: true, message: "过单人不能为空", trigger: "blur" }
        ],
        discountMoney:[
          { pattern:/^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{0,2})?$/, message: "仅限小数点前9位数,后2位数", trigger: "blur" }
        ],
        overOrderTax:[
          { pattern:/^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/, message: "过单税点小数点后保留2位数", trigger: "blur" }
        ],
        materielId:[
          { required: true, message: "物料名称不能为空", trigger: "blur" }
        ],
        meteringId:[
          { required: true, message: "物料名称不能为空", trigger: "blur" }
        ],
        // saleMoney:[
        //   { required: true, message: "销售单价不能为空", trigger: "blur" }
        // ],
        number:[
          { required: true, message: "数量不能为空", trigger: "blur" },
          { pattern:/^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{0,2})?$/, message: "仅限小数点前9位数,后2位数", trigger: "blur" }
        ],
        saleMoney:[
          { required: true, message: "销售价格不能为空", trigger: "blur" }
        ],
        overOrderMoney:[
          { required: true, message: "过单后金额不能为空", trigger: "blur" }
        ]
      },
      optionProps:{
        value: 'id',
        label: 'label',
        children: 'children'
      },
      //合同
      seal:'',
      contractUrl:null,
      ratios:'',
      end:0,
       //图片上传
      orderFileList:[],
      orderFormData: [],
      // 禁用当前之后日期
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      // 禁用当前之前日期
      pickerBeginDataAfter:{
        disabledDate(time) {
          return time.getTime() < Date.now()-8.64e7;
        }
      },
      // 审核状态
      operatorStatus:"",
      bl:false
    };
  },
  computed:{
    columnTotal:{
      get(){
        this.form.totalSaleMoney=this.form.infoList.map(row=>row.saleMoney*row.number).reduce((acc,cur)=>(cur+acc))
        return this.form.totalSaleMoney
      },
      set(v){
          this.form.totalSaleMoney = v
      }
    },
    taxAmount:{
      get(){
        this.form.totalTaxMoney=this.form.infoList.map(row=>row.ratioMoney).reduce((acc,cur)=>(cur+acc))
        return this.form.totalTaxMoney
      },
      set(v){
        this.form.totalTaxMoney = v
      }
    },
    moneyTotal:{
      get(){
        this.form.totalMoney=this.form.infoList.map(row=>row.money).reduce((acc,cur)=>(cur+acc))
        return this.form.totalMoney
      },
      set(v){
        this.form.totalMoney = v
      }
    }
  },
  created() {
    this.handleDetail();
    this.getDicts("contract_type").then(response => {
      this.orderTypeOptions = response.data;
    });
    this.getDicts("invoice_type").then(response => {
      this.invoiceTypeOptions = response.data;
    });
    this.getDicts("purchase_type").then(response => {
      this.purchaseTypeOptions = response.data;
    });
    this.getDicts("purchase_status").then(response => {
      this.purchaseStatusOptions = response.data;
    });
    this.getDicts("deliver_goods_status").then(response => {
      this.deliverGoodsStatusOptions = response.data;
    });
    this.getDicts("examine").then(response => {
      this.examineOptions = response.data;
    });
    this.getDicts("del_dist").then(response =>{
      this.delDist = response.data;
    })
    this.getDicts("seal_dist").then(response=>{
       this.sealOptions=response.data;
    })
    // 项目下拉框
    this.getProjectInfo();
    this.getCompanyInfo();
    this.getCustomerInfo();
    this.getMaterielInfo();
    this.getmeteringInfo();
  },
  methods: {
    changeOverOrder(value){
      if(value == 0){
        this.form.overOrderMoney="";
        this.form.saleMan="";
        this.form.endUser="";
        this.form.overOrderTax=""
      }else{
        this.form.saleMoney=""
      }
    },
    handleChange(value,index) {
      console.log(value);
      var end = value[value.length-1]
      this.form.infoList[index].materielId=end
      var vals = this.getCascaderObj(value, this.materielData); //选中节点数据
      var obj=vals[vals.length - 1]
      if("specsModel" in obj){
        this.form.infoList[index].modelDispose=obj.specsModel
        if(obj.label=='技术服务'){
          this.bl=true
          this.form.infoList[index].ratio=obj.ratio
        }
        else{
          if(this.form.companyId!=null){ 
            this.bl=false
            this.changeCompany(this.form.companyId);
          }else{
            this.bl=false
            this.$message.warning('请选择公司名称');
            this.form.infoList[index].ratio="";
          }
        }
      }
    },
    getCascaderObj(val, opt) {
      return val.map(function(value, index, array) {
        for (var itm of opt) {
          if (itm.id == value) {
            opt = itm.children;
            return itm;
          }
        }
        return null;
      });
    },
    changeOrderType(value){
      console.log(value);
      if(value =='ct02'&& this.form.projectId!=null ){
        this.form.projectId="";
        this.form.saleMoney="";
        this.seal="";
        this.contractUrl=""
      }
    },
    // 订单类型字典翻译
    orderTypeFormat(row, column) {
      return this.selectDictLabel(this.orderTypeOptions, row.orderType);
    },
    // 发票类型字典翻译
    invoiceTypeFormat(row, column) {
      return this.selectDictLabel(this.invoiceTypeOptions, row.invoiceType);
    },
    // 采购类型字典翻译
    purchaseTypeFormat(row, column) {
      return this.selectDictLabel(this.purchaseTypeOptions, row.purchaseType);
    },

    // 采购状态字典翻译
    purchaseStatusFormat(row, column) {
      return this.selectDictLabel(this.purchaseStatusOptions, row.purchaseStatus);
    },
    // 发货状态字典翻译
    deliverGoodsStatusFormat(row, column) {
      return this.selectDictLabel(this.deliverGoodsStatusOptions, row.deliverGoodsStatus);
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
        orderType: null,
        projectId: null,
        orderNo: null,
        title: null,
        customerId: null,
        linkMan: null,
        linkPhone: null,
        payAddress: null,
        payTime: null,
        overOrderStatus: null,
        saleMoney: null,
        overOrderMoney: null,
        saleMan: null,
        endUser: null,
        overOrderTax: null,
        companyId: null,
        orderTime: null,
        discountMoney: null,
        modelDispose: null,
        invoiceType: null,
        purchaseType: null,
        orderFile: 0,
        operatorStatus: "0",
        operatorId: null,
        operatorTime: null,
        operatorRemarks: null,
        purchaseStatus: null,
        deliverGoodsStatus: "0",
        invoiceStatus: "0",
        invoiceMoney: null,
        invoiceTime: null,
        returnStatus: null,
        returnMoney: null,
        lastReturnTime: null,
        totalSaleMoney: null,
        totalTaxMoney: null,
        totalMoney: null,
        repairStatus: "0",
        remarks: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
        opsType:null,
        infoList:[{
          materielId:null,
          meteringId:null,
          saleMoney:0,
          ratio:null,
          ratioMoney:0,
          money:0,
          number:null,
          modelDispose:null,
          purchase:null
        }]
      };
      this.orderFileList=[];
      this.resetForm("form");
    },
    //项目信息下拉框
    getProjectInfo(){
      projectAll().then(response=>{
        this.projectData=response.data;
      })
    },
    // 公司下拉框
    getCompanyInfo(){
      companyAll().then(response=>{
        this.companyData=response.data;
        console.log(response.data)
      })
    },
    // 物料下拉框
    getMaterielInfo(){
      materielAll().then(response=>{
        this.materielData=response.data;
      })
    },
    // 计量单位下拉框
    getmeteringInfo(){
      meteringAll().then(response=>{
        this.meteringData=response.data;
      })
    },
    // 客户下拉框查询
    getCustomerInfo(){
      customerAll().then(response=>{
        this.customerData=response.data;
      })
    },
    // 合同信息
    getContractInfo(value){
        console.log(value)
        const query={
            projectId:value
        }
        contractInfo(query).then(response => {
            console.log(response.data)
            this.form.saleMoney=response.data.budgetMoney
            this.form.customerId=response.data.customerId
            this.seal=response.data.seal
            this.contractUrl=response.data.contractUrl
            this.changeCustomer(response.data.customerId)
        });
    },
    /** 提交按钮 */
    submitForm(type) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            this.form.opsType=1
            updateOrderParent(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("编辑成功");
                this.$router.push({path:'/order/orderParent'})  
              }
            });
          }else{
            if (type == 1) {
              this.form.opsType=type
              addOrderParent(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.$router.push({path:'/order/orderParent'})
                }
              });
            } 
            if(type==0) {
              this.form.opsType=type
              addOrderParent(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("草稿保存成功");
                  this.$router.push({path:'/order/orderParent'})
                }
              });
            }
          }
        }
      });
    },
    /** 添加一行 */
    addLine(){
      this.form.infoList.push({
          ratio:this.ratios
      });
    },
    removeLine(item){
      var index = this.form.infoList.indexOf(item)
        if (index !== -1) {
          this.form.infoList.splice(index, 1)
        }
    },
    // 根据公司获取税率
    changeCompany(value){
      console.log(value)
      if(this.bl!=true){
        let data=this.companyData.map((item,index) =>{
          if(value==item.id){
            this.form.infoList.map((v)=>{
                v.ratio=item.ratio
                this.ratios=item.ratio
            })
          }
        });
      }else{
        console.log("111")
      }
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
      const extension4 = fileName=== 'bmp'
      
      if(!extension && !extension2 && !extension3&& !extension4) {
        this.$message({
            message: '上传文件只能是 pdf、png、jpg、bmp格式!',
            type: 'warning'
        });
        return false
      }
    },
    // 删除文件
    handleRemove(file, fileList){
      this.form.orderFile= 0;
      this.form.fileUrl=null
    },
    // 超出文件个数
    handleExceed(files, fileList){
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    // 保存合同副本文件
    orderHandleChange(file,fileList){
      let formdata = new FormData();
      formdata.append('file',file.raw);//传文件
      this.orderFormData = formdata;
    },
    //合同副本文件上传
    orderRequestUpload(file,fileList){
      const that = this;
      //项目安装要求
      uploadFile(this.orderFormData).then(res => {
        if(res.data){
          that.form.orderFile = res.data.fileId;
        }
      });
    },
    // 时间检验
    checkTime(){
      if(this.form.payTime != null && this.form.payTime != ""){
        const orderTime = new Date(this.form.orderTime) ;
        const payTime = new Date(this.form.payTime);
        if(orderTime.getTime() > payTime.getTime()){
          this.$message.warning('交付日期不可在订单日期之前');
          this.form.payTime = "";
          return false;
        }else{
          return true;
        }
      }
    },
    // 查询下单详情
    handleDetail(){
      if(this.$route.query.id==undefined){
        this.reset();
        this.title="订单新增"
      }else{
        this.reset();
        var id=this.$route.query.id
        getOrderParent(id).then(response => {
          this.form = response.data;
          this.contractUrl=response.data.contractUrl;
          this.seal=response.data.seal;
          this.operatorStatus=response.data.operatorStatus;
          let vm = this;
            // 图片
          if(response.data.fileUrl){ 
            let a = response.data.fileUrl
              if(a.length > 0) {
                a.forEach(item => {
                  var obj = {} 
                    let index = item.contractUrl.lastIndexOf('\/');
                    let fileName  = item.contractUrl.substring(index + 1, item.contractUrl.length); 
                    vm.$set(obj,'name',fileName);
                    vm.$set(obj,'url',item.contractUrl);
                    vm.orderFileList.push(obj);
                })
              }
          }
        });
        if(this.$route.query.type==0){
          this.title="订单编辑"
        }
        if(this.$route.query.type==1){
          this.title="订单详情"
        }
        if(this.$route.query.type==2){
          this.title="审核订单"
        }
      }
    },
    // 审核提交
    toExamine(type){
      console.log(type)
      this.$refs["form"].validate(valid => {
        if (valid) {
          const param={
            orderId:this.form.id,
            operatorRemarks:this.form.remarks,
            operatorStatus:type
          }
          console.log(param)
          getExamine(param).then(response => {
            if (response.code === 200) {
              this.msgSuccess("审核成功");
              this.$router.push({path:'/order/orderParent'})
            }
          });
        }
      });
    }
    
  }
};
</script>
<style scoped>
  .el-select{
    width: 100%
  }
  .form-box{
      padding: 2rem 2rem
  }
  .form-box .add{
      padding: 0 2rem
  }
  .page-footer .el-button{
      float: right;
      margin: 2rem 1rem 0 0;
  }
  .form-icon{
    font-size: 24px;
    margin-right: 8px;
    line-height: 34px;
  }
  .el-upload .el-button{
    margin: 0rem 1rem 0 0;
  }
  .titles{
    margin-top: 0
  }
  .detail .el-input__suffix{
    display: none;
  }
  /* .el-table{
    margin-bottom: 1.8rem;
  } */
  .add .el-form-item label{
    width: 120px
  }
  .add .el-form-item__content{
    margin-left: 120px
  }

  .infoList .el-table {
    margin-bottom:0rem;
  }
  .total{
    background: #F5F7FA;
    margin-bottom: 1.8rem;
    padding: 15px;
    color: #515a6e
  }
  .total span{
    font-weight: 600
  }
  .total div{
    display: inline-block;
    border: 1px solid #DCDFE6;
    padding: 8px 8px;
    border-radius: 3px;
    margin: 0 10px
  }
</style>
<style>
  .el-select{
    width: 100%
  }
  .form-box{
      padding: 2rem
  }
  .page-footer .el-button{
      float: right;
      margin: 2rem 1rem 0 0;
  }
  .form-icon{
    font-size: 24px;
    margin-right: 8px;
    line-height: 34px;
  }
  .el-upload .el-button{
    margin: 0rem 1rem 0 0;
  }
  .titles{
    margin-top: 0
  }
  .detail .el-input__suffix{
    display: none;
  }
  /* .el-table{
    margin-bottom: 1.8rem;
  } */
  .add .el-form-item label{
    width: 120px
  }
  .add .el-form-item__content{
    margin-left: 120px
  }
  .infoList .el-table {
    margin-bottom:0rem;
  }
  .total{
    background: #F5F7FA;
    margin-bottom: 1.8rem;
    padding: 15px;
    color: #515a6e
  }
  .total span{
    font-weight: 600
  }
</style>


