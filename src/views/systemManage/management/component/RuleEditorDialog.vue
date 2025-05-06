<template>
  <el-dialog :visible.sync="visible" custom-class="add-descision-rule-dialog" :before-close="() => $emit('input', false)" append-to-body width="60%">
    <span slot="title">{{ add ? '新增规则' : '编辑规则' }}</span>
    <page-rule-editor
      ref="poc"
      v-loading="loading"
      class="page-rule-editor"
      :base-u-r-l="settings.adp_config.baseURL"
      :bom-base-info-id="bom.bomBaseInfo"
      :token="user.token"
      :rule-content="rule.ruleContent"
      :code-services="rule.codeServices"
      :rule-id="rule.ruleId"
      :module-value="moduleValue"
      @changeEditPage="changeEditPage"
      @submitRule="submitRule"
    />
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import { checkPredefine } from '@/api/mainPages/decision'
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    rule: {
      type: Object,
      default: () => ({})
    },
    add: Boolean
  },
  data() {
    return {
      loading: true,
      visible: this.value,
      currentNode: {},
      // bomModelId: '',
      moduleValue: 0,
      fieldParsings: {},
      applicationId: this.$store.state.app.applicationId,
      decisionRepositoryModel: {},

      field: null
    }
  },
  created() {
    console.log(this.rule)
  },
  computed: {
    ...mapGetters(['settings', 'bom', 'user'])
  },
  mounted() {
    this.$nextTick(() => {
      const poc = this.$refs.poc
      if (poc) {
        const el = poc.$el.querySelectorAll('.ruleContent-wrapper')
        el.forEach((val, index) => {
          // if (val.classList.contains('well') && val.classList.contains('root') && val.classList.contains('tree-wrapper') && val.previousSibling) {
          //     val.previousSibling.style.display = 'none'
          // }
          if (index) val.style.display = 'none'
        })
        this.$watch('$refs.poc.$refs.RuleEditor.thenList', () => {
          this.$refs.poc.$refs.RuleEditor.editPredefineText = this.rule.editPredefineText
        }, { once: true })
      }
    })
    setTimeout(() => { this.loading = false }, 1000)
  },
  methods: {
    changeEditPage() {
      this.$emit('changeEditPage')
    },
    async submitRule(...args) {
      this.$emit('submitRule', ...args)
    }
  }
}
</script>

<style lang="scss">
.add-descision-rule-dialog {
    min-width: 900px;
    .rule-card-wrap {
        .tree-container {
            max-height: 50vh;
        }
        .mode-show {
            margin-right: 15px;
        }
    }

}
</style>

