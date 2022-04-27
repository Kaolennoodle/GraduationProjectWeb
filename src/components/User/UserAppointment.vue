<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/user/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的预约</el-breadcrumb-item>
      <el-breadcrumb-item>教室预约</el-breadcrumb-item>
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
          style="margin-top: 5px; margin-right: 5px"
          icon="el-icon-search"
          @click="load">搜索
      </el-button>
      <el-button
          style="margin-left: 0px; margin-top: 5px"
          icon="el-icon-refresh"
          @click="reset">重置
      </el-button>
    </div>

    <!--        表格主体-->
    <el-table
        height="500"
        v-loading="loading"
        :data="tableData"
        border
        stripe
        style="margin-top: 10px">
      <el-table-column prop="cname" label="教室名称" width="140">
      </el-table-column>
      <el-table-column prop="cvolume" label="容纳人数" width="120">
      </el-table-column>
      <el-table-column prop="caddress" label="地址">
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="94">
        <template v-slot:default="scope">
          <el-button type="primary" icon="el-icon-s-claim" @click="handleAppoint(scope.row)">预约</el-button>
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

    <!--        预约dialog窗口-->
    <el-dialog title="确认预约信息" :visible.sync="dialogFormVisible">
      <el-card shadow="hover">
        <h4 style="margin-bottom: 10px">教室信息</h4>
        <el-descriptions :column=dialogDescriptionColumn>
          <el-descriptions-item label="教室名称">{{ form.cname }}</el-descriptions-item>
          <el-descriptions-item label="容纳人数">{{ form.cvolume }}</el-descriptions-item>
          <el-descriptions-item label="管理员联系电话">188 8888 8888</el-descriptions-item>
          <el-descriptions-item label="地址">{{ form.caddress }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
      <el-card shadow="hover" style="margin-top: 10px">
        <h4>选择日期</h4>
        <el-date-picker
            v-model="date"
            type="date"
            placeholder="选择日期"
            style="margin-top: 10px"
            :picker-options="pickerOptions">
        </el-date-picker>
      </el-card>
      <el-card shadow="hover" style="margin-top: 10px">
        <h4 style="margin-bottom: 10px">选择时间</h4>
        <el-time-select style="margin-right: 5px"
                        placeholder="起始时间"
                        v-model="startTime"
                        :picker-options="{
      start: '07:30',
      step: '00:15',
      end: '22:30'
    }">
        </el-time-select>
        <el-time-select
            placeholder="结束时间"
            v-model="endTime"
            :picker-options="{
      start: '07:30',
      step: '00:15',
      end: '22:30',
      minTime: startTime
    }">
        </el-time-select>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogCancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "UserAppointment",
  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      tableData: [],
      loading: true,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      form: {},
      c_name: "",
      c_volume: "",
      c_building: "",
      c_floor: "",
      c_address: "",
      dialogFormVisible: false,
      dialogDescriptionColumn: 2,

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '明天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '后天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
            picker.$emit('pick', date);
          }
        }]
      },
      date: '',
      startTime: '',
      endTime: '',
      appointment: {}
    };
  },
  created() {
    this.load()
  },
  methods: {

    handleAppoint(row) {
      this.form = row;
      this.dialogFormVisible = true;
    },

    handleDialogCancel() {
      this.dialogFormVisible = false
    },

    submit() {
      this.appointment.cid = this.form.cid;
      this.appointment.uid = this.user.uid;
      this.appointment.startTime = this.startTime;
      this.appointment.endTime = this.endTime;
      this.appointment.date = this.date;
      console.log(this.appointment)
      request.get("http://localhost:8081/appointment/new", {
        params: {
          uid: this.appointment.uid,
          cid: this.appointment.cid,
          date: this.date,
          startTime: this.startTime,
          endTime: this.endTime
        }
      })
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
        this.tableData = res.records
        this.total = res.total
      })
      this.loading = false
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