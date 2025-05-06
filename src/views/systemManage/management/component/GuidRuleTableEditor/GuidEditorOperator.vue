<template>
  <span v-contextmenu.click="{ options: () => getDropdownMenus(type), callback: menu => toggleOperator(menu) }" class="plr-5">
    {{ operator.value }}
  </span>
</template>

<script>
import { numberTypes } from './dataset.js'
export default {
  props: {
    type: {
      type: String,
      required: true
    },
    value: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      operator: { label: '加', code: 'ADD', value: '+' },
      operators: Object.freeze({
        // string: [{ label: '加', code: 'ADD', value: '+' }],
        // number: [
        //     { label: '加', code: 'ADD', value: '+' },
        //     { label: '减', code: 'SUB', value: '-' },
        //     { label: '乘', code: 'MULTIPLY', value: '*' },
        //     { label: '除', code: 'DIVIDE', value: '/' }
        // ],
        // int: [
        //     { label: '加', code: 'ADD', value: '+' },
        //     { label: '减', code: 'SUB', value: '-' },
        //     { label: '乘', code: 'MULTIPLY', value: '*' },
        //     { label: '除', code: 'DIVIDE', value: '/' }
        // ],
        // double: [
        //     { label: '加', code: 'ADD', value: '+' },
        //     { label: '减', code: 'SUB', value: '-' },
        //     { label: '乘', code: 'MULTIPLY', value: '*' },
        //     { label: '除', code: 'DIVIDE', value: '/' }
        // ],
        // 'int,integer,double,float,long': [
        //     { label: '加', code: 'ADD', value: '+' },
        //     { label: '减', code: 'SUB', value: '-' },
        //     { label: '乘', code: 'MULTIPLY', value: '*' },
        //     { label: '除', code: 'DIVIDE', value: '/' }
        // ],
        // 'int,integer,double,double,float,long': [
        //     { label: '加', code: 'ADD', value: '+' },
        //     { label: '减', code: 'SUB', value: '-' },
        //     { label: '乘', code: 'MULTIPLY', value: '*' },
        //     { label: '除', code: 'DIVIDE', value: '/' }
        // ],
      })
    }
  },
  created() {
    if (this.value) {
      console.log(this.type)

      this.operator = this.value
      console.log(this.operator)
    }
    this.$emit('input', _.cloneDeep(this.operator))
  },
  methods: {
    getDropdownMenus(type) {
      console.log(type)

      if (type === 'string') {
        return [{ label: '加', code: 'ADD', value: '+' }]
      } else if (numberTypes.includes(type)) {
        return [
          { label: '加', code: 'ADD', value: '+' },
          { label: '减', code: 'SUB', value: '-' },
          { label: '乘', code: 'MULTIPLY', value: '*' },
          { label: '除', code: 'DIVIDE', value: '/' }
        ]
      }
      return this.operators[type]
    },
    toggleOperator(item) {
      console.log(item)

      this.$emit('input', item)
      this.operator = item
    }
  }
}

</script>
