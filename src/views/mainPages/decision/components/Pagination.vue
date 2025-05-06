<template>
  <el-pagination
    :current-page.sync="currentPage"
    :page-size="pageSize"
    :total="totalSize"
    layout="prev, pager, next"
    background
    @size-change="onSizeChangeHandler"
    @current-change="onCurrentChangeHandler"
  />
</template>

<script>
import _ from 'lodash'
export default {
  name: 'TablePagination',
  props: {
  // 从后台获取到的数据ruleList
    data: {
      default: function() {
        return []
      },
      type: Array
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      pageSizeArr: [5, 10, 20, 50, 100],
      totalSize: 0
    }
  },

  watch: {
    data: {
      immediate: true,
      handler(newData) {
        this.totalSize = newData.length
        this.onCurrentChangeHandler(1)
      }
    }
  },

  methods: {
    // currentPage 改变时会触发
    onCurrentChangeHandler(pageIndex) {
      this.$emit('onTableChange', this.sliceRightData(pageIndex))
    },

    // 分页逻辑
    sliceRightData(pageIndex) {
      const data = this.data
      if (_.isEmpty(data)) {
        return []
      } else {
        return data.slice((pageIndex - 1) * this.pageSize, pageIndex * this.pageSize)
      }
    },

    // pageSize 改变时会触发：
    onSizeChangeHandler(val) {
      this.pageSize = val
      this.currentPage = 1
      this.onCurrentChangeHandler(1)
    }
  }
}
</script>
