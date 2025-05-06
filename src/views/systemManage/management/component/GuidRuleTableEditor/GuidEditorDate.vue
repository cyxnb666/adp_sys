<template>
  <span @click.stop>
    <GuidEditorOperator v-if="showOperator" v-model="node.operator" :type="node.returnType" />

    <i v-if="replace" v-contextmenu.click="{
      options: () => ruleEditor.getDropdownMenus({ type: 'root' }, 'sibling'),
      callback: menu => replaceCondition(node, menu)
    }" class="el-icon-caret-bottom plr-5" />

    <template v-if="node.units">
      <!-- <el-input ref="numberRef" v-model="node.value" @blur="handleBlur" type="number" size="mini" class="underline values plr-5" style="width: 70px;">
          <template slot="append">
              <el-dropdown @command="handleClickMenu" trigger="click" @click.native.capture.stop>
                  <span class="el-dropdown-link">
                      {{ node.label }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="item in node.units" :key="item.key" :command="item">{{  item.label }}</el-dropdown-item>
                  </el-dropdown-menu>
              </el-dropdown>
          </template>
      </el-input> -->
      <div v-if="editor" class="el-input el-input--mini el-input-group el-input-group--append plr-5">
        <input ref="numberRef" v-model="node.value" type="number" class="el-input__inner" style="width: 70px;" @blur="handleBlur">
        <el-dropdown class="el-input-group__append plr-5" trigger="click" style="padding: 0 10px;" @command="handleClickMenu">
          <span class="el-dropdown-link">
            {{ node.label }}<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in node.units" :key="item.key" :command="item">{{ item.label }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <span v-else class="underline values plr-5" @click="fillValue(node)">{{ node.value ? node.value + node.label : (placeholder || '<输入一个日期>') }}</span>
      <i v-if="!editable && addIcon" class="el-icon-circle-plus-outline plr-5" @click.stop="addExprParam" />

      <GuidEditorNumber v-if="node.next" v-bind="{ replace, placeholder, node: node.next }" />
    </template>
    <template v-else>
      <el-date-picker
        v-if="editor"
        ref="dateRef"
        v-model="node.value"
        class="inline-form plr-5"
        size="mini"
        :value-format="{ date: 'yyyy-MM-dd hh:mm:ss', time: 'hh:mm:ss' }[node.returnType]"
        placeholder="选择日期"
        type="datetime"
        @blur="hiddenForm(node)"
      />
      <span v-else class="underline values plr-5" @click="fillValue(node)">{{ node.value || placeholder }}</span>

      <GuidEditorDate v-if="node.next" v-bind="{ replace, placeholder, node: node.next }" show-operator />
    </template>
  </span>
</template>

<script>
import Emitter from 'element-ui/src/mixins/emitter'
import GuidEditorNumber from './GuidEditorNumber'
export default {
  name: 'GuidEditorDate',
  components: { GuidEditorNumber },
  mixins: [Emitter],
  props: {
    disabled: Boolean,
    node: {
      type: Object,
      default: () => ({})
    },
    replace: {
      type: Boolean,
      default: false
    },
    placeholder: String,
    showOperator: Boolean,
    addIcon: {
      type: Boolean,
      default: true
    },
    type: String
  },
  inject: ['ruleEditor'],
  data() {
    return {
      // operator: { label: '加', code: 'ADD', value: '+' }
      editor: false
    }
  },
  computed: {
    editable() {
      return this.ruleEditor.disabledRule()
    }
  },
  created() {
    this.value = this.node.value
    // this.showOperator && (this.node.operator = this.operator)
    this.ruleEditor.paramValue.push(this)
    this.initUnits()
  },
  updated() {
    this.initUnits()
  },
  methods: {
    initUnits() {
      if (this.node.units && !this.node.label) {
        const { label } = this.node.units[0] || {}
        this.$set(this.node, 'label', label)
      }
    },
    replaceCondition(node, item) {
      // this.dispatch('GuidEditorForm', 'replaceCondition', [node, item]);
      this.$emit('replaceCondition', item)
    },
    addExprParam() {
      if (this.type === 'linkedList') {
        const { next, units } = this.node

        const node = {
          ...this.node,
          value: '',
          operator: { label: '加', code: 'ADD', value: '+' },
          next: next
        }

        if (units) {
          node.paramType = 'int'
          node.returnType = 'int'
        }

        this.$set(this.node, 'next', node)
      } else {
        this.$emit('insertCondition', this.node)
      }
    },
    // getDropdownMenus(type) {
    //     return {
    //         'date': [{ label: '加' }],
    //         'int': [{ label: '加', code: 'ADD', value: '+' }, { label: '减', code: 'SUB', value: '-' }, { label: '乘', code: 'MULTIPLY', value: '*' }, { label: '除', code: 'DIVIDE', value: '/' }]
    //     }[type]
    // },
    // toggleOperator(item) {
    //     this.$set(this.node, 'operator', item)
    // },
    fillValue(node) {
      if (!this.disabled && this.editable) return

      // this.$set(node, 'edit', true)
      this.editor = true
      this.$nextTick(() => {
        if (this.node.units) {
          this.$refs.numberRef && this.$refs.numberRef.focus()
        } else {
          this.$refs.dateRef && this.$refs.dateRef.focus()
        }
      }, 100)
    },
    handleBlur(e) {
      if (e.relatedTarget && ['el-dropdown-menu__item', 'el-dropdown-link'].includes(e.relatedTarget._prevClass)) {
        this.fillValue(this.node)
      } else {
        // this.node.edit = false
        this.editor = false
      }
    },
    hiddenForm(node) {
      this.editor = false
    },
    handleClickMenu(item) {
      this.node.label = item.label
    },
    setValue(value) {
      this.node.value = value
    }
  },
  beforeDestroy() {
    this.ruleEditor.paramValue.splice(this.ruleEditor.paramValue.indexOf(this), 1)
  }
}
</script>

<style lang="scss" scoped>
.disabled {
    cursor:not-allowed;
    color: #c0c4cc;
}
</style>

