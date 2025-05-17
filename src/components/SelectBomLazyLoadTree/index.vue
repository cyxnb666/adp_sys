<template>
  <div class="SelectBomLazyLoadTree">
    <el-input
      suffix-icon="el-icon-search"
      v-model="bomName"
      readonly
      clearable
      @focus="openSelectDialog"
    >
      <el-button slot="append" icon="el-icon-delete" @click="clearBomName"></el-button>
    </el-input>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="800px"
      append-to-body
      @close="handleClose"
    >
      <el-input
        v-model="filterText"
        placeholder="输入关键字查询"
        @input="searchFieldFn"
      >
        <i slot="suffix" class="icon-search"/>
      </el-input>
      <div class="treeBox">
        <el-tree
          ref="bomTree"
          class="filter-tree"
          :data="treeData"
          :props="defaultProps"
          show-checkbox
          node-key="fieldPath"
          :expand-on-click-node="false"
          :default-expanded-keys="defaultExpandedKeys"
          :default-checked-keys	="fieldPaths"
          highlight-current
          :load="loadNode"
          lazy
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="selectedBom">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getBomLazyLoadTree, searchBom} from "@/views/systemManage/management/api";

export default {
  name: "SelectBomLazyLoadTree",
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  model: {},
  data() {
    return {
      bomName: "",
      filterText: "",
      dialogVisible: false,
      fieldPaths: [],
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "hasChildren",
      },
      defaultExpandedKeys: [],
    };
  },
  watch: {},
  computed: {},
  created() {
  },
  mounted() {
  },
  methods: {
    openSelectDialog() {
     if (!this.fieldPaths.length) this.bomClassAndField()
      else this.dialogVisible = true;
    },
    clearBomName() {
      this.bomName = "";
      this.fieldPaths = [];
      this.$emit("selectedBom", this.fieldPaths)
    },
    handleClose() {
    },
    selectedBom() {
      const arr = this.$refs.bomTree.getCheckedNodes()
      this.fieldPaths = arr.map(item => item.fieldPath)
      this.bomName = arr.map(item => item.label).join(',')
      this.$emit("selectedBom", this.fieldPaths)
      this.dialogVisible = false
    },
    async loadNode(node, resolve) {
      if (node.level === 0) {
        console.log(node)
        node.expanded = true
        return
      }
      if (node.data.children && node.data.children.length > 0) {
        node.expanded = true
        return resolve(node.data.children)
      }
      if (node.data.hasChildren) {
        return resolve([])
      }
      const res = await getBomLazyLoadTree(this.$store.state.bom.bomBaseInfo, true, node.data.fieldPath)
      res.resp.forEach(item => {
        item.hasChildren = !item.hasChildren
      })
      node.data.children = res.resp
      resolve(res.resp)
    },
    bomClassAndField() {
      getBomLazyLoadTree(this.$store.state.bom.bomBaseInfo, true, '').then(res => {
        res.resp.children.forEach(item => {
          item.hasChildren = !item.hasChildren
        })
        this.defaultExpandedKeys.push(res.resp.fieldPath)
        this.treeData = [res.resp]
        this.dialogVisible = true;
      })
    },
    searchFieldFn: _.debounce(
      function (value) {
        if (value) {
          searchBom(this.$store.state.bom.bomBaseInfo, value).then(res => {
            this.treeData = res.resp ? [res.resp] : []
            this.defaultExpandedKeys = res.resp ? this.getAllFieldPaths(res.resp) : []
          })
        } else {
          this.defaultExpandedKeys = []
          this.bomClassAndField()
        }
      }, 500
    ),
    getAllFieldPaths(root) {
      const fieldPaths = []
      const traverse = (node) => {
        if (node.hasOwnProperty('fieldPath')) {
          fieldPaths.push(node.fieldPath)
        }
        if (Array.isArray(node.children)) {
          node.children.forEach(child => traverse(child))
        }
      }
      traverse(root)
      return fieldPaths
    },
  },
};
</script>

<style lang="scss" scoped>
.SelectBomLazyLoadTree {
  // your styles here
}
::v-deep .el-input__suffix {
  display: flex;
  align-items: center;
  justify-content: center;
}
.treeBox{
  max-height: 600px;
  overflow-y: auto;
}
</style>
