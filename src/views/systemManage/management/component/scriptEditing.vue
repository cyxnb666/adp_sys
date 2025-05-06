<template>
  <div class="SCRIPTEDITING">
    <el-form :model="submitForm" class="demo-form-inline" label-position="top" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="formLabel">规则名称</div>
          <el-form-item>
            <el-input style="width: 100%" v-model="submitForm.regularName" placeholder="规则名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="formLabel">规则路径</div>
          <el-form-item>
            <el-input style="width: 100%" v-model="submitForm.regularPaths" placeholder="规则路径"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="formLabel">预定义</div>
          <el-form-item>
            <el-input style="width: 100%" type="textarea" v-model="submitForm.predefine" :rows="6"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="formLabel">规则编写</div>
          <el-form-item class="ruleWriting">
            <editor
              ref="editor"
              v-model="submitForm.ruleWriting"
              theme="chrome"
              :lang="options.lang"
              :options="options"
              width="100%"
              height="560px"
              @init="initEditor"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

import editor from "vue2-ace-editor";

export default {
  name: 'SCRIPTEDITING',
  components: {editor},
  props: {},
  data() {
    return {
      submitForm: {
        regularName: '',
        regularPaths: '自核规则决策库/自核规则(陕西)',
        predefine: '指定\'被保人\'为一个被保人来自(in)\'投保单\'的被保人;\n' +
          '指定\'当前险种\'为一个险种来自(in)投保单的被保人的当前所有险种\n' +
          '       符合条件：当前这个险种的代码不是"4091";',
        ruleWriting: 'IF\n' +
          'bomHelper.containArray("51","513701199203287281")   and bomPolicy.agencyCode="010002" and 预定义变量.当前险种.planCode="0201" \n' +
          'THEN\n' +
          'resultInfo.highLevel2 = true;\n' +
          'resultInfo.addVerifyInfo("BL05080103" , "有核保资料需要人工查看影像");\n' +
          'ELSE\n' +
          'resultInfo.highLevel2 = false;',
      }
    };
  },
  computed: {
    options() {
      return {
        lang: 'java', // 语言
        // enableBasicAutocompletion: true, // 启动代码补全功能
        enableSnippets: true, // 启动代码段
        showPrintMargin: false // 显示打印边距
        // fontSize: this.config.fontSize, // 字体大小
        // enableLiveAutocompletion: true // 启用实时自动完成
        // readOnly: this.readOnly// 只读
      }
    }
  },
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    initEditor() {
    }
  },
}


</script>

<style lang="scss" scoped>
.el-form-item {
  width: 100%;

  ::v-deep .el-form-item__content {
    width: 100%;
  }
}

.formLabel {
  font-size: 14px;
  margin-bottom: 10px;
}
</style>

