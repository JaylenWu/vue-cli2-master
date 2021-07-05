<template>
  <div class="upload-container d-flex">
    <!--使用draggable组件 start-->
    <draggable
      v-model="showList"
      chosenClass="chosen"
      forceFallback="true"
      group="people"
      animation="1000"
      @end="onEnd"
    >
      <transition-group tag="ul">
        <li v-for="item in showFileList" :key="item.id" class="img-grid ml-10">
          <img :src="item.url" alt="loading..." />
          <div class="icon-wrapper">
            <span
              class="drag-icon el-icon-zoom-in mr-10"
              @click="handlePreview(item)"
            ></span>
            <span class="drag-icon el-icon-rank mr-10"></span>
            <span
              class="drag-icon el-icon-delete"
              @click="handleRemove(item, index)"
            ></span>
          </div>
        </li>
      </transition-group>
    </draggable>
    <!--使用draggable组件 end-->

    <!-- 上传按钮 start-->
    <div class="upload-add grid-border ml-10">
      <input type="file" multiple @change="onChange" />
      <span class="icon-add">添加</span>
    </div>
    <!-- 上传按钮 end-->

    <!-- 预览弹窗 start-->
    <el-dialog append-to-body :visible.sync="preview.isOpened">
      <img width="100%" :src="preview.url" alt="" />
    </el-dialog>
    <!-- 预览弹窗 end-->

    <!-- 裁剪弹窗 start-->
    <el-dialog
      v-if="needCrop"
      title="裁剪"
      :visible.sync="isCropperOpened"
      append-to-body
      center
      :close-on-click-modal="false"
    >
      <div style="width: 100%; height: 300px">
        <vueCropper
          ref="cropper"
          auto-crop
          high
          full
          fixed
          :fixed-number="ratio"
          :img="cropperOptions.img"
          :output-size="cropperOptions.size"
          :output-type="cropperOptions.outputType"
        ></vueCropper>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-crop" @click="onCrop"
          >裁剪</el-button
        >
      </div>
    </el-dialog>
    <!-- 裁剪弹窗 end-->
  </div>
</template>
<script>
import service from "@/utils/request";
import draggable from "vuedraggable";
import { VueCropper } from "vue-cropper";
export default {
  name: "test",
  components: { draggable, VueCropper },
  props: {
    /** 图片列表 */
    fileList: { type: Array, default: () => [] },
    /** 提示 */
    tip: { type: String, default: "只能上传jpg/png文件" },
    /** 上传接口地址 */
    path: { type: String, required: true },
    /** 上传图片的其他参数 */
    options: { type: Object, default: () => {} },
    /** 上传的文件字段名 */
    name: { type: String, default: "" },
    /** 最大允许上传个数 */
    limit: { type: Number, default: 1 },
    /** 上传图片是否需要裁剪 */
    needCrop: { type: Boolean, default: false },
    /** 上传图片的比例限制 */
    ratio: { type: Array, default: () => [1, 1] },
  },
  computed: {
    action() {
      return process.env.VUE_APP_BASE_API + this.path;
    },
    showFileList() {
      return this.fileList;
    },
  },
  watch: {
    fileList(list) {
      this.onExceed(list);
    },
  },
  data() {
    return {
      showList: [], // 展示图片列表
      preview: {}, // 预览图片对象
      isCropperOpened: false, // 裁剪弹窗是否打开
      cropperOptions: {
        img: "",
        size: 300,
        outputType: "png",
        fileName: "",
      }, // 裁剪图片的选项
      uploadFile: null, // 裁剪上传
      base64Url: "", // 压缩显示的url, 暂时没用上
    };
  },
  methods: {
    // 图片change事件
    onChange(e) {
      const files = e.target.files;
      if (this.needCrop) {
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = (e) => {
          this.cropperOptions = {
            img: e.target.result,
            size: 300,
            outputType: "",
            fileName: files[0].name,
          };
          this.isCropperOpened = true;
        };
        return;
      }
      files.forEach((item) => {
        // this.onCompress(item); // 压缩图片
        const formData = new FormData();
        for (const prop in this.options) {
          formData.append(prop, this.options[prop]);
        }
        formData.append(this.name, item);
        this.upload(this.action, formData).then((result) => {
          const { data } = result;
          this.handleChange({ ...data, url: this.base64Url });
        });
      });
    },
    // 多图上传整理成list
    handleChange(list) {
      this.showList.push(list[0]);
      this.onEmitChange();
    },
    // 上传图片
    upload(url, formData) {
      return service.request({
        headers: {
          contentType: "multipart/form-data", // 需要指定上传的方式
        },
        url: url,
        method: "post",
        data: formData,
        timeout: 200000000, // 防止文件过大超时
      });
    },
    // 拖拽结束 触发change事件
    onEnd() {
      this.onEmitChange();
    },
    // 超过限制数目
    onExceed(list) {
      const length = list.length;
      if (length > this.limit) {
        this.showList = this.showList.slice(0, this.limit);
        alert("超过最大数目了");
        this.onEmitChange();
      }
    },
    // 预览
    handlePreview(item) {
      this.preview = {
        isOpened: true,
        url: item.url,
      };
    },
    // 删除
    handleRemove(item, index) {
      this.showList.splice(index, 1);
      this.onEmitChange();
    },
    // 裁剪
    onCrop() {
      this.$refs.cropper.getCropBlob((data) => {
        const { type } = data;
        const { fileName } = this.cropperOptions;
        const formData = new FormData();
        this.uploadFile = new File([data], fileName, {
          type,
        });
        for (const prop in this.options) {
          formData.append(prop, this.options[prop]);
        }
        formData.append(this.name, this.uploadFile);
        this.upload(this.action, formData).then((result) => {
          const { data } = result;
          this.handleChange(data);
          if (data) {
            this.isCropperOpened = false; // 需要一个状态标识 status, 这里暂时可以通过判断data是否存在确定
          }
        });
      });
    },
    // 压缩图片
    onCompress(file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        // console.log(e.target.result);
        var image = new Image();
        image.src = e.target.result;
        image.onload = (res) => {
          console.log(res.path[0].width, res.path[0].height);
          const ratio = res.path[0].width / res.path[0].height;
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = 100 * ratio;
          canvas.height = 100;
          ctx.drawImage(
            image,
            0,
            0,
            res.path[0].width,
            res.path[0].height,
            0,
            0,
            100 * ratio,
            100
          );
          var base64Code = canvas.toDataURL("image/png");
          // console.log(base64Code);
          this.base64Url = base64Code;
        };
      };
    },
    // 触发父组件change事件
    onEmitChange() {
      this.$emit(
        "change",
        this.showList.map((item) => {
          const { url } = item;
          return {
            ...item,
            url: process.env.VUE_APP_BASE_File + url,
          };
        })
      );
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/components/BaseUpload/index.scss";
</style>