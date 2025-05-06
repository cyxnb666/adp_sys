<template>
    <div class="app-container poc-model rule-test-manage">
        <div class="title-style1">
            <i class="icon icon-1"></i><h6>测试管理</h6>
        </div>
        <el-form :inline="true" :model="form" class="rule-test-manage-form">
            <el-form-item label="类型" style="margin-right: 30px;">
                <div style="display: flex;">
                    <el-select v-model="form.type" placeholder="请选择" style="width: 125px;">
                        <el-option label="项目" value="0"></el-option>
                        <el-option label="规则" value="1"></el-option>
                        <el-option label="规则流" value="2"></el-option>
                    </el-select>
                    <el-input v-model="form.rule" placeholder="请输入名称、id"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="执行结果">
                <el-select v-model="form.status" placeholder="请选择">
                    <el-option label="成功" value="0"></el-option>
                    <el-option label="失败" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary" @click="goTest">回归测试</el-button>
            </el-form-item>
        </el-form>
        <div class="mt-15" style="background: white;padding: 8px 15px;">
            <h4 class="title">测试执行列表</h4>
            <el-table :data="ruleTestList" style="margin-bottom: 20px"
            border default-expand-all max-height="500" :header-cell-style="{
                background: '#EFF4F8', color: '#60769C', fontWeight: 'normal'
            }">
                    <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                    <el-table-column prop="name" label="名称"/>
                    <el-table-column prop="type" label="类型"/>
                    <el-table-column prop="delay" label="耗时（ms）"/>
                    <el-table-column prop="callTime" label="调用时间"/>
                    <el-table-column prop="result" label="执行结果">
                        <template slot-scope="{ row }">
                            <span :style="{ color: row.result ? 'green' : 'red' }">{{ row.result ? '成功' : '拒绝' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="person" label="创建人"/>
                    <el-table-column prop="time" label="创建时间"/>
                    <!-- <el-table-column prop="operation" label="操作">
                        <template slot-scope="{ row }">
                            <el-button @click="test" type="text">测试</el-button>
                        </template>
                    </el-table-column> -->
                </el-table>
        </div>
        <RuleTest v-if="testLogVisible" :dialogVisible.sync="testLogVisible" :request="request"></RuleTest>
    </div>
</template>
<script>

import { getRuleExecutionDetails } from '@/api/mainPages/port'

import RuleTest from './RuleTest'
export default {
    components: {
        RuleTest,
    },
    data() {
        return {
            form: {
                type: '0',
                rule: '',
                status: ''
            },
            ruleTestList: [{
                type: '项目',
                name: 'TEST',
                status: '0',
                delay: '21',
                result: 1,
                delay: '0.32ms',
                callTime: '2024-11-12'
            }, {
                type: '项目',
                name: 'USE',
                status: '1',
                delay: '7',
                result: 0,
                delay: '0.15ms',
                callTime: '2024-10-22'
            }, {
                type: '规则',
                name: 'fuza_001',
                status: '2',
                delay: '15',
                result: 1,
                delay: '0.66ms',
                callTime: '2024-7-06'
            }],
            testLogVisible: false,
            request: {}
        }
    },
    methods: {
        test() {
            const applicationId = this.$store.state.app.applicationId
            getRuleExecutionDetails(applicationId).then(res => {
                this.testLogVisible = true
                this.request = {
                    requestUrl: this.$store.state.settings.adp_config.baseURL + res.requestUrl,
                    requestParam: res.requestParam.children
                }
            })
        },
        delRuleTestLog() {

        },
        viewTest() {

        },
        onSubmit() {

        },
        goTest() {
            this.$router.push({
                path: '/trial/ruleTesting'
            })
        }
    }
}
</script>
<style scoped lang="scss">
.rule-test-manage {
    .rule-test-manage-form {
        padding: 20px 20px 0 20px;
        background: white;
    }
    .title {
        color: #3c3b3b;
        font-weight: initial;
    }
    .el-button--text.red {
        color: #f78989;
    }
}
</style>
