<style lang="less">
.basic-form-vue {
  .h-panel-body {
    padding-right: 60px;
  }
}
.search-table {
  border-radius: 8px;
  margin-top: 20px;
  align-items: center;
}
.div-form {
  border: 1px solid #999999;
  margin: 20px 0;
}
</style>

<template>
  <div class="app-form frame-page basic-form-vue">
    <div class="h-panel">
      <div class="h-panel-bar">
        <span class="h-panel-title">信息查询</span>
      </div>
      <div class="h-panel-body">
        <Form :label-width="110" mode="twocolumn" :model="searchParams" :rules="validationRules" ref="form">
          <FormItem label="查询类型" prop="type">
            <Radio v-model="searchParams.type" :datas="selectSearchType" @change="radioChange"></Radio>
          </FormItem>
          <FormItem label="请求时间" prop="qTime">
            <template>
              <div>
                <DatePicker v-model="searchParams.qTime" type="datetime" :has-seconds="true" :option="{ minuteStep:30 }"></DatePicker>
              </div>
            </template>
          </FormItem>
          <FormItem v-if="showTableType === 'sensor' || showTableType === 'strategy'" label="传感器编号" prop="sensorCode">
            <input type="text" v-model="searchParams.sensorCode" />
          </FormItem>
          <FormItem v-if="showTableType === 'sensor' || showTableType === 'strategy'" label="时间段长度" prop="timeLine">
            <Select v-model="searchParams.timeLine" :datas="selectTimeLine"></Select>
          </FormItem>
          <FormItem v-if="showTableType === 'manager'" label="人员编号" prop="regionAdmin">
            <input  type="text" v-model="searchParams.regionAdmin" />
          </FormItem>
          <FormItem v-if="showTableType === 'manager'" label="管理员类型" prop="managerType">
            <Radio v-model="searchParams.managerType" :datas="selectManagerType"></Radio>
          </FormItem>
          <FormItem v-if="showTableType === 'region'" label="地区编号" prop="regionCode">
            <input type="text" v-model="searchParams.regionCode" />
          </FormItem>
          <FormItem v-if="showTableType === 'region'" label="地区名称" prop="regionName">
            <input type="text" v-model="searchParams.regionName" />
          </FormItem>
          <FormItem :no-padding="true">
            <Button color="primary" :loading="isLoading" @click="search">查找</Button>&nbsp;&nbsp;&nbsp;
            <Button @click="resetCheck">重置验证</Button>
            <Button @click="resetData">重置数据</Button>
          </FormItem>
        </Form>
        <div class="search-table div-form">
          <Form :label-width="110" mode="twocolumn" :model="searchRes" ref="form">
            <FormItem label="Readonly" readonly>只读数据</FormItem>
            <FormItem label="Readonly" readonly>只读数据</FormItem>
            <FormItem label="Readonly" readonly>只读数据</FormItem>
            <FormItem label="Readonly" readonly>只读数据</FormItem>
          </Form>
        </div>
        <Table v-if="showTableType === 'sensor'" :loading="isLoading" :datas="searchRes" class="search-table">
          <TableItem title="序号">
            <template slot-scope="{index}">{{index+1}} </template>
          </TableItem>
          <TableItem :width="240" prop="soilTemp" title="当前土壤温度"></TableItem>
          <TableItem :width="240" prop="soilEvapor" title="当前土壤蒸发速率"></TableItem>
          <TableItem :width="240" prop="soilMoist" title="当前土壤湿度"></TableItem>
          <TableItem :width="240" prop="airTemp" title="当前土壤温度"></TableItem>
          <TableItem :width="240" prop="estimatedLoss" title="当前是否需要浇水"></TableItem>
          <TableItem :width="240" prop="distancePoint" title="距开始的时间长度"></TableItem>
        </Table>
        <Table v-if="showTableType === 'region'" :loading="isLoading" :datas="searchRes" class="search-table">
          <TableItem title="序号">
            <template slot-scope="{index}">{{index+1}} </template>
          </TableItem>
          <TableItem :width="252" prop="sensorCode" title="传感器编号"></TableItem>
          <TableItem :width="252" prop="state" title="传感器状态"></TableItem>
          <TableItem :width="252" prop="position" title="地点位置"></TableItem>
          <TableItem :width="252" prop="regionName" title="所属地区名称"></TableItem>
          <TableItem :width="252" prop="obArea" title="传感器观测面积"></TableItem>
        </Table>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      mode: 'single',
      showTableType: 'sensor',
      selectSearchType: [{ title: '传感器', key: 0 }, { title: '管理人员', key: 1 }, { title: '种植区域', key: 2 }, { title: '灌溉策略', key: 3 }],
      selectTimeLine: [{ title: '1h', key: 0 }, { title: '2h', key: 1 }, { title: '3h', key: 2 }, { title: '6h', key: 3 }, { title: '12h', key: 4 }, { title: '24h', key: 5 }, { title: '48h', key: 6 }, { title: '72h', key: 7 }],
      selectManagerType: [{ title: '超级管理员', key: 0 }, { title: '普通管理员', key: 1 }],
      searchParams: {
        uId: '',
        type: 0,
        uType: 0,
        qTime: '',
        timeLine: 0,
        sensorCode: '',
        regionCode: '',
        regionName: '',
        managerType: 0,
        regionAdmin: ''
      },
      isLoading: false,
      searchRes: [],
      validationRules: {
        rules: {
        },
        required: [
          'type',
          'qTime',
          'timeLine',
          'sensorCode',
          'regionCode',
          'regionName',
          'managerType',
          'regionAdmin'
        ]
      }
    };
  },
  methods: {
    init() {
      // this.resetParams = Utils.copy(this.searchParams);
    },
    search() {
      let that = this;
      that.isLoading = true;
      console.log(that.searchParams);
      // todo：下面要做ajax
      if (that.searchParams.type === 0 || that.searchParams.type === 3) {
        if (that.checkSearchParams(that.searchParams, 0)) {
        }
      } else if (that.searchParams.type === 1) {
        if (that.checkSearchParams(that.searchParams, 1)) {
        }
      } else if (that.searchParams.type === 2) {
        if (that.checkSearchParams(that.searchParams, 2)) {
        }
      }
      that.isLoading = false;
    },
    checkSearchParams(params, type) {
      if (type === 0) {
        return typeof params.timeLine === 'number' && params.sensorCode.length > 0 && params.qTime.length > 0;
      } else if (type === 1) {
        return typeof params.managerType === 'number' && params.regionAdmin.length > 0 && params.qTime.length > 0;
      } else {
        return params.regionName.length > 0 && params.regionCode.length > 0 && params.qTime.length > 0;
      }
    },
    resetCheck() {
      this.isLoading = false;
      this.$refs.form.resetValid();
    },
    resetData() {
      this.isLoading = false;
      this.$refs.form.resetValid();
      this.searchParams = {
        uId: '',
        type: 0,
        uType: 0,
        qTime: '',
        timeLine: '',
        sensorCode: '',
        regionCode: '',
        regionName: '',
        managerType: '',
        regionAdmin: ''
      };
    },
    radioChange(e) {
      if (e.key === 0) {
        this.showTableType = 'sensor';
      } else if (e.key === 1) {
        this.showTableType = 'manager';
      } else if (e.key === 2) {
        this.showTableType = 'region';
      } else if (e.key === 3) {
        this.showTableType = 'strategy';
      }
      console.log(this.searchParams);
    }
  },
  mounted() {
    this.init();
  }
};
</script>
