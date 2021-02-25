<template>
  <div :class="className" :style="{height:height,width:width}" v-if="this.role == 'admin'">
    <el-row :gutter="10">
      <el-col :style="{width:widths,textAlign:center}">
        <router-link :to="{name:'ProjectInfo'}"><img src="../../assets/image/approval.png" class="image"></router-link>
        <div style="padding: 14px;">
            <span class="data">{{this.cardData.xiangmu}}</span>个<br>
            <span class="block">立项审核</span>
        </div>
      </el-col>
      <el-col :style="{width:widths,textAlign:center}">
        <router-link :to="{name:'OrderParent'}"><img src="../../assets/image/Order.png" class="image"></router-link>
        <div style="padding: 14px;">
            <span class="data">{{this.cardData.dingdan}}</span>个<br>
            <span class="block">订单审核</span>
        </div>
      </el-col>
      <el-col :style="{width:widths,textAlign:center}">
        <router-link :to="{name:'PurchaseParent'}"><img src="../../assets/image/purchase.png" class="image"></router-link>
        <div style="padding: 14px;">
            <span class="data">{{this.cardData.caigoudan}}</span>个<br>
            <span class="block">采购单审核</span>
        </div>
      </el-col>
      <el-col :style="{width:widths,textAlign:center}">
        <router-link :to="{path:'/repair/source'}"><img src="../../assets/image/school.png" class="image"></router-link>
        <div style="padding: 14px;">
            <span class="data">{{this.cardData.inrepair}}</span>个<br>
            <span class="block">维修配件审核</span>
            <span>(校内)</span>
        </div>
      </el-col>
      <el-col :style="{width:widths,textAlign:center}">
        <router-link :to="{path:'/repairOut/source'}"><img src="../../assets/image/outside.png" class="image"></router-link>
        <div style="padding:14px;">
            <span class="data">{{this.cardData.outrepair}}</span>个
            <span class="block">维修配件审核</span>
            <span>(校外)</span>
        </div>
      </el-col>
    </el-row>
  </div>
  <div :class="className" :style="{height:height,width:width}" v-else>
    <el-row :gutter="10" v-for="(items,index) in data">
      <el-col :style="{width:widths,textAlign:center}" v-for="(item,index) in items.list">
        <img :src="imgUrl+item.pic" class="image">
        <div style="padding: 14px;">
            <span class="data">{{item.value}}</span>个<br>
            <span class="block">{{item.key}}</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getBackLog, getProjectManager,getBackLogByRole,getRole} from "@/api/index";

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    widths:{
      type: String,
      default: '20%'
    },
    center:{
      type: String,
      default: 'center'
    }
  },
  data(){
    return {
      cardData:{},
      data:[],
      role:'',
      imgUrl:'http://qinyin.chinashiyue.cn:8099'
    }
  },
  created(){
    this.getRole()
  },
  methods: {
    getBackLog(){
      getBackLog().then(response => {
        this.cardData = response.data;
      });
    },
    getBackLogByRole(){
      getBackLogByRole().then(response => {
        this.data = response.data;
      });
    },
    getRole(){
      getRole().then(response => {
        var el = response.data[response.data.length - 1]
        this.role=el.roleKey
        if(el.roleKey!='admin'){
          this.getBackLogByRole()
        }else{
          this.getBackLog();
        }
      });
    },
  }
}
</script>
<style lang="scss" scoped>
  .data{
    font-weight: 600;
  }
  .block{
    margin-top: 10px;
    display: block;
  }
  .image{
    margin-top: 30px
  }
</style>


