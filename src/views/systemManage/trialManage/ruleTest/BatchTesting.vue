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
                <el-table :data="request.requestParam" size="small" row-key="fieldId" border default-expand-all max-height="300" :header-cell-style="{
                    background: '#EFF4F8', color: '#60769C', fontWeight: 'normal'
                }"
                    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
                    <el-table-column prop="name" label="名称" show-overflow-tooltip/>
                    <el-table-column prop="field" :label="$t('port.field')" show-overflow-tooltip width="300"/>
                    <el-table-column prop="type" :label="$t('port.type')" show-overflow-tooltip width="120">
                        <template slot-scope="{ row }">
                            <!-- <div v-if="row.dataType === 'field'">{{ row?.type }}</div> -->
                            <span>{{ row.type }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="value" :label="$t('port.fieldValue')" width="300">
                        <template slot-scope="{ row }">
                            <span>{{ row.value }}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="requiredField" :label="$t('port.requiredField')" width="297">
                        <template slot-scope="scope">
                            {{ scope.row.requiredField === false ? $t("port.no") : $t("port.yes") }}
                        </template>
                    </el-table-column> -->
                </el-table>
                <div class="mt-15">
                    <el-button size="small" type="primary" icon="el-icon-plus">添加用例</el-button>
                    <el-button size="small" type="primary" icon="el-icon-setting">开始运行</el-button>
                </div>
            </el-form-item>
            <el-form-item label="响应结果：">
                <el-table :data="ruleTestList" size="small" :header-cell-style="{ background: '#EFF4F8', color: '#60769C', fontWeight: 'normal' }">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <!-- <el-form-item label="请求参数：">
                                <div style="display: flex;justify-content: space-between;">
                                    <json-viewer style="width: 49%;" :value="returnExampleSuccess" :expand-depth="5" :closed="true" copyable boxed sort />
                                    <el-form-item label="响应结果：" style="width: 49%;" >
                                        <json-viewer :value="returnExampleFail" :expand-depth="5" :closed="true" copyable boxed sort />
                                    </el-form-item>
                                </div>
                            </el-form-item> -->
                            <el-form-item label="响应结果：">
                                <json-viewer :value="returnExampleFail" :expand-depth="5" :closed="true" copyable boxed sort />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="名称">
                    </el-table-column>
                    <el-table-column prop="delay" label="耗时（ms）">
                    </el-table-column>
                    <el-table-column prop="type" label="类型">
                    </el-table-column>
                    <el-table-column prop="result" label="执行结果">
                        
                        <template slot-scope="{ row }">
                            <span :style="{ color: row.status ? 'green' : 'red' }">{{ row.status ? '成功' : '失败' }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label="测试结果：">
                <div style="color:#606292;">执行成功<span class="green" style="color: green;">26</span>条，失败<span class="green" style="color: red;">0</span>条，执行时间11.2ms</div>
            </el-form-item>
            <!-- <el-form-item label="响应结果：">
                <json-viewer :value="returnExampleSuccess" :expand-depth="5" :closed="true" copyable boxed sort />
            </el-form-item> -->
        </el-form>
    </div>
</template>

<script>

export default {
    data() {
        return {
            active: 'first',
            form: {
                type: '0'
            },
            request: {
                requestParam: [{
                    name: '投保单对象的车辆信息的车辆使用性质',
                    field: 'useNatureCode',
                    type: 'string',
                    value: '8A'
                }, {
                    name: '投保单对象的车辆信息的市号牌',
                    field: 'citylicense',
                    type: 'boolean',
                    value: 'true'
                }, {
                    name: '车辆信息的车辆大类',
                    field: 'maincarkindcode',
                    type: 'string',
                    value: 'H'
                }, {
                    name: '基本信息的签单地点',
                    field: 'operateSite',
                    type: 'string',
                    value: 'KYB'
                }, {
                    name: '投保单对象的生命表信息的交商合并含增值服务经营成本',
                    field: 'vascostmarginbc',
                    type: 'number',
                    value: '107'
                }, {
                    name: '投保单对象的计算信息包含满足清单()',
                    field: 'exceptionTagsOne',
                    type: 'boolean',
                    value: 'false'
                }, {
                    name: '基本信息的团车协议号',
                    field: 'contractNo',
                    type: 'string',
                    value: '5026000002022000037'
                }, {
                    name: '投保单对象的车辆信息的车辆使用性质',
                    field: 'useNatureCode',
                    type: 'string',
                    value: '1111'
                }, {
                    name: '投保单对象的车辆信息的车辆使用性质',
                    field: 'businessMarks',
                    type: 'string',
                    value: '1111'
                }]
            },
            ruleTestList: [{
                name: '投保单对象的车辆信息的车辆使用性质',
                delay: '0.2ms',
                type: '规则',
                result: '成功',
                status: 1,
            }, {
                name: '投保单对象的车辆信息的市号牌',
                delay: '0.1ms',
                type: '规则',
                result: '成功',
                status: 1,
            }, {
                name: '车辆信息的车辆大类',
                delay: '0.7ms',
                type: '规则',
                result: '失败',
                status: 1,
            }, {
                name: '基本信息的签单地点',
                delay: '0.2ms',
                type: '规则',
                result: '成功',
                status: 1,
            }, {
                name: '投保单对象的生命表信息的交商合并含增值服务经营成本',
                delay: '0.5ms',
                type: '规则',
                result: '成功',
                status: 1,
            }, {
                name: '投保单对象的计算信息包含满足清单()',
                delay: '0.2ms',
                type: '规则',
                result: '成功',
                status: 1,
            }, {
                name: '投保单对象的车辆信息的车辆使用性质',
                delay: '0.2ms',
                type: '规则',
                result: '成功',
                status: 1,
            }, {
                name: '投保单对象的车辆信息的车辆使用性质',
                delay: '0.2ms',
                type: '规则',
                result: '成功',
                status: 1,
            }],
            returnExampleSuccess: {
                applicationId:"",
                input:{
                    bomMiddleValue: {
                        aPlans:null,
                        armylicense:null,
                        channelName:"",
                        citylicense:null,
                        comName:"",
                        danger0507Customer:null,
                        danger0508Customer:null,
                        dreamCRulePath:null,
                        dreamCRulePath20:"",
                        dreamCustomer:"",
                        famliyAPlanCar1:null,
                        famliyAPlanCar2:null,
                        famliyAPlanCar3:null,
                        famliyAPlanCar4:null,
                        famliyAPlanCar5:null,
                        famliyAPlanCar6:null,
                        famliyBeStealCar1:null,
                        famliyBeStealCar2:null,
                        famliyBeStealCar3:null,
                        famliyBeStealCar4:null,
                        famliyBeStealCar5:null,
                        handlerName:"",
                        hebaoComA:null,
                        hebaoComB:null,
                        hebaoComC:null,
                        middleString1:"",
                        middleString2:"",
                        natureName:"",
                        newEnergyVehicle:null,
                        notBusAPlanCar1:null,
                        notBusAPlanCar2:null,
                        notBusAPlanCar3:null,
                        notBusAPlanCar4:null,
                        notBusAPlanCar5:null,
                        provincelicense:null,
                        redCarMode:null,
                        rulePath:null,
                        savingEnergyVehicle:null,
                        speciallicense:null,
                        unNormalAddPlans:null,
                        wdRulePath:"",
                        wearing:null,
                        zongGood0507Customer:null,
                        zongGood0508Customer:null,
                        zongGoodCarType:null,
                    }
                },
                ruleId:"SINOSIG 000500",
                bomId:"4f3ef903159f4fd5884b038635479a1a"
            },
            returnExampleFail: {
                "success": true,
                "errCode": "",
                "resp": {
                    ruleId:"SINOSIG 000500",
                    result: '成功'
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
.rule-test-log {
}
</style>
