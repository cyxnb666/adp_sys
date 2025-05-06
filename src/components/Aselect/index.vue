<template>
  <div v-if="value" class="inline relative aSelect">
    <div
      ref="content"
      class="div-editable"
      @click.stop="toggleSelect"
    >
      {{ value.expression }}
    </div>
    <div v-if="showSelect" class="data" @click.stop="hiddenSelect">
      <input v-if="!(value === $t('common.and') || value === $t('common.or'))" v-model="searchText" type="text" @click.stop>
      <div class="data-content">
        <ul class="scroll">
          <li v-for="(item,index) in filterData" :key="index" @click="handleSelect(item)">{{ item.label }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { list } from './Untitled-1'
export default {
  name: 'Vinput',
  props: {
    value: {
      type: Object,
      default: null
    },
    list: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      showSelect: false,
      searchText: '',
      data: [], // 原始数据
      filterTypeData: [] // 过滤类型后的数据
    }
  },
  computed: {
    filterData() {
      return this.handleFilterData(this.searchText)
    }
  },
  watch: {
    value: {
      handler(newValue) {
        this.data = this.list
      },
      deep: true
    }
  },
  created() {
    this.data = list
    this.filterTypeData = this.data
    document.addEventListener('click', this.listenerClick)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.listenerClick)
  },
  methods: {
    changeText() {

    },
    handleSelect(item) {
      // this.value.expression = item.label
      this.$emit('changeValue', item)
    },
    toggleSelect() {
      this.showSelect = !this.showSelect
    },
    hiddenSelect() {
      this.showSelect = false
    },
    handleFilterData(searchText) {
      if (!searchText) {
        return this.list
      }
      return this.list.filter(item => {
        return item.label.indexOf(searchText) !== -1
      })
    },
    listenerClick() {
      this.showSelect = false
    }
  }
}
</script>

<style lang="scss">
  .div-editable{
    text-align: left;
    display: inline-block;
    color: #11a5ff;
    cursor: pointer;
    position: relative;
    min-width: 30px;
    border-bottom: 1px solid #11a5ff;
    padding-bottom: 0;
    line-height: 18px;
  }
  .data {
    left: 0;
    position: absolute;
    border: 1px solid #eee;
    padding: 10px;
    width: 200px;
    text-align: center;
    background: #fff;
    box-sizing: border-box;
    z-index: 2;
    input {
      width: 180px;
      margin-top: 5px;
      border: 1px solid #eee;
      &:focus {
        outline: none;
        border-color: #11a5ff;
      }
    }
    ul {
      list-style: none;
      padding-left: 0px;
      margin: 5px 0 ;
      height: 150px;

    }
    li {
      cursor: pointer;
      text-align: left;
      line-height: 25px;
      font-size: 13px;
      &:hover {
        background: #f5f5ff;
      }
    }
  }
</style>
