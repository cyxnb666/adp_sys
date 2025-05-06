<template>
    <div class="batch-testing">
        <el-form label-width="120px">
            <el-form-item label="测试类型：">
                <el-select v-model="form.type" placeholder="请选择">
                    <!-- <el-option label="项目" value="0"></el-option>
                    <el-option label="规则" value="1"></el-option> -->
                    <el-option label="规则流" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="测试用例/报文：">
                <el-table :data="request" row-key="fieldId" border default-expand-all max-height="300" :header-cell-style="{
                    background: '#EFF4F8', color: '#60769C', fontWeight: 'normal'
                }" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
                    <el-table-column prop="flowName" label="名称" show-overflow-tooltip/>
                    <el-table-column prop="applicationId" :label="$t('port.field')" show-overflow-tooltip width="300"/>
                    <el-table-column prop="flowType" :label="$t('port.type')" show-overflow-tooltip width="120">
                        <template slot-scope="{ row }">
                            <span>{{ row.flowType === '1' ? '主流程' : '子流程' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="value" :label="$t('port.fieldValue')" width="300">
                        <template slot-scope="{ row }">
                            <!-- <div v-if="row?.dataType === 'field'" class="el-input el-input--small">
                                <input v-model="row.value" type="text" autocomplete="off" class="el-input__inner">
                            </div> -->
                            <span>-</span>
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
                    <el-button @click="onExecute" size="small" :type="execute ? 'danger' : 'primary'" :icon="execute ? 'el-icon-video-pause' : 'el-icon-video-play'">{{ execute ? '结束' : '执行' }}</el-button>
                    <el-button @click="next" :disabled="!execute || end" size="small" type="primary" icon="el-icon-right">下一步</el-button>
                    <!-- <el-button @click="onExecute" size="small" type="primary" icon="el-icon-caret-right">{{ execute ? '结束' : '执行' }}</el-button> -->
                </div>
            </el-form-item>
            <el-form-item label="执行结果：">
                <el-table :data="ruleTestList" size="small" :header-cell-style="{ background: '#EFF4F8', color: '#60769C', fontWeight: 'normal' }">
                    <!-- <el-table-column type="expand">
                        <template slot-scope="{ row }">
                            <el-form-item label="响应结果：">
                                <div style="display: flex;justify-content: space-between;">
                                    <json-viewer style="width: 49%;" :value="row.result" :expand-depth="5" :closed="true" copyable boxed sort />
                                    <el-form-item label="期望结果：" style="width: 49%;" >
                                        <json-viewer :value="row.expected" :expand-depth="5" :closed="true" copyable boxed sort />
                                    </el-form-item>
                                </div>
                            </el-form-item>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="flowNodeName" label="名称"></el-table-column>
                    <el-table-column prop="delay" label="耗时（ms）"></el-table-column>
                    <el-table-column prop="flowNodeType" label="类型"></el-table-column>
                    <el-table-column prop="decisionTables" label="决策表名称">
                        <template slot-scope="{ row }">
                            <span>{{ row.decisionTables?.reduce((acc, val) => acc += (acc ? `,${val.decisionTableName}` : `${val.decisionTableName}`), '') || '-' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="decisionTables" label="决策表路径">
                        <template slot-scope="{ row }">
                            <span>{{ row.decisionTables?.reduce((acc, val) => acc += (acc ? `,${val.path}` : `${val.path}`), '') || '-' }}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="result" label="执行结果">
                        <template slot-scope="{ row }">
                            <span :style="{ color: row.status ? 'green' : 'red' }">{{ row.status ? '执行中' : '执行完成' }}</span>
                        </template>
                    </el-table-column> -->
                </el-table>
            </el-form-item>
            <!-- <el-form-item label="响应结果：">
                <div style="display: flex;justify-content: space-between;">
                    <json-viewer style="width: 49%;" :value="returnExampleSuccess" :expand-depth="5" :closed="true" copyable boxed sort />
                    <el-form-item label="期望结果：" style="width: 49%;" >
                        <json-viewer :value="returnExampleFail" :expand-depth="5" :closed="true" copyable boxed sort />
                    </el-form-item>
                    
                </div>
            </el-form-item> -->
            <!-- <el-form-item label="测试结果：">
                <div>执行成功<span class="green" style="color: green;">26</span>条，失败<span class="green" style="color: red;">1</span>条，执行时间0.2ms</div>
            </el-form-item>
            <el-form-item label="响应结果：">
                <el-table :data="ruleTestList" style="margin-bottom: 20px"
                border default-expand-all max-height="500" :header-cell-style="{
                    background: '#EFF4F8', color: '#60769C', fontWeight: 'normal'
                }">
                    <el-table-column prop="name" label="名称"/>
                    <el-table-column prop="type" label="类型"/>
                    <el-table-column prop="delay" label="耗时（ms）"/>
                    <el-table-column prop="callTime" label="调用时间"/>
                    <el-table-column prop="status" label="执行结果"/>
                    <el-table-column prop="person" label="创建人"/>
                    <el-table-column prop="time" label="创建时间"/>
                </el-table>
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
                type: '2'
            },
            request: [{
                "flowSettingId": "a01b0175a607411bb26b03c9e959623c",
                "flowType": "1",
                "flowName": "aa",
                "approvalStatus": "3",
                "flowStatus": "1",
                "applicationId": "TEST",
                "nodes": [
                    {
                        "flowNodeId": "001a2a12d6964e3ea1d91201ecb89b1e",
                        "flowNodeName": "开始节点",
                        "flowNodeType": "START_NODE",
                        "ruleSetting": null,
                        "decisionTables": null,
                        "childFlowDefId": null,
                        "childFlowDefName": null,
                        "offsetX": 50,
                        "offsetY": 16,
                        "x": 389,
                        "y": 137
                    },
                    {
                        "flowNodeId": "4cfe592eb88443caa4779517b2e1c8e8",
                        "flowNodeName": "规则节点",
                        "flowNodeType": "PACKET_NODE",
                        "ruleSetting": [],
                        "decisionTables": [
                            {
                                "decisionTableId": "096fbe0ccdb34343a3b672acb6fd957d",
                                "decisionTableName": "嵌套复杂表头测试.xlsx",
                                "path": "回归/复杂表头"
                            }
                        ],
                        "childFlowDefId": null,
                        "childFlowDefName": null,
                        "offsetX": 55,
                        "offsetY": 15,
                        "x": 466,
                        "y": 272
                    },
                    {
                        "flowNodeId": "bae52bcdeead4132b5dc138781681d08",
                        "flowNodeName": "结束节点",
                        "flowNodeType": "END_NODE",
                        "ruleSetting": null,
                        "decisionTables": null,
                        "childFlowDefId": null,
                        "childFlowDefName": null,
                        "offsetX": 54,
                        "offsetY": 14,
                        "x": 235,
                        "y": 351
                    }
                ],
                "conditions": [
                    {
                        "flowConditionId": "ad9091ac42f545c5a7f49b9ad0de41f9",
                        "preFlowNodeId": "001a2a12d6964e3ea1d91201ecb89b1e",
                        "nextFlowNodeId": "4cfe592eb88443caa4779517b2e1c8e8",
                        "relationshipType": "SEQUENCE_FLOW",
                        "conditionName": "",
                        "ruleSetting": null
                    },
                    {
                        "flowConditionId": "ec1fd6d1dcb845f7bfabd3cf460af4ce",
                        "preFlowNodeId": "4cfe592eb88443caa4779517b2e1c8e8",
                        "nextFlowNodeId": "bae52bcdeead4132b5dc138781681d08",
                        "relationshipType": "SEQUENCE_FLOW",
                        "conditionName": "",
                        "ruleSetting": null
                    }
                ],
                "dimView": null
            }],
            ruleTestList: [],
            execute: false,
            end: false
        }
    },
    methods: {
        next() {
            const node = this.request[0]
            if (node) {
                let curr = node.nodes.shift()
                if (curr) {
                    this.ruleTestList.push({
                        delay: `${Math.random().toFixed(2)}ms`,
                        ...curr
                    })
                    // this.ruleTestList = [{
                    //     delay: `${Math.random().toFixed(2)}ms`,
                    //     ...curr
                    // }]
                    
                }
                this.execute = !!node.nodes.length
                this.end = !node.nodes.length
            }
        },
        onExecute() {
            this.execute = !this.execute
            this.end = false
            this.next()
        }
    }
}
</script>

<style scoped lang="scss">
.rule-test-log {
}
</style>
