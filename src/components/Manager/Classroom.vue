<template>
  <div>

    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/manager/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>教室管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--        搜索栏-->
    <div>
      <el-input
          suffix-icon="el-icon-search"
          placeholder="请输入教室名"
          v-model="c_name"
          style="width: 125px; margin-right: 5px; margin-top: 5px">

      </el-input>
      <el-input
          suffix-icon="el-icon-user-solid"
          placeholder="请输入容纳人数"
          v-model="c_volume"
          style="width: 150px; margin-right: 5px; margin-top: 5px">

      </el-input>
      <el-input
          suffix-icon="el-icon-office-building"
          placeholder="请输入教学楼号"
          v-model="c_building"
          style="width: 150px; margin-right: 5px; margin-top: 5px">

      </el-input>
      <el-input
          suffix-icon="el-icon-d-caret"
          placeholder="请输入楼层"
          v-model="c_floor"
          style="width: 150px; margin-right: 5px; margin-top: 5px">

      </el-input>
      <el-input
          suffix-icon="el-icon-position"
          placeholder="请输入地址"
          v-model="c_address"
          style="width: 200px; margin-right: 5px; margin-top: 5px">

      </el-input>
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
    </div>

    <!--新增与批量删除-->
    <div style="margin-top: 10px">
      <el-button type="success" @click="handleAdd" icon="el-icon-circle-plus">新增</el-button>
      <el-button type="danger" icon="el-icon-delete-solid" @click="confirmBatchDel" :disabled="batchDelDisabled" style="margin-right: 10px;">批量删除
      </el-button>
      <el-popover
          placement="right"
          width="455"
          v-model="cadminTableVisible1"
          trigger="click">
        <el-table
            height="250"
            v-loading="userLoading"
            :data="userTableData"
            border
            stripe
            style="margin-top: 10px">
          <el-table-column prop="uname" label="姓名" width="70" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="uphone" label="电话" width="110" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="uemail" label="邮箱" width="170" header-align="center" align="center">
          </el-table-column>
          <el-table-column
              label="操作"
              width="77px"
              header-align="center">
            <template v-slot:default="scope">
              <el-button type="primary" @click="batchAdminAssign(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button slot="reference" type="primary" icon="el-icon-s-claim" :disabled="batchDelDisabled">批量分配管理员</el-button>
      </el-popover>
      <!--      <el-button type="primary" icon="el-icon-download">导入</el-button>-->
      <!--      <el-button type="primary" icon="el-icon-upload2">导出</el-button>-->


    </div>

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
      <el-table-column prop="cname" label="教室名称" width="140" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="cvolume" label="容纳人数" width="120" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="caddress" label="地址" width="200" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="cadminName" label="教室管理员" width="100" header-align="center" align="center">
        <template slot-scope="scope">
          {{ getLabel(getcadMinName, scope.row.cadminId, "uid", "uname") }}
        </template>
      </el-table-column>
      <el-table-column
          label="操作"
          width="172"
          header-align="center" align="center">
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
      <p style="margin-left: 20px; margin-bottom: 10px;">当前教室管理员：{{ form.cadminName }}</p>
      <el-popover
          placement="right"
          width="455"
          v-model="cadminTableVisible"
          trigger="click">
        <el-table
            height="250"
            v-loading="userLoading"
            :data="userTableData"
            border
            stripe
            style="margin-top: 10px">
          <el-table-column prop="uname" label="姓名" width="70" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="uphone" label="电话" width="110" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="uemail" label="邮箱" width="170" header-align="center" align="center">
          </el-table-column>
          <el-table-column
              label="操作"
              width="77px"
              header-align="center">
            <template v-slot:default="scope">
              <el-button type="primary" @click="changeCAdmin(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button style="margin-left: 10px;" slot="reference">重新分配管理员</el-button>
      </el-popover>

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
      // 表格数据相关
      tableData: [],
      loading: true,
      total: 0,
      pageNum: 1,
      pageSize: 10,

      // 新增编辑相关
      form: {},
      c_name: "",
      c_volume: "",
      c_building: "",
      c_floor: "",
      c_address: "",
      dialogFormVisible: false,

      // 批量删除相关
      multipleSelection: [],
      batchDelDisabled: true,

      //批量分配管理员相关
      assignData: {
        adminId: "",
        c_ids: []
      },

      //教室管理员列表
      getcadMinName: [],
      userLoading: true,
      userTableData: [],
      cadminTableVisible: false,
      cadminTableVisible1: false
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
    async handleEdit(row) {
      await request.get("/user/name/" + row.cadminId).then(res => {
        if (res.code === '200')
          row.cadminName = res.data.uname
        else if (res.code === '500') {
          row.cadminName = "暂无数据"
        } else
          this.$message.error({
            showClose: true,
            message: res.msg
          })
      })
      this.form = row
      this.dialogFormVisible = true
      if (this.form.cadminName === "暂无数据")
        this.$message.info({
          showClose: true,
          message: "系统中查询不到该教室管理员的信息，该教室管理员可能已被删除，请尽快重新分配管理员"
        })
    },

    /**
     * 删除：删除所选单个教室
     * @param row
     */
    handleDelete(row) {
      request.delete("/classroom/" + row.cid).then(res => {
        if (res.code === "200") {
          this.$message.success({
            showClose: true,
            message: "删除成功！"
          })
          this.load()
        } else if (res.code === "600") {
          this.$confirm('当前教室已经存在预约，继续删除将会删除所有与该教室相关的预约，确认删除？', '确认删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            request.delete("/classroom/force/" + row.cid).then(res => {
              if (res.code === '200') {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.reset()
              } else {
                this.$message.error({
                  showClose: true,
                  message: res.msg
                })
              }
            })
          }).catch(() => {
          });
        } else {
          this.$message.error({
            showClose: true,
            message: res.msg
          })
        }
      })
    },

    /**
     * 确认批量删除：向后端发送批量删除请求
     */
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
      this.c_volume = ""
      this.c_address = ""
      this.c_building = ""
      this.c_floor = ""
      this.load()
    },

    /**
     * 重新加载表格数据
     */
    async load() {
      this.loading = true
      this.loadAdminNameList()
      await request.get("http://localhost:8081/classroom/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          c_name: this.c_name,
          c_building: this.c_building,
          c_floor: this.c_floor,
          c_volume: this.c_volume,
          c_address: this.c_address
        }
      }).then(async res => {
        this.tableData = res.records
        this.total = res.total

        //从后台查询每个教室的管理员姓名赋给tableData
        // for (let i = 0; i < this.total; i++) {
        //   await request.get("/user/" + this.tableData[i].cadminId).then(res => {
        //     this.tableData[i].cadminName = res.uname
        //   })
        // }

        await this.loadUser()
        this.loading = false
      })
    },

    /*
    新增或更新：向后端发送新增/已经修改过的教室数据
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
    },

    /**
     * 根据传入的值,返回对应的中文name，常用的地方是表格那里
     * list: 传入的源数组
     * id: 传入的值
     * value: 源数组中为了匹配id值的字段名称
     * label: 源数组中需要返回显示中文的字段名称
     * 示例：arr:[{dictValue: 0,dictLabel:'前端工程师'},{dictValue: 1,dictLabel:'Java工程师'}]
     * 调用getLabel(arr, 1, "dictValue", "dictLabel")返回了 Java工程师
     * */
    getLabel(list, id, value, label) {
      if (id != '' && Array.isArray(list) && list.length != 0) {
        return !list.find(item => item[value] == id) ? id : list.find(item => item[value] == id)[label]
      } else {
        return id
      }
    },

    /**
     * 加载全部教室管理员姓名
     */
    loadAdminNameList() {
      request.get("/user/classroom-admin").then(res => {
        this.getcadMinName = res.data
      })
    },

    /**
     * 加载用户表格数据
     */
    async loadUser() {
      this.userLoading = true
      this.loadAdminNameList()
      await request.get("http://localhost:8081/user/classroom-admin").then(async res => {
        console.log(res)
        this.userTableData = res.data
        this.userLoading = false
      })
    },

    /**
     * 更换教室管理员
     * @param row
     */
    changeCAdmin(row) {
      this.form.cadminId = row.uid
      this.form.cadminName = row.uname
      this.cadminTableVisible = false
      this.$message.success({
        showClose: true,
        message: "教室分配成功，点击确认保存更改"
      })
    },

    /**
     * 批量分配管理员
     */
    batchAdminAssign(row) {
      this.$confirm('确定将所选' + this.multipleSelection.length + '间教室全部分配给' + row.uname + '吗？', '确认分配', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.assignData.c_ids = this.multipleSelection.map(v => v.cid)
        this.assignData.adminId = row.uid
        request.post("/classroom/assign-admin/batch/", this.assignData).then(res => {
          if (res.code === '200') {
            this.$message.success({
              showClose: true,
              message: "操作成功！"
            })
            this.load()
          } else {
            this.$message.error({
              showClose: true,
              message: res.msg
            })
          }
        })
      }).catch(() => {
      });

    }

  }
}
</script>

<style scoped>

</style>