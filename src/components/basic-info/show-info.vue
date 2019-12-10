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
          <TableItem :width="250" prop="sensorCode" title="传感器编号" align='center'></TableItem>
          <TableItem :width="250" prop="state" title="状态" align='center'></TableItem>
          <TableItem :width="230" prop="obArea" title="观测面积" align='center'></TableItem>
          <TableItem :width="250" prop="position" title="位置" align='center'></TableItem>
          <TableItem :width="250" prop="regionCode" title="所属地区编码" align='center'></TableItem>
          <TableItem :width="250" prop="regionName" title="所属地区名称" align='center'></TableItem>
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
      counts: {},
      loading: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getData(true, 'module1');
      this.getCounts();
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
      let keyNum = ~~(arr.length / pageSize);
      for (let i = 1; i <= keyNum + 1; i++) {
        res['' + i] = arr.splice(0, pageSize);
      }
      return res;
    },
    // 在某列表中查找item，满足key，val与所需相同，并返回一个list
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
      if (that.selected === 'module1') {
        this.sensorDatas = that.constCache[val.cur];
      } else {
        this.plantingAreaDatas = that.constCache[val.cur];
      }
    },
    areaTabChange(data) {
      let that = this;
      that.loading = true;
      let cur = that.searchAppointKey(that.sessionDatas, 'regionName', data.title);
      that.constCache = that.parseAjaxList2CacheObj(cur, that.pagination.size);
      that.plantingAreaDatas = that.constCache['1'];
      that.loading = false;
      that.pagination.page = 1;
    },
    getCounts() {
      setTimeout(() => {
        this.counts = {
          Corn: 900,
          Wheat: 90
        };
      }, 1000);
    },
    getData(reload = false, selected = 'module1') {
      let that = this;
      if (reload) {
        that.pagination.page = 1;
      }
      that.loading = true;
      if (selected === 'module1') {
        setTimeout(() => {
          that.sessionDatas = [{ sensorCode: 'Dakota Rice1', state: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: 'part1' },
            { sensorCode: 'Dakota Rice2', state: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: 'part1' },
            { sensorCode: 'Dakota Rice3', state: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: 'part1' },
            { sensorCode: 'Dakota Rice4', state: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: 'part1' },
            { sensorCode: 'Dakota Rice5', state: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: 'part1' },
            { sensorCode: 'Dakota Rice6', state: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: 'part1' },
            { sensorCode: 'Dakota Rice7', state: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: 'part1' },
            { sensorCode: 'Dakota Rice8', state: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: 'part1' },
            { sensorCode: 'Dakota Rice7', state: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: 'part1' },
            { sensorCode: 'Dakota Rice7', state: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: 'part1' },
            { sensorCode: 'Dakota Rice7', state: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: 'part1' },
            { sensorCode: 'Dakota Rice7', state: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: 'part1' },
            { sensorCode: 'Dakota Rice7', state: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: 'part1' },
            { sensorCode: 'Dakota Rice7', state: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: 'part1' },
            { sensorCode: 'Dakota Rice7', state: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: 'part1' },
            { sensorCode: 'Dakota Rice7', state: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: 'part1' },
            { sensorCode: 'Dakota Rice7', state: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: 'part1' } ];
          that.pagination.total = that.sessionDatas.length;
          that.loading = false;
          that.constCache = that.parseAjaxList2CacheObj(that.sessionDatas, that.pagination.size);
          that.sensorDatas = that.constCache['1'];
        }, 1000);
      } else {
        setTimeout(() => {
          that.sessionDatas = [{ sensorNum: 'Dakota Rice1', area: '$36,738', obArea: '10m2', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: '玉米' },
            { sensorNum: 'Dakota Rice2', area: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: '玉米' },
            { sensorNum: 'Dakota Rice3', area: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: '玉米' },
            { sensorNum: 'Dakota Rice4', area: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: '玉米' },
            { sensorNum: 'Dakota Rice5', area: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: '玉米' },
            { sensorNum: 'Dakota Rice6', area: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: '玉米' },
            { sensorNum: 'Dakota Rice7', area: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: '玉米' },
            { sensorNum: 'Dakota Rice8', area: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: '小麦' },
            { sensorNum: 'Dakota Rice7', area: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: '小麦' },
            { sensorNum: 'Dakota Rice7', area: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: '小麦' },
            { sensorNum: 'Dakota Rice7', area: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: '小麦' },
            { sensorNum: 'Dakota Rice7', area: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: '小麦' },
            { sensorNum: 'Dakota Rice7', area: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: '小麦' },
            { sensorNum: 'Dakota Rice7', area: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: '玉米' },
            { sensorNum: 'Dakota Rice7', area: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: '玉米' },
            { sensorNum: 'Dakota Rice7', area: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: '玉米' },
            { sensorNum: 'Dakota Rice7', area: '$36,738', position: 'Niger', regionCode: 'Oud-Turnhout', regionName: '玉米' } ];
          that.pagination.total = that.sessionDatas.length;
          that.loading = false;
          that.constCache = that.parseAjaxList2CacheObj(that.sessionDatas, that.pagination.size);
          that.plantingAreaDatas = that.constCache['1'];
        }, 1000);
      }
    }
  },
  computed: {

  }
};
</script>
