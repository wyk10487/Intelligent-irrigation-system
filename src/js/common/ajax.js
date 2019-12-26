import axios from 'axios';
import qs from 'qs';
import Utils from './utils';

const DefaultParam = { repeatable: false };

let ajax = {
  PREFIX: 'http://localhost:8082/intelligent-irrigation',
  Author: Utils.getAuthor() || 'wyk',
  requestingApi: new Set(),
  extractUrl: function (url) {
    return url ? url.split('?')[0] : '';
  },
  isRequesting: function (url) {
    let api = this.extractUrl(url);
    return this.requestingApi.has(api);
  },
  addRequest: function (url) {
    let api = this.extractUrl(url);
    this.requestingApi.add(api);
  },
  deleteRequest: function (url) {
    let api = this.extractUrl(url);
    this.requestingApi.delete(api);
  },
  get: function (url, param, extendParam) {
    let params = {
      url,
      method: 'GET'
    };
    return this.ajax(params, extendParam);
  },
  post: function (url, param, extendParam) {
    return this.ajax({
      url,
      method: 'POST',
      data: param
    }, extendParam);
  },
  ajax: function (param, extendParam) {
    let params = Utils.extend({}, DefaultParam, param, extendParam || {});
    params.crossDomain = params.url.indexOf('http') === 0;
    let url = params.url;
    if (!params.crossDomain) {
      url = params.url = this.PREFIX + params.url;
    }
    if (params.method != 'GET') {
      if (this.isRequesting(url)) {
        return new Promise((resolve, reject) => { resolve({ status: 409, msg: '重复请求' }); });
      }
      if (params.repeatable === false) {
        this.addRequest(url);
      }
    }
    let header = {
      author: this.Author,
      Authorization: Utils.getLocal('token')
    };
    let defaultParam = {
      headers: header,
      responseType: 'json',
      validateStatus: function (status) {
        return true;
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { allowDots: true });
      }
    };
    if (params.crossDomain) {
      defaultParam.headers = {};
    }
    let that = this;
    params = Utils.extend({}, defaultParam, params);
    return new Promise((resolve) => {
      return axios.request(params).then((response) => {
        that.deleteRequest(params.url);
        let data = response.data;
        let status = response.status;
        if (status != 200) {
          if (status == 401) {
            window.top.location = '/login';
            return;
          }
          if (status == 500) {
            HeyUI.$Message.error('后台异常');
          } else if (status == 404) {
            HeyUI.$Message.error('请求不存在');
          } else if (status != 200) {
            HeyUI.$Message.error(data._msg || '请求异常');
          }
        }
        resolve(data);
      }).catch(() => {
        that.deleteRequest(params.url);
        resolve({
          status: 409
        });
      });
    });
  }
};
export default ajax;
