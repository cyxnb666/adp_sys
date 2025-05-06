<template>
  <el-dialog
    title="新增"
    :visible.sync="dialogVisible"
    width="30%"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="数据代码" prop="baseCode" :rules="rules.input">
        <el-input v-model="form.baseCode" />
      </el-form-item>
      <el-form-item label="名称" prop="baseName" :rules="rules.input">
        <el-input v-model="form.baseName" />
      </el-form-item>
      <el-form-item label="类型代码" prop="baseType" :rules="rules.select">
        <el-select v-model="form.baseType" filterable allow-create default-first-option>
          <el-option
            v-for="item in baseTypeList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" type="textarea" :rows="3"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" :loading="loading" @click="submit()">{{ $t('button.OK') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getCodeType, updateCodeData } from '@/api/systemManage/basicCode'
export default {
  props: {
    baseTypeList: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      loading: false,
      viewModel: 'add',
      dialogVisible: false,
      form: {
        baseCode: "",
        baseDataId: "",
        baseName: "",
        baseOrder: "",
        baseType: "",
        remark: ""
      },
      rules: {
        select: [
          { required: true, message: '请选择', trigger: 'change' },
        ],
        input: [
          { required: true, message: '请输入', trigger: 'change' },
        ]
      },
    }
  },
  methods: {
    /**
     * @Description: 显示弹窗
     * @date 2023/10/04
     */
    showDialog (data, view) {
      this.viewModel = view;
      this.dialogVisible = true
      if (view !== 'add') {
        this.form = data;
      }
      else {
        this.form = {
          baseCode: "",
          baseDataId: "",
          baseName: "",
          baseOrder: "",
          baseType: "",
          remark: ""
        }
      }
    },
    /**
     * @Description: 校验表单
     * @date 2023/10/5
     */
    validation () {
      let flag = false
      this.$refs.form.validate((valid) => {
        flag = valid
      })
      return flag
    },
    /**
     * @Description: 提交
     * @date 2023/10/5
     */
    submit () {
      // 校验
      if (!this.validation()) {
        this.$message.error(this.$t('newapp.fullInfo') )
        return false
      }
      this.loading = true
      updateCodeData(this.form).then((res) => {
        this.dialogVisible = false
        this.$emit('handleClose')
      }).finally(() => {
        this.loading = false
      })
    }
  }
}

</script>
<style scoped lang="scss">
::v-deep .el-form {
 .el-select,
 .el-input{
   width: 100%;
 }
}
</style>
