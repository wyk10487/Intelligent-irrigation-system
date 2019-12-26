import Ajax from './ajax';

const Request = {
  Dict: {
    get() {
      return Ajax.get(`/dict`);
    }
  },
  Home: {
    getMessageList() {
      return Ajax.get(`/home/messages`);
    }
  },
  Account: {
    menus() {
    }
  },
  Login: {
    login(param) {
      return Ajax.post('/login', param);
    }
  },
  basicInfo: {
    getAllSensorInfo(time) {
      return Ajax.get('/getAllSensorInfo' + `?qTime=${time}`);
    },
    getAllRegionInfo(time) {
      return Ajax.get('/getAllRegionInfo' + `?qTime=${time}`);
    }
  },
  Management: {
    users(params) {
      return Ajax.get('/management/users', params);
    },
    roles(params) {
      return Ajax.get('/management/roles', params);
    }
  }
};

export default Request;
