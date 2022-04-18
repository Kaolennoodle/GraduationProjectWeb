<template>


  <!--  左侧菜单栏-->
  <el-container style="min-height: 100vh">

    <SideBar :isCollapse="this.isCollapse"/>

    <el-container>

      <!--        顶部导航栏-->
      <el-header
          style="background-color: #DDEBFF; border-bottom: 1px solid #ccc">
        <Header :collapseBtnClass="collapseBtnClass"/>
      </el-header>


      <!--      主框体-->
      <el-main>

        <!--        表示当前页面的子路由会在router-view里面展示-->
        <router-view/>
      </el-main>
    </el-container>
  </el-container>

</template>

<style>

.el-header {
  background-image: linear-gradient(to bottom right, rgb(13, 68, 200), rgb(33, 147, 255));

  line-height: 60px;
}

/*.el-aside {*/
/*  color: #333;*/
/*}*/

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

</style>

<script>


import request from "@/utils/request";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";

export default {
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
      c_address: "",
      dialogFormVisible: false,
      collapseBtnClass: 'el-icon-s-fold',
      isCollapse: false,
      sideWidth: 200,
    }
  },
  created() {
    //请求分页查询数据
    this.load()
  },
  components: {
    SideBar,
    Header
  },
  mounted() {
    this.$bus.$on('changeCollapse',(data)=>{
      if (this.isCollapse == true) {
        this.isCollapse = false
        console.log("菜单此时应为展开状态", this.isCollapse)
        this.collapseBtnClass = 'el-icon-s-fold'
      } else if (this.isCollapse == false) {
        this.isCollapse = true
        console.log("菜单此时应为折叠状态", this.isCollapse)
        this.collapseBtnClass = 'el-icon-s-unfold'
      }
    })
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
