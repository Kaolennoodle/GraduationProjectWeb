<template>
  <div>

    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>教室管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--        搜索栏-->
    <div>
      <el-input
          suffix-icon="el-icon-search"
          placeholder="请输入教室名"
          v-model="c_name"
          style="width: 125px">

      </el-input>
      <el-input
          suffix-icon="el-icon-user-solid"
          placeholder="请输入容纳人数"
          v-model="c_volume"
          style="width: 150px; margin-left: 5px">

      </el-input>
      <el-input
          suffix-icon="el-icon-office-building"
          placeholder="请输入教学楼号"
          v-model="c_building"
          style="width: 150px; margin-left: 5px">

      </el-input>
      <el-input
          suffix-icon="el-icon-d-caret"
          placeholder="请输入楼层"
          v-model="c_floor"
          style="width: 150px; margin-left: 5px">

      </el-input>
      <el-input
          suffix-icon="el-icon-position"
          placeholder="请输入地址"
          v-model="c_address"
          style="width: 200px; margin-left: 5px">

      </el-input>
      <el-button
          type="primary"
          style="margin-left: 5px"
          icon="el-icon-search"
          @click="load">搜索
      </el-button>
      <el-button
          style="margin-left: 5px"
          icon="el-icon-refresh"
          @click="reset">重置
      </el-button>
    </div>

    <!--        表格主体-->
    <div style="margin-top: 10px">
      <el-button type="success" @click="handleAdd" icon="el-icon-circle-plus">新增</el-button>
      <el-button type="danger" icon="el-icon-delete-solid" @click="confirmBatchDel">批量删除</el-button>
      <el-button type="primary" icon="el-icon-download">导入</el-button>
      <el-button type="primary" icon="el-icon-upload2">导出</el-button>
    </div>
    <el-table
        height="500"
        v-loading="loading"
        :data="tableData"
        border
        stripe
        style="margin-top: 10px"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="39">
      </el-table-column>
      <el-table-column prop="cname" label="教室名称" width="140">
      </el-table-column>
      <el-table-column prop="cvolume" label="容纳人数" width="120">
      </el-table-column>
      <el-table-column prop="caddress" label="地址">
      </el-table-column>
      <el-table-column
          label="操作"
          fixed="right"
          width="172">
        <template v-slot:default="scope">
          <el-button type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-popconfirm
              style="margin-left: 5px"
              confirm-button-text='删除'
              confirm-button-type="danger"
              cancel-button-text='取消'
              confirm-button-size="mini"
              icon="el-icon-info"
              icon-color="red"
              title="该操作无法撤销，确认删除？"
              @confirm="handleDelete(scope.row)"
          >
            <el-button type="danger" plain icon="el-icon-delete" slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>


    <!--        分页组件-->
    <div style="padding: 10px 0">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>


    <!--        新增/编辑dialog窗口-->
    <el-dialog title="教室信息" :visible.sync="dialogFormVisible">
      <el-form :inline="true" label-width="80px" size="small">
        <el-form-item label="教室名称">
          <el-input v-model="form.cname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="容纳人数">
          <el-input v-model="form.cvolume" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="教学楼">
          <el-input v-model="form.cbuilding" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="楼层">
          <el-input v-model="form.cfloor" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="教室地址">
          <el-input v-model="form.caddress" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogCancel">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "Classroom",
  data() {
    return {
      tableData: [],
      loading: true,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      form: {},
      multipleSelection: [],
      c_name: "",
      c_volume: "",
      c_building: "",
      c_floor: "",
      c_address: "",
      dialogFormVisible: false,
    }
  },
  created() {
    this.load()
  },
  methods: {
    //打开新增弹窗并将form置空
    handleAdd() {
      this.dialogFormVisible = true
      this.form = {}
    },

    handleDialogCancel() {
      this.dialogFormVisible = false
    },

    handleEdit(row) {
      this.form = row
      this.dialogFormVisible = true
    },

    handleDelete(row) {
      request.delete("/classroom/" + row.cid).then(res => {
        if (res) {
          this.$message.success({
            showClose: true,
            message: "删除成功！"
          })
          this.load()
        } else {
          this.$message.error({
            showClose: true,
            message: "操作失败！请稍后再试"
          })
        }
      })
    },


    //批量删除
    delBatch() {
      let c_ids = this.multipleSelection.map(v => v.cid)
      request.post("/classroom/del/batch/", c_ids).then(res => {
        if (res) {
          this.$message.success({
            showClose: true,
            message: "批量删除成功！"
          })
          this.load()
        } else {
          this.$message.error({
            showClose: true,
            message: "操作失败！请稍后再试"
          })
        }
      })
    },
    confirmBatchDel() {
      this.$confirm('此操作不可撤销, 是否继续?', '确认删除', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delBatch();
      }).catch(() => {

      });
    },


    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    reset() {
      this.c_name = ""
      this.c_volume = ""
      this.c_address = ""
      this.c_building = ""
      this.c_floor = ""
      this.load()
    },


    // 重新加载表格数据
    load() {
      this.loading = true

      request.get("http://localhost:8081/classroom/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          c_name: this.c_name,
          c_building: this.c_building,
          c_floor: this.c_floor,
          c_volume: this.c_volume,
          c_address: this.c_address
        }
      }).then(res => {
        console.log(res)
        this.tableData = res.records
        this.total = res.total
      })
      /*fetch("http://localhost:8081/classroom/page?pageNum=" + this.pageNum + "&pageSize=" + this.pageSize)
          .then(res => res.json()).then(res => {
        console.log(res)
        this.tableData = res.data
        this.total = res.total
      })*/
      this.loading = false
    },


    // 新增或编辑的保存
    save() {
      request.post("http://localhost:8081/classroom", this.form).then(res => {
        if (res) {
          this.dialogFormVisible = false
          this.$message.success({
            showClose: true,
            message: "保存成功！"
          })
          this.load()
        } else {
          this.$message.error({
            showClose: true,
            message: "保存失败！请稍后再试"
          })
        }
      })
    },


    //分页相关
    handleSizeChange(pageSize) {
      console.log(pageSize)
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      console.log(pageNum)
      this.pageNum = pageNum
      this.load()
    }
  }
}
</script>

<style scoped>

</style>