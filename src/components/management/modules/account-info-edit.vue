<style lang='less'>
.account-info-vue {
  padding: 30px 30px 30px 0;
  max-width: 500px;
}

</style>
<template>
  <div class="account-info-vue">
    <Form :model="acc" :rules="rules" ref="form" showErrorTip>
      <FormItem label="姓名" prop="name">
        <input type="text" v-model="acc.name"/>
      </FormItem>
      <FormItem label="类别" prop="desc">
        <input type="text" v-model="acc.desc" readonly/>
      </FormItem>
      <FormItem label="编号" prop="id">
        <input type="text" v-model="acc.id" readonly/>
      </FormItem>
      <FormItem label="邮箱" prop="email">
        <input type="text" v-model="acc.email"/>
      </FormItem>
      <FormItem label="手机" prop="mobile">
        <input type="text" v-model="acc.mobile"/>
      </FormItem>
      <FormItem label="公司" prop="org">
        <input type="text" v-model="acc.org"/>
      </FormItem>
      <FormItem label="职位" prop="title">
        <input type="text" v-model="acc.title"/>
      </FormItem>
      <FormItem label="地址" prop="location">
        <input type="text" v-model="acc.location"/>
      </FormItem>
      <FormItem label="" prop="location">
        <Button color="primary" @click="save" :loading="saveloading">保存</Button>
        <Button @click="reset">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import store from 'js/vuex/store';

export default {
  props: {
    account: Object
  },
  data() {
    return {
      acc: Utils.copy(this.account),
      listener: null,
      saveloading: false,
      read: true,
      uploadList: [],
      rules: {
        required: ['name', 'id', 'mobile', 'desc', 'email', 'org'],
        email: ['email'],
        mobile: ['mobile']
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  beforeDestroy() {
    G.removelistener(this.listener);
  },
  methods: {
    init() {
      this.listener = G.addlistener('completeUpload', (data) => {
        log(`图片： ${data.files}`);
      });
    },
    save() {
      if (!this.$refs.form.valid().result) return;
      this.saveloading = true;
      let newAcc = Utils.copy(this.acc);
      if (this.acc.desc === newAcc.desc && this.acc.id === newAcc.id) {
        setTimeout(() => {
          this.saveloading = false;
          store.dispatch('updateAccount', newAcc);
          this.$Message({
            'type': 'success',
            'text': '保存成功！'
          });
        }, 1000);
      } else {
        this.$Message({
          'type': 'error',
          'text': '保存信息格式有误！'
        });
      }
    },
    reset() {
      this.read = false;
      this.$refs.form.resetValid();
      let newAcc = Utils.copy(this.account);
      this.acc = {
        avatar: newAcc.avatar,
        desc: newAcc.desc,
        id: newAcc.id
      };
    },
    fileclick(file) {
      console.log('fileclick');
      this.$Modal({
        title: '预览或者下载',
        content: `自定义处理文件预览或者下载`
      });
    }
  },
  computed: {

  }
};
</script>
