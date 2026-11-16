<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/classroom-admin/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的教室</el-breadcrumb-item>
      <el-breadcrumb-item>教室信息</el-breadcrumb-item>
    </el-breadcrumb>

    <div>
      <el-input placeholder="请输入教室名" v-model="c_name" style="width: 125px; margin-right: 5px; margin-top: 5px"></el-input>
      <el-input placeholder="请输入容纳人数" v-model="c_volume" style="width: 150px; margin-right: 5px; margin-top: 5px"></el-input>
      <el-input placeholder="请输入教学楼号" v-model="c_building" style="width: 150px; margin-right: 5px; margin-top: 5px"></el-input>
      <el-input placeholder="请输入楼层" v-model="c_floor" style="width: 150px; margin-right: 5px; margin-top: 5px"></el-input>
      <el-input placeholder="请输入地址" v-model="c_address" style="width: 200px; margin-right: 5px; margin-top: 5px"></el-input>
      <el-button type="primary" style="margin-top: 5px" @click="load">搜索</el-button>
      <el-button style="margin-top: 5px" @click="reset">重置</el-button>
    </div>

    <div style="margin-top: 10px">
      <el-button type="success" @click="handleAdd">新增</el-button>
      <el-button type="danger" @click="confirmBatchDel" :disabled="batchDelDisabled">批量删除</el-button>
    </div>

    <el-table
        height="500"
        v-loading="loading"
        :data="tableData"
        border
        stripe
        style="margin-top: 10px"
        @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="39"></el-table-column>
      <el-table-column prop="cname" label="教室名称" width="140" header-align="center" align="center"></el-table-column>
      <el-table-column prop="cvolume" label="容纳人数" width="120" header-align="center" align="center"></el-table-column>
      <el-table-column prop="caddress" label="地址" width="200" header-align="center" align="center"></el-table-column>
      <el-table-column label="操作" width="172" header-align="center" align="center">
        <template #default="scope">
          <el-button type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-popconfirm
              style="margin-left: 5px"
              confirm-button-text="删除"
              cancel-button-text="取消"
              title="该操作无法撤销，确认删除？"
              @confirm="handleDelete(scope.row)">
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

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

    <el-dialog title="教室信息" v-model:visible="dialogFormVisible">
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
      <template #footer>
        <el-button @click="handleDialogCancel">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'ClassroomAdminClassroomInfo',
  data() {
    return {
      tableData: [],
      loading: true,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      form: {},
      c_name: '',
      c_volume: '',
      c_building: '',
      c_floor: '',
      c_address: '',
      dialogFormVisible: false,
      multipleSelection: [],
      batchDelDisabled: true,
      getcadMinName: [],
      user: {}
    }
  },
  created() {
    this.load()
  },
  methods: {
    handleAdd() {
      this.dialogFormVisible = true
      this.form = {}
    },
    handleDialogCancel() {
      this.dialogFormVisible = false
    },
    handleEdit(row) {
      this.form = { ...row }
      this.dialogFormVisible = true
    },
    handleDelete(row) {
      request.delete('/classroom/' + row.cid).then((res) => {
        if (res) {
          this.$message.success('删除成功！')
          this.load()
        } else {
          this.$message.error('操作失败！请稍后再试')
        }
      })
    },
    delBatch() {
      const c_ids = this.multipleSelection.map((v) => v.cid)
      request.post('/classroom/del/batch/', c_ids).then((res) => {
        if (res) {
          this.$message.success('批量删除成功！')
          this.load()
        } else {
          this.$message.error('操作失败！请稍后再试')
        }
      })
    },
    confirmBatchDel() {
      this.$confirm('此操作不可撤销, 是否继续?', '确认删除', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delBatch()
      }).catch(() => {})
    },
    handleSelectionChange(val) {
      this.batchDelDisabled = val.length === 0
      this.multipleSelection = val
    },
    reset() {
      this.c_name = ''
      this.c_volume = ''
      this.c_address = ''
      this.c_building = ''
      this.c_floor = ''
      this.load()
    },
    async load() {
      this.loading = true
      this.loadAdminNameList()
      this.loadCurrentUser()
      await request.get('/classroom/page', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          c_name: this.c_name,
          c_building: this.c_building,
          c_floor: this.c_floor,
          c_volume: this.c_volume,
          c_address: this.c_address,
          c_admin_id: this.user.uid
        }
      }).then((res) => {
        if (res.code === '200') {
          this.tableData = res.data.records
          this.total = res.data.total
        }
        this.loading = false
      })
    },
    save() {
      request.post('/classroom', this.form).then((res) => {
        if (res) {
          this.dialogFormVisible = false
          this.$message.success('保存成功！')
          this.load()
        } else {
          this.$message.error('保存失败！请稍后再试')
        }
      })
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.load()
    },
    getLabel(list, id, value, label) {
      if (id !== '' && Array.isArray(list) && list.length !== 0) {
        const found = list.find((item) => item[value] == id)
        return found ? found[label] : id
      }
      return id
    },
    loadAdminNameList() {
      request.get('/user/classroom-admin').then((res) => {
        this.getcadMinName = res.data
      })
    },
    loadCurrentUser() {
      this.user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
    }
  }
}
</script>

<style scoped></style>
