<template>
    <div class="batch-testing">
        <el-form label-width="120px">
            <el-form-item label="测试类型：">
                <el-select v-model="form.type" placeholder="请选择">
                    <el-option label="项目" value="0"></el-option>
                    <el-option label="规则" value="1"></el-option>
                    <el-option label="规则流" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="测试用例/报文：">
                <el-table :data="request.requestParam" row-key="fieldId" border default-expand-all max-height="300" :header-cell-style="{
                    background: '#EFF4F8', color: '#60769C', fontWeight: 'normal'
                }"
                    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
                    <el-table-column prop="name" label="名称" show-overflow-tooltip/>
                    <el-table-column prop="field" :label="$t('port.field')" show-overflow-tooltip width="300"/>
                    <el-table-column prop="type" :label="$t('port.type')" show-overflow-tooltip width="120">
                        <!-- <template slot-scope="{ row }">
                            <span>{{ row.type }}</span>
                        </template> -->
                    </el-table-column>
                    <el-table-column prop="value" :label="$t('port.fieldValue')" width="300">
                        <!-- <template slot-scope="{ row }">
                            <span>-</span>
                        </template> -->
                    </el-table-column>
                    <!-- <el-table-column prop="requiredField" :label="$t('port.requiredField')" width="297">
                        <template slot-scope="scope">
                            {{ scope.row.requiredField === false ? $t("port.no") : $t("port.yes") }}
                        </template>
                    </el-table-column> -->
                </el-table>
                <div class="mt-15">
                    <el-button size="small" type="primary" icon="el-icon-plus">上传用例</el-button>
                    <el-button size="small" type="primary" icon="el-icon-setting">开始运行</el-button>
                </div>
            </el-form-item>
            <el-form-item label="响应结果：">
                <div style="display: flex;justify-content: space-between;">
                    <json-viewer style="width: 49%;" :value="returnExampleSuccess" :expand-depth="5" :closed="true" copyable boxed sort />
                    <el-form-item label="期望结果：" style="width: 49%;" >
                        <json-viewer :value="returnExampleFail" :expand-depth="5" :closed="true" copyable boxed sort />
                    </el-form-item>
                    
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

export default {
    data() {
        return {
            active: 'first',
            form: {
                type: '1'
            },
            request: {
                requestParam: [
                //     {
                //     name: '投保单对象的车辆信息的车辆使用性质',
                //     field: 'useNatureCode',
                //     type: 'string',
                //     value: '8A'
                // }, {
                //     name: '投保单对象的车辆信息的市号牌',
                //     field: 'citylicense',
                //     type: 'boolean',
                //     value: 'true'
                // }, {
                //     name: '车辆信息的车辆大类',
                //     field: 'maincarkindcode',
                //     type: 'string',
                //     value: 'H'
                // }, {
                //     name: '基本信息的签单地点',
                //     field: 'operateSite',
                //     type: 'string',
                //     value: 'KYB'
                // }, {
                //     name: '投保单对象的生命表信息的交商合并含增值服务经营成本',
                //     field: 'vascostmarginbc',
                //     type: 'number',
                //     value: '107'
                // }, {
                //     name: '投保单对象的计算信息包含满足清单()',
                //     field: 'exceptionTagsOne',
                //     type: 'boolean',
                //     value: 'false'
                // }, 
                {
                    name: '基本信息的团车协议号',
                    field: 'contractNo',
                    type: 'string',
                    value: '5026000002022000037'
                }, 
                // {
                //     name: '投保单对象的车辆信息的车辆使用性质',
                //     field: 'useNatureCode',
                //     type: 'string',
                //     value: '1111'
                // }, {
                //     name: '投保单对象的车辆信息的车辆使用性质',
                //     field: 'businessMarks',
                //     type: 'string',
                //     value: '1111'
                // }
                ]
            },
            returnExampleSuccess: '',
            returnExampleSuccess: {
                "success": true,
                "errCode": "",
                "resp": {
                    ruleId:"SINOSIG 000500",
                    resultInfo: '成功',
                    resultCode: 200
                }
            },
            returnExampleFail: {
                "success": true,
                "errCode": "",
                "resp": {
                    ruleId:"SINOSIG 000500",
                    resultInfo: '拒绝',
                    resultCode: 400
                }
            }
        }
    }
}
</script>
<!-- #00800024  #ff000026-->
<style scoped lang="scss">
.rule-test-log {
}
</style>
