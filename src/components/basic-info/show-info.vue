<style lang='less'>
  // .table-basic-vue {}
</style>
<template>
  <div class="table-basic-vue frame-page h-panel">
    <div class="h-panel-bar"><span class="h-panel-title">信息预览</span></div>
    <template>
      <div v-bg-color:gray4 style="padding-top:20px;">
        <Tabs :datas="tabs" class-name="h-tabs-card" v-model="selected" @change="tabChange"></Tabs>
      </div>
      <!-- 种植区域的div -->
      <div v-if="selected === 'module2'" class="h-panel-body">
        <h4>各种植区域传感器数量</h4>
        <div>
          <Tabs :datas="subTabs" className="common-status-filter-tabs" @change="areaTabChange">
            <template slot-scope="{tab}" slot="item">
              <p class="code">{{counts[`${tab.key}`] || 0}}</p>
              <p class="name">{{tab.title}}</p>
            </template>
          </Tabs>
        </div>
        <br/>
        <Table :loading="loading" :datas="plantingAreaDatas">
          <TableItem title="序号">
            <template slot-scope="{index}">{{index+1}} </template>
          </TableItem>
          <TableItem :width="300" prop="regionName" title="地区名称"></TableItem>
          <TableItem :width="300" prop="sensorNum" title="地区传感器总数"></TableItem>
          <TableItem :width="300" prop="regionCode" title="地区编码"></TableItem>
          <TableItem :width="300" prop="area" title="地区面积"></TableItem>
        </Table>
        <p></p>
        <Pagination
          v-if="pagination.total>0"
          align="center"
          v-model="pagination"
          @change="changePage"
          small
          layout="total,pager,jumper"/>
      </div>
      <!-- 传感器的div，设置为v-else是为了有默认或bug情况 -->
      <div v-else class="h-panel-body">
        <div class="common-filter-bar">
          <div class="float-right">
            <Select class="common-filter-select" autosize v-width="160" v-model="sort" :datas="sortList" :no-border="true" @input="getData(true)" :null-option="false" placeholder="请选择您的内容"></Select>
          </div>
        </div>
        <Table :loading="loading" :datas="sensorDatas" align='center'>
          <TableItem title="序号" align='center'>
            <template slot-scope="{index}">{{index+1}} </template>
          </TableItem>
          <TableItem :width="200" prop="sensorCode" title="传感器编号" align='center'></TableItem>
          <TableItem :width="200" prop="state" title="状态" align='center'></TableItem>
          <TableItem :width="200" prop="obArea" title="观测面积" align='center'></TableItem>
          <TableItem :width="200" prop="regionSerial" title="地区序列号" align='center'></TableItem>
          <TableItem :width="200" prop="regionCode" title="所属地区编码" align='center'></TableItem>
          <TableItem :width="200" prop="regionName" title="所属地区名称" align='center'></TableItem>
          <TableItem :width="200" prop="setTime" title="设置时间" align='center'></TableItem>
          <TableItem title="操作" :width="100" fixed="right">
            <template slot-scope="scope">
              <button class="h-btn h-btn-s h-btn-red" @click="removeSensor(scope.data, scope.index)"><i class="h-icon-trash"></i></button>
            </template>
          </TableItem>
        </Table>
        <p></p>
        <Pagination
          v-if="pagination.total>0"
          align="center"
          v-model="pagination"
          @change="changePage"
          small
          layout="total,pager,jumper"/>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  data() {
    return {
      keyword: '',
      tabs: {
        module1: '传感器',
        module2: '种植区域'
      },
      selected: 'module1', // 默认区域
      sort: 'updatedAt:desc',
      sortList: {
        'updatedAt:desc': '按时间倒序',
        'updatedAt:asc': '按时间正序'
      },
      pagination: {
        page: 1,
        size: 15,
        total: 0
      },
      subTabs: [
        { key: 'Corn', title: '玉米' },
        { key: 'Wheat', title: '小麦' }
      ],
      type: 'China',
      sessionDatas: [],
      constCache: {},
      sensorDatas: [], // 传感器的data
      plantingAreaDatas: [], // 种植区域的data
      counts: {
        Corn: 900,
        Wheat: 90
      },
      loading: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getData(true, 'module1');
    },
    tabChange(data) {
      this.getData(true, data.key);
    },
    // 将接口返回列表数据处理成以页码号为key，每pageSize长度的列表方便显示
    parseAjaxList2CacheObj(arr, pageSize) {
      if (!arr || arr.length === 0) {
        return { '1': [] };
      }
      let res = {};
      let copyArr = Utils.copy(arr);
      let keyNum = ~~(copyArr.length / pageSize);
      for (let i = 1; i <= keyNum + 1; i++) {
        res['' + i] = copyArr.splice(0, pageSize);
      }
      return res;
    },
    // 在数组中查找item，满足key，val与所需相同，并返回一个list
    searchAppointKey(arr, key, val) {
      let res = [];
      if (arr && arr.length !== 0) {
        for (let i = 0; i < arr.length; i++) {
          const item = arr[i];
          if (item[key] === val) {
            res.push(item);
          }
        }
      }
      this.pagination.total = res.length;
      return res;
    },
    changePage(val) {
      let that = this;
      console.log(that.sessionDatas);
      if (that.selected === 'module1') {
        that.sensorDatas = this.constCache[val.cur];
      } else {
        that.plantingAreaDatas = this.constCache[val.cur];
      }
    },
    areaTabChange(data) {
      let that = this;
      that.loading = true;
      let curList = that.searchAppointKey(that.sessionDatas, 'regionName', data.title);
      that.constCache = that.parseAjaxList2CacheObj(curList, that.pagination.size);
      that.plantingAreaDatas = that.constCache['1'];
      that.loading = false;
      that.pagination.page = 1;
    },
    getData(reload = false, selected = 'module1') {
      let that = this;
      if (reload) {
        that.pagination.page = 1;
      }
      that.loading = true;
      if (selected === 'module1') {
        let time = new Date().getTime();
        R.basicInfo.getAllSensorInfo('' + time).then(resp => {
          that.sessionDatas = resp.data;
          that.pagination.total = resp.data.length;
          that.loading = false;
          that.constCache = that.parseAjaxList2CacheObj(that.sessionDatas, that.pagination.size);
          that.sensorDatas = that.constCache['1'];
        });
      } else {
        let time = new Date().getTime();
        R.basicInfo.getAllSensorInfo('' + time).then(resp => {
          that.sessionDatas = resp.data;
          that.pagination.total = resp.data.length;
          that.loading = false;
          that.constCache = that.parseAjaxList2CacheObj(that.sessionDatas, that.pagination.size);
          that.plantingAreaDatas = that.constCache['1'];
        });
      }
    },
    removeSensor(data, index) {
      let curPage = this.pagination.page;
      let idx = this.pagination.size * (curPage - 1) + index;
      console.log(idx);
      if (this.plantingAreaDatas.length === 1 || this.sensorDatas.length === 1) {
        this.changePage(curPage - 1);
      } else {
        if (this.selected === 'module1') {
          this.sensorDatas.splice(index, 1);
        } else {
          this.plantingAreaDatas.splice(index, 1);
        }
      }
      this.sessionDatas.splice(idx, 1);
      this.constCache = this.parseAjaxList2CacheObj(this.sessionDatas, this.pagination.size);
      this.pagination.total -= 1;
      console.log(this.sessionDatas);
      console.log(this.constCache);
    }
  },
  computed: {

  }
};
</script>
