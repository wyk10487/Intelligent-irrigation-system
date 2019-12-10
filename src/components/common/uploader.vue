<template>
  <div>
    <Uploader @fileclick="fileclick" :type="type" :files="value" :data-type="dataType" :limit="limit" :uploadList="uploadList" ref="uploader" :dragdrop="dragdrop" :class-name="className" @deletefile="deletefile">
      <div slot="dragdrop" v-if="$slots.dragdrop"><slot name="dragdrop"></slot></div>
    </Uploader>
  </div>
</template>
<script>
import Plupload from 'plupload-es6';
import bus from '../../js/common/bus';

export default {
  props: {
    options: {
      type: Object,
      default: () => { }
    },
    type: {
      type: String,
      default: 'image'
    },
    dataType: String,
    dragdrop: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Object, Array, String]
    },
    limit: Number,
    className: String
  },
  data() {
    return {
      uploadList: []
    };
  },
  methods: {
    deletefile(index) {
      let value = null;
      if (this.type == 'images' || this.type == 'files') {
        value = Utils.copy(this.value);
        value.splice(index, 1);
      } else {
        value = null;
        this.uploadList = [];
      }
      this.$emit('input', value);
    },
    init() {
      let that = this;
      // uploader文档请参考http://www.cnblogs.com/2050/p/3913184.html
      let param = {
        runtimes: 'html5',
        browse_button: this.$refs.uploader.getBrowseButton(),
        chunk_size: '4mb',
        unique_names: true,
        auto_start: false,
        init: {
          FilesAdded(up, files) {
            if (that.limit && (files.length + that.value.length > that.limit)) {
              that.$Message.error(`你上传的文件超过${that.limit}个。`);
              return;
            }
            files.forEach((file) => {
              if (FileReader) {
                let reader = new FileReader();
                // reader.onload = function () {
                // }
                // readAsDataURL得到图片src,实质为一个base64编码的数据
                // getNative获取原生的文件对象
                reader.readAsDataURL(file.getNative());
              }
              that.uploadList.push(file);
            });
            up.start();
          },
          // 上传文件之前的钩子函数
          // BeforeUpload(up, file) {},
          // 会在文件上传过程中不断触发，可以用此事件来显示上传进度
          // UploadProgress(up, file) {},
          FileUploaded(up, file, info) {
            // log('FileUploaded', file.status);
            let imgUrl = JSON.parse(info.response.data.imgUrl);
            let sourceLink = `${imgUrl}`; // 获取上传成功后的文件的Url
            file.url = sourceLink;
          },
          Error(up, err, errTip) {
            that.uploadList.splice(0, that.uploadList.length);
            that.$Message.error(errTip);
          },
          UploadComplete() {
            bus.$emit('completeUpload');
            let fileList = that.$refs.uploader.getFileList();
            //   fileList.map(item=>{
            //     // 对返回的数据做最后的组装
            //     // item.type = 5;
            //     // item.fileType = ...
            //   })
            that.$emit('input', fileList);
            if (that.type == 'images') {
              that.uploadList.splice(0, that.uploadList.length);
            }
          }
        }
      };
      if (this.dragdrop) {
        param.dragdrop = true;
        param.drop_element = this.$refs.uploader.getDropElement();
      }
      Utils.extend(param, this.options);
      const uploader = new Plupload.plupload.Uploader(param);
      param.multi_selection = false;
      uploader.init();
      console.log(uploader);
    },
    fileclick(file) {
      this.$Modal({
        title: '预览或者下载',
        content: `自定义处理文件预览或者下载`
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  }
};
</script>
