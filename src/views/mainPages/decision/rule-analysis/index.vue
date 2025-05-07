<template>
    <div class="rule-analysis app-container bg-color">
        <!-- 标题部分 -->
        <div class="title-style1">
            <i class="icon icon-1" />
            <h6>{{ $t('ruleAnalysis.title') }}</h6>
        </div>

        <el-card class="box-card">
            <!-- 规则选择部分 -->
            <div class="section-wrapper horizontal-layout">
                <div class="section-label">{{ $t('ruleAnalysis.rule') }}</div>
                <div class="section-content">
                    <el-cascader v-model="selectedRules" :options="ruleOptions"
                        :props="{ multiple: true, checkStrictly: true }" clearable collapse-tags style="width: 300px"
                        @change="handleRuleChange"></el-cascader>
                </div>
            </div>

            <!-- 已选规则部分 -->
            <div class="section-wrapper horizontal-layout" v-if="selectedRulesList.length > 0">
                <div class="section-label">{{ $t('ruleAnalysis.selectedRules') }}</div>
                <div class="section-content selected-rules-container">
                    <el-tag v-for="rule in selectedRulesList" :key="rule.id" closable @close="removeRule(rule)"
                        class="selected-rule-tag">
                        {{ rule.name }}
                        <span class="rule-version">{{ rule.version }}</span>
                    </el-tag>
                </div>
            </div>

            <!-- 入参报文部分 -->
            <div class="section-wrapper horizontal-layout">
                <div class="section-label">{{ $t('ruleAnalysis.inputParam') }}</div>
                <div class="section-content">
                    <div class="radio-group-wrapper">
                        <el-radio-group v-model="paramInputType">
                            <el-radio :label="'upload'">{{ $t('ruleAnalysis.uploadParam') }}</el-radio>
                            <el-radio :label="'manual'">{{ $t('ruleAnalysis.manualParam') }}</el-radio>
                        </el-radio-group>
                    </div>

                    <!-- 上传报文区域 -->
                    <div v-if="paramInputType === 'upload'" class="upload-area">
                        <el-upload class="upload-component" action="#" :auto-upload="false"
                            :on-change="handleFileChange" :file-list="fileList" :limit="2">
                            <el-button slot="trigger" size="small" type="primary">{{ $t('common.click') }}</el-button>
                            <div class="upload-tip" slot="tip">{{ $t('ruleAnalysis.uploadTip') }}</div>
                        </el-upload>
                    </div>

                    <!-- 手动录入区域 - JSON编辑器 -->
                    <div v-if="paramInputType === 'manual'" class="manual-input-area">
                        <div class="editor-container">
                            <editor v-model="jsonContent" @init="editorInit" lang="json" theme="chrome" width="100%"
                                height="200" :options="editorOptions"></editor>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 提交按钮 -->
            <div class="submit-button-wrapper">
                <el-button type="primary" @click="handleSubmit">{{ $t('ruleAnalysis.submit') }}</el-button>
            </div>
        </el-card>

        <!-- 测试结果部分 -->
        <el-card class="box-card result-card">
            <div slot="header" class="card-head-style1 clearfix">
                <span>{{ $t('ruleAnalysis.testResult') }}</span>
            </div>

            <div class="result-tabs">
                <el-tabs v-model="activeTab">
                    <el-tab-pane :label="$t('ruleAnalysis.executeResult')" name="result">
                        <div class="result-content-area">
                            <!-- 左侧结果 -->
                            <div class="result-panel" v-for="(result, index) in resultData" :key="index">
                                <div class="result-header">
                                    <div class="business-id">业务号: {{ result.businessId }}</div>
                                    <div class="rule-info">{{ result.ruleCode }} {{ result.ruleName }}</div>
                                </div>

                                <div class="result-body">
                                    <div class="definition-section">
                                        <div class="section-title">预定义</div>
                                        <div class="definition-content">
                                            <p v-for="(def, defIndex) in result.definition" :key="defIndex">{{ def }}
                                            </p>
                                            <p v-if="result.codeBlock" class="code-block">{{ result.codeBlock }}</p>
                                        </div>
                                    </div>

                                    <div class="result-section">
                                        <div class="section-title">如果:</div>
                                        <div class="result-content">
                                            <p v-for="(cond, condIndex) in result.ifCondition" :key="condIndex">{{ cond
                                            }}</p>
                                        </div>

                                        <div class="section-title">那么:</div>
                                        <div class="result-content">
                                            <p v-for="(then, thenIndex) in result.thenAction" :key="thenIndex">{{ then
                                            }}</p>
                                        </div>

                                        <div class="section-title">否则:</div>
                                        <div class="result-content">
                                            <p v-for="(else_, elseIndex) in result.elseAction" :key="elseIndex">{{ else_
                                            }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane :label="$t('ruleAnalysis.ruleContent')" name="content">
                        <div class="result-content-area">
                            <!-- 规则内容面板 -->
                            <div class="rule-panel" v-for="(ruleContent, index) in ruleContentData" :key="index">
                                <div class="rule-header">
                                    <div class="rule-title">规则: {{ ruleContent.ruleCode }} {{ ruleContent.ruleName }}
                                    </div>
                                    <div class="rule-version">版本号: {{ ruleContent.version }}</div>
                                </div>

                                <div class="rule-body">
                                    <div class="tree-view">
                                        <div class="tree-item" v-for="(rootItem, rootIndex) in ruleContent.treeData"
                                            :key="rootIndex">
                                            <div class="tree-item-header">
                                                <i class="el-icon-arrow-down"></i>
                                                <span>{{ rootItem.label }}</span>
                                            </div>

                                            <div class="tree-item-children">
                                                <div class="tree-item"
                                                    v-for="(childItem, childIndex) in rootItem.children"
                                                    :key="childIndex">
                                                    <div class="tree-item-header">
                                                        <i class="el-icon-arrow-down"></i>
                                                        <span>{{ childItem.label }}</span>
                                                    </div>

                                                    <div class="tree-item-children">
                                                        <div class="tree-data-item"
                                                            v-for="(dataItem, dataIndex) in childItem.data"
                                                            :key="dataIndex">
                                                            <span class="data-name">{{ dataItem.name }}</span>
                                                            <span class="data-value">&gt;&gt;&gt; {{ dataItem.value
                                                            }}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-card>
    </div>
</template>

<script>
import editor from 'vue2-ace-editor'

export default {
    name: 'RuleAnalysis',
    components: {
        editor
    },
    data() {
        return {
            selectedRules: [],
            ruleOptions: [
                {
                    value: 'cat1',
                    label: '自动核保规则',
                    children: [
                        {
                            value: 'rule1',
                            label: '自动核保规则1',
                            children: [
                                { value: 'v1', label: 'V1' },
                                { value: 'v2', label: 'V2' }
                            ]
                        },
                        {
                            value: 'rule2',
                            label: '自动核保规则2',
                            children: [
                                { value: 'v1', label: 'V1' },
                                { value: 'v2', label: 'V2' }
                            ]
                        }
                    ]
                },
                {
                    value: 'cat2',
                    label: '人工核保规则',
                    children: [
                        {
                            value: 'rule3',
                            label: '人工核保规则1',
                            children: [
                                { value: 'v1', label: 'V1' },
                                { value: 'v2', label: 'V2' }
                            ]
                        }
                    ]
                }
            ],
            selectedRulesList: [],
            paramInputType: 'upload',
            fileList: [],
            activeTab: 'result',
            jsonContent: '{\n  "comCode": "",\n  "input": {\n    \n  }\n}',
            editorOptions: {
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: true,
                showLineNumbers: true,
                tabSize: 2,
                fontSize: 14,
                showPrintMargin: false
            },

            // 模拟结果数据（后续会从后端获取）
            resultData: [
                {
                    businessId: 'B20241211030000001',
                    ruleCode: 'TP_008846',
                    ruleName: '被保人孕妇不得投保意外险和意外医疗险',
                    definition: [
                        '指定被保人为一个被保人来自(in)投保单的被保人。',
                        '指定当前所有险种为一个险种来自(in)投保单的被保人的当前所有险种中',
                        '符合条件：当前这个险种的为意外险是true',
                        '当前这个险种的标识代码是'
                    ],
                    codeBlock: '{"1019","1024","1061","1062","1011","1055","1056","1057","1058","1059","1060","1061","1099","1100","3479","1135","3132","3133","1140","1141","1162","1150","1148","1149","3135","3136","3498","3141","3142","1219","1187","1243","3642","4029","4125"}中的一个；',
                    ifCondition: ['如果预定义支撑的被保人的是孕妇为是'],
                    thenAction: ['1. 向校验结果集添加.规则编号与.提示信息.处理类型="BL04040603";"孕妇不能投保意外险、意外医疗险";规则预定义支撑的当前信息的决策信息;'],
                    elseAction: ['无']
                },
                {
                    businessId: 'B20241211030000003',
                    ruleCode: 'TP_008846',
                    ruleName: '被保人孕妇不得投保意外险和意外医疗险',
                    definition: [
                        '指定被保人为一个被保人来自(in)投保单的被保人。',
                        '指定当前所有险种为一个险种来自(in)投保单的被保人的当前所有险种中',
                        '符合条件：当前这个险种的为意外险是true',
                        '当前这个险种的标识代码是'
                    ],
                    codeBlock: '{"1019","1024","1061","1062","1011","1055","1056","1057","1058","1059","1060","1061","1099","1100","3479","1135","3122","3133","1140","1141","1162","1150","1148","1149","3136","3498","3141","3142","1219","1187","1243","3642","4029","4125"}中的一个；',
                    ifCondition: ['如果预定义支撑的被保人的是孕妇为是'],
                    thenAction: ['1. 向校验结果集添加.规则编号与.提示信息.处理类型="BL04040603";"孕妇不能投保意外险、意外医疗险";规则预定义支撑的当前信息的决策信息;'],
                    elseAction: ['无']
                }
            ],

            // 模拟规则内容数据（后续会从后端获取）
            ruleContentData: [
                {
                    ruleCode: 'TP_008846',
                    ruleName: '被保人孕妇不得投保意外险和意外医疗险',
                    version: 'V1',
                    treeData: [
                        {
                            label: '投保单',
                            children: [
                                {
                                    label: '被保人',
                                    data: [
                                        { name: '是学平险客户', value: '是' },
                                        { name: 'BMI系数', value: '33.5333' },
                                        { name: '特殊产品意外险保额', value: '0.0' },
                                        { name: '未成年人累计已交保费', value: '0.0' },
                                        { name: '性别', value: '0' },
                                        { name: '年龄', value: '21' },
                                        { name: '姓名', value: '王佳' }
                                    ]
                                },
                                {
                                    label: '当前所有险种',
                                    data: [
                                        { name: '是意外险', value: 'true' },
                                        { name: '是附加合同', value: 'false' },
                                        { name: '业务员分类', value: '030211' },
                                        { name: '机构代码', value: '0325' },
                                        { name: '有核保资料', value: 'true' },
                                        { name: '渠道代码', value: 'F02002' }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    ruleCode: 'TP_008846',
                    ruleName: '被保人孕妇不得投保意外险和意外医疗险',
                    version: 'V2',
                    treeData: [
                        {
                            label: '投保单',
                            children: [
                                {
                                    label: '被保人',
                                    data: [
                                        { name: '是学平险客户', value: '否' },
                                        { name: 'BMI系数', value: '0' },
                                        { name: '特殊产品意外险保额', value: '0.0' },
                                        { name: '未成年人累计已交保费', value: '0.0' },
                                        { name: '性别', value: '0' },
                                        { name: '年龄', value: '21' },
                                        { name: '姓名', value: '王佳' }
                                    ]
                                },
                                {
                                    label: '当前所有险种',
                                    data: [
                                        { name: '是意外险', value: 'false' },
                                        { name: '是附加合同', value: 'false' },
                                        { name: '业务员分类', value: '030211' },
                                        { name: '机构代码', value: '0325' },
                                        { name: '有核保资料', value: 'true' },
                                        { name: '渠道代码', value: 'F02002' }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },
    methods: {
        editorInit() {
            require('brace/ext/language_tools')
            require('brace/mode/json')
            require('brace/theme/chrome')
        },
        handleRuleChange(value) {
            // 清空已选列表
            this.selectedRulesList = []

            // 处理选中的规则
            this.processSelectedRules(value)
        },
        processSelectedRules(values) {
            values.forEach(path => {
                if (path.length === 3) {
                    // 如果选中了具体版本
                    const category = this.findOptionByValue(this.ruleOptions, path[0])
                    const rule = this.findOptionByValue(category.children, path[1])
                    const version = this.findOptionByValue(rule.children, path[2])

                    this.selectedRulesList.push({
                        id: `${path[1]}_${path[2]}`,
                        name: rule.label,
                        version: version.label
                    })
                }
            })
        },
        findOptionByValue(options, value) {
            return options.find(option => option.value === value)
        },
        removeRule(rule) {
            // 从已选列表中删除
            this.selectedRulesList = this.selectedRulesList.filter(item => item.id !== rule.id)

            // 从级联选择器中也删除对应的值
            const ruleId = rule.id.split('_')[0]
            const versionId = rule.id.split('_')[1]

            this.selectedRules = this.selectedRules.filter(path => {
                if (path.length === 3) {
                    return !(path[1] === ruleId && path[2] === versionId)
                }
                return true
            })
        },
        handleFileChange(file, fileList) {
            this.fileList = fileList
        },
        handleSubmit() {
            try {
                if (this.paramInputType === 'manual') {
                    // 验证JSON格式
                    JSON.parse(this.jsonContent)
                }

                // 提交逻辑 - 暂时仅显示成功消息
                this.$message.success(this.$t('ruleAnalysis.submitSuccess'))
            } catch (error) {
                // JSON解析错误
                this.$message.error(this.$t('ruleAnalysis.jsonError'))
            }
        }
    },
    watch: {
        paramInputType(newVal) {
            if (newVal === 'upload') {
                // Switching to upload mode - clear manual input
                this.jsonContent = '{\n  "comCode": "",\n  "input": {\n    \n  }\n}';
            } else if (newVal === 'manual') {
                // Switching to manual mode - clear file list
                this.fileList = [];
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.rule-analysis {
    .section-wrapper {
        margin-bottom: 20px;

        &.horizontal-layout {
            display: flex;
            align-items: flex-start;
            max-width: 50%;
        }
    }

    .section-label {
        font-weight: bold;
        margin-bottom: 10px;
        min-width: 80px;
        padding-top: 6px; // 为了垂直对齐
    }

    .section-content {
        flex: 1;
    }

    .radio-group-wrapper {
        margin-top: 8px; // 将radio组向下调整一点
        margin-bottom: 8px;
    }

    .selected-rules-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .selected-rule-tag {
        display: flex;
        align-items: center;

        .rule-version {
            margin-left: 5px;
            font-size: 12px;
            color: #909399;
        }
    }

    .upload-area {
        margin-top: 10px;
    }

    .upload-component {
        width: 100%;
    }

    .upload-tip {
        font-size: 12px;
        color: #909399;
        margin-top: 5px;
    }

    .file-list {
        margin-top: 10px;

        .file-item {
            display: flex;
            align-items: center;
            margin-bottom: 5px;

            .el-icon-document {
                margin-right: 5px;
                color: #909399;
            }

            .success-icon {
                margin-left: 10px;
                color: #67C23A;
            }
        }
    }

    .manual-input-area {
        margin-top: 15px;
    }

    .editor-container {
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        overflow: hidden;
    }

    .submit-button-wrapper {
        margin-top: 30px;
    }

    .result-card {
        margin-top: 20px;
    }

    .result-content-area {
        display: flex;
        justify-content: space-between;
        gap: 20px;
    }

    .result-panel,
    .rule-panel {
        flex: 1;
        background-color: #f0f9eb;
        border-radius: 4px;
        overflow: hidden;
    }

    .result-header,
    .rule-header {
        padding: 12px 16px;
        background-color: #f0f9eb;
        border-bottom: 1px solid #e1f3d8;
        margin-bottom: 15px;
        /* 增加了间距 */

        .business-id,
        .rule-info,
        .rule-title,
        .rule-version {
            margin-bottom: 5px;
            font-size: 14px;
        }
    }

    .result-body,
    .rule-body {
        padding: 0px 16px 16px 16px;
    }

    .definition-section,
    .result-section {
        margin-bottom: 16px;

        .section-title {
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 14px;
        }

        p {
            margin: 4px 0;
            font-size: 14px;
        }

        .code-block {
            background-color: #f5f7fa;
            padding: 8px;
            border-radius: 4px;
            font-family: monospace;
            margin-top: 8px;
            font-size: 12px;
            word-break: break-all;
        }
    }

    .tree-view {
        .tree-item {
            margin-bottom: 8px;

            .tree-item-header {
                display: flex;
                align-items: center;
                cursor: pointer;
                font-weight: bold;
                margin-bottom: 4px;

                i {
                    margin-right: 5px;
                }
            }

            .tree-item-children {
                padding-left: 20px;
            }

            .tree-data-item {
                display: flex;
                margin-bottom: 4px;
                font-size: 14px;

                .data-name {
                    min-width: 150px;
                }

                .data-value {
                    color: #606266;
                }
            }
        }
    }

    .placeholder {
        color: #909399;
        font-style: italic;
        padding: 20px 0;
    }
}

// 覆盖tabs样式
::v-deep .el-tabs__item.is-active {
    color: #409EFF;
    font-weight: bold;
}

::v-deep .el-tabs__active-bar {
    background-color: #409EFF;
}

// 为带结果的标签添加特殊样式
::v-deep .el-tabs__nav-wrap::after {
    background-color: #EBEEF5;
}
</style>