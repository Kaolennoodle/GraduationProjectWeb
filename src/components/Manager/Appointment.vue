<template>
  <div>

<!--面包屑组件-->
    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/manager/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>预约管理</el-breadcrumb-item>
    </el-breadcrumb>

<!--搜索框组件-->
    <div>
      <el-input
          suffix-icon="el-icon-school"
          placeholder="教室名称"
          v-model="c_name"
          style="width: 125px; margin-right: 5px; margin-top: 5px">

      </el-input>
      <el-input
          suffix-icon="el-icon-user-solid"
          placeholder="用户姓名"
          v-model="u_name"
          style="width: 150px; margin-right: 5px; margin-top: 5px">

      </el-input>

      <el-date-picker
          style="margin-right: 5px; margin-top: 5px; width: 110px"
          v-model="a_date"
          type="date"
          placeholder="选择日期">
      </el-date-picker>

      <el-time-select
          style="margin-right: 5px; margin-top: 5px; width: 110px"
          placeholder="起始时间"
          v-model="a_start_time"
          :picker-options="{
      start: '08:30',
      step: '00:15',
      end: '18:30'
    }">
      </el-time-select>
      <el-time-select
          style="margin-right: 5px; margin-top: 5px; width: 110px"
          placeholder="结束时间"
          v-model="a_end_time"
          :picker-options="{
      start: '08:30',
      step: '00:15',
      end: '18:30',
      minTime: a_start_time
    }">
      </el-time-select>

      <el-button
          type="primary"
          style="margin-top: 5px"
          icon="el-icon-search"
          @click="load">搜索
      </el-button>
      <el-button
          style="margin-top: 5px"
          icon="el-icon-refresh"
          @click="reset">重置
      </el-button>

      <!--新增与批量删除-->
      <div style="margin-top: 10px">
        <el-button type="success" @click="handleAdd" icon="el-icon-circle-plus">新增</el-button>
        <el-button type="danger" icon="el-icon-delete-solid" @click="confirmBatchDel" :disabled="batchDelDisabled">批量删除</el-button>
        <!--      <el-button type="primary" icon="el-icon-download">导入</el-button>-->
        <!--      <el-button type="primary" icon="el-icon-upload2">导出</el-button>-->

        <!--      表格主体-->
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
          <el-table-column prop="uid" label="用户ID" width="140">
          </el-table-column>
          <el-table-column prop="cid" label="教室ID" width="120">
          </el-table-column>
          <el-table-column prop="adate" label="日期">
          </el-table-column>
          <el-table-column prop="astartTime" label="开始时间">
          </el-table-column>
          <el-table-column prop="aendTime" label="结束时间">
          </el-table-column>
          <el-table-column
              label="操作"
              fixed="right"
              width="172">
            <template v-slot:default="scope">
              <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
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
                <el-button type="danger" icon="el-icon-delete" slot="reference">删除</el-button>
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
    </div>
  </div>

</template>

<script>
import request from "@/utils/request";

export default {
  name: "Appointment",
  data() {
    return {
      //搜索框数据
      c_name: "",
      u_name: "",
      a_date: "",
      a_start_time: "",
      a_end_time: "",


      // 表格数据相关
      tableData: [],
      loading: true,
      total: 0,
      pageNum: 1,
      pageSize: 10,

      // 新增编辑相关
      form: {},
      dialogFormVisible: false,

      // 批量删除相关
      multipleSelection: [],
      batchDelDisabled: true
    }
  },
  created() {
    this.load()
  },
  methods: {
    /**
     * 打开新增弹窗并将form置空
     */
    handleAdd() {
      this.dialogFormVisible = true
      this.form = {}
    },

    /**
     * 关闭新增/编辑串口
     */
    handleDialogCancel() {
      this.dialogFormVisible = false
    },

    /**
     * 编辑：将所选行的值赋给form并打开编辑菜单
     * @param row
     */
    handleEdit(row) {
      this.form = row
      this.dialogFormVisible = true
    },

    /**
     * 删除：删除所选单条预约
     * @param row
     */
    handleDelete(row) {
      request.delete("/appointment/" + row.aid).then(res => {
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

    /**
     * 确认批量删除：向后端发送批量删除请求
     */
    delBatch() {
      let a_ids = this.multipleSelection.map(v => a.cid)
      request.post("/appointment/del/batch/", a_ids).then(res => {
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

    /**
     * 批量删除确认：打开批量删除确认框
     */
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

    /**
     * 选择器：当所选行变化后，更新目前所选内容
     * @param val
     */
    handleSelectionChange(val) {
      console.log(val)
      if (val.length === 0) {
        this.batchDelDisabled = true
      } else {
        this.batchDelDisabled = false
      }
      this.multipleSelection = val
    },

    /**
     * 重置搜索框：将所有搜索属性置空
     */
    reset() {
      this.c_name = ""
      this.u_name = ""
      this.a_start_time = ""
      this.a_end_time = ""
      this.a_date = ""
      this.load()
    },

    /**
     * 重新加载表格数据
     */
    load() {
      this.loading = true

      request.get("http://localhost:8081/appointment/page", {
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
      this.loading = false
    },

    /**
     * 新增或更新：向后端发送新增/已经修改过的教室数据
     */
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

    /**
     * 分页相关
     * @param pageSize
     */
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