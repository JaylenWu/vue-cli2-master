<template>
  <div>
    <div>
      <UploadImage
        :file-list="list"
        name="files"
        :limit="2"
        :needCrop="false"
        path="ht/file/uploadImages"
        :options="{ fileCode: 'aboutCYCImg' }"
        @change="onUploadImage($event)"
      />
    </div>
    <input type="button" value="保存" class="mt-20 ml-10" @click="onSaveData" />
  </div>
</template>
<script>
import UploadImage from "@/components/upload";
export default {
  name: "Test",
  components: { UploadImage },
  data() {
    return {
      list: [],
      form: {},
    };
  },
  methods: {
    onUploadImage(list) {
      this.list = list;
      const imgIds = list.map((item) => item.id);
      this.$set(this.form, "imgIds", imgIds);
    },
    onSaveData() {
      console.log(this.form);
    },
  },
};
</script>
<style scoped>
</style>