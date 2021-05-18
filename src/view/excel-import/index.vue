<template>
  <div class="hello">
    <div class="d-flex mt-20 align-items-start">
      <table border="1" cellspacing="0" id="table1">
        <tr>
          <td>一级标题(表1)</td>
          <td>二级标题(表1)</td>
        </tr>
        <tr>
          <td>1</td>
          <td>1</td>
        </tr>
        <tr>
          <td>2</td>
          <td>2</td>
        </tr>
        <tr>
          <td>3</td>
          <td>3</td>
        </tr>
        <tr>
          <td>4</td>
          <td>4</td>
        </tr>
        <tr>
          <td>5</td>
          <td>5</td>
        </tr>
      </table>
      <table border="1" cellspacing="0" id="table2" class="ml-20">
        <tr>
          <td>一级标题(表2)</td>
          <td>二级标题(表2)</td>
        </tr>
        <tr>
          <td>1</td>
          <td>1</td>
        </tr>
        <tr>
          <td>2</td>
          <td>2</td>
        </tr>
        <tr>
          <td>3</td>
          <td>3</td>
        </tr>
        <tr>
          <td>4</td>
          <td>4</td>
        </tr>
        <tr>
          <td>5</td>
          <td>5</td>
        </tr>
      </table>
      <input
        type="button"
        value="导出Table"
        class="ml-20"
        @click="handleTable"
      />
    </div>

    <div class="d-flex mt-20">
      <input type="file" @change="handleImport" @drop="handleDrop" />
      <input type="button" value="下载" @click="handleDownLoad" />
    </div>
  </div>
</template>

<script>
import XLSX from "xlsx";
import Table from "@/components/table";
import { export_array_to_excel } from "@/utils/excel.js";
export default {
  name: "ExcelImport",
  components: {
    Table,
  },
  data() {
    return {};
  },
  methods: {

    // 导出 XLSX.utils aoa_to_sheet json_to_sheet table_to_sheet sheet_add_aoa sheet_add_json
    // 导入 XLSX.utils sheet_to_json sheet_to_csv sheet_to_txt sheet_to_html sheet_to_formulae 
    // 读取excel: XLSX.read(data, read_opts) XLSX.readFile(filename, read_opts)
    // 生成excel: XLSX.write(wb, write_opts) XLSX.writeFile(wb, filename, write_opts) XLSX.writeFileAsync(filename, wb, o, cb)
    // read_opts: {type: typeOps, ...}
    // write_opts:  {type: typeOps, ...}
    // 浏览器点击上传
    handleImport(e) {
      const reader = new FileReader();
      const result = e.target.result;
      const file = e.target.files[0];
      reader.onload = function () {
        var data = new Uint8Array(result);
        var workbook = XLSX.read(data, { type: "array" });
        console.log(workbook);
      };
      reader.readAsArrayBuffer(file);
    },
    // 浏览器拖拽上传
    handleDrop(e) {
      e.stopPropagation();
      e.preventDefault();
      const result = e.target.result;
      const files = e.dataTransfer.files,
        f = files[0];
      var reader = new FileReader();
      reader.onload = function (e) {
        var data = new Uint8Array(result);
        var workbook = XLSX.read(data, { type: "array" });
        console.log(workbook);

        /* DO SOMETHING WITH workbook HERE */
      };
      reader.readAsArrayBuffer(f);
    },
    // 下载服务器上表格
    handleDownLoad() {
      var url = "/test_files/formula_stress_test.xlsx";

      /* set up async GET request */
      var req = new XMLHttpRequest();
      req.open("GET", url, true);
      req.responseType = "arraybuffer";

      req.onload = function (e) {
        var data = new Uint8Array(req.response);
        var workbook = XLSX.read(data, { type: "array" });
        console.log(workbook);
        /* DO SOMETHING WITH workbook HERE */
      };

      req.send();
    },
    // 导出html Table
    handleTable() {
      /* create new workbook */
      var workbook = XLSX.utils.book_new(); // book_new
      /* convert table 'table1' to worksheet named "Sheet1" */
      var ws1 = XLSX.utils.table_to_sheet(document.getElementById("table1")); // table_to_sheet
      XLSX.utils.book_append_sheet(workbook, ws1, "Sheet1"); // book_append_sheet
      var ws2 = XLSX.utils.table_to_sheet(document.getElementById("table2")); // table_to_sheet
      XLSX.utils.book_append_sheet(workbook, ws2, "Sheet2"); // book_append_sheet
      const data = XLSX.utils.sheet_to_json(ws1); // sheet_to_json
      console.log(data);
      // const dataHtml = XLSX.utils.sheet_to_html(ws1); // sheet_to_html
      // console.log(dataHtml);
      // const dataTxt = XLSX.utils.sheet_to_txt(ws1); // sheet_to_txt
      // console.log(dataTxt);
      // const dataCsv = XLSX.utils.sheet_to_csv(ws1); // sheet_to_csv
      // console.log(dataCsv);
      // 将表格导出成excel
      const ws = XLSX.utils.aoa_to_sheet([data]);   
      XLSX.utils.book_append_sheet(workbook, ws, "导出表格"); 
      XLSX.writeFile(workbook, "导出表格.xlsx");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
