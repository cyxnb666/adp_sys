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
import { restoreRule, getRuleHistory, ruleExecuteCompare } from '@/api/mainPages/decision'

export default {
    name: 'RuleAnalysis',
    components: {
        editor
    },
    data() {
        return {
            selectedRules: [],
            ruleOptions: [],
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
    created() {
        this.fetchRuleOptions()
    },
    methods: {
        async fetchRuleOptions() {
            this.loading = true
            try {
                // 获取应用ID
                const applicationId = this.$store.state.app.applicationId

                // 使用restoreRule获取决策库信息
                const response = await restoreRule(applicationId)

                if (response && response.decisionRepositoryModel) {
                    const { decisionRepositoryModel } = response

                    // 处理目录结构转换为选项格式
                    this.ruleOptions = this.buildCatalogueOptions(decisionRepositoryModel.catalogueList || [])
                } else {
                    console.warn('No repository model found in response')
                }
            } catch (error) {
                console.error('获取规则选项失败:', error)
                this.$message.error('获取规则数据失败，请重试')
            } finally {
                this.loading = false
            }
        },

        // 将目录结构转换为级联选择器需要的格式
        buildCatalogueOptions(catalogueList) {
            return catalogueList.map(item => {
                // 创建选项对象
                const option = {
                    value: item.id || item.path,
                    label: item.label,
                    path: item.path
                }

                // 如果是叶子节点，根据类型处理
                if (item.leaf) {
                    if (item.leafType === 'RULE') {
                        // 如果是规则，将从历史版本获取版本选项
                        this.fetchRuleVersions(item, option)
                    }
                }
                // 如果有子节点，递归处理
                else if (item.children && item.children.length) {
                    option.children = this.buildCatalogueOptions(item.children)
                }

                return option
            })
        },

        // 获取规则版本
        async fetchRuleVersions(ruleItem, optionItem) {
            try {
                // 获取规则历史版本
                const historyData = await getRuleHistory(ruleItem.ruleId, 'RULE')

                if (Array.isArray(historyData) && historyData.length > 0) {
                    // 创建版本选项
                    const versionOptions = historyData.map(version => ({
                        value: version.id,
                        label: `V${version.version || '1'}`,
                        ruleId: ruleItem.ruleId,
                        ruleName: ruleItem.label,
                        versionData: version
                    }))

                    // 设置规则的子选项为版本列表
                    optionItem.children = versionOptions
                }
            } catch (error) {
                console.error(`获取规则"${ruleItem.label}"的版本失败:`, error)
            }
        },

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
            if (!values || !values.length) return;

            values.forEach(path => {
                // 递归查找选中的选项
                const findSelectedOption = (options, pathParts, currentIndex) => {
                    if (!options || !options.length) return null;

                    const currentValue = pathParts[currentIndex];
                    const option = options.find(opt => opt.value === currentValue);

                    if (!option) return null;

                    // 如果已经到达路径末尾，返回当前选项
                    if (currentIndex === pathParts.length - 1) {
                        return option;
                    }

                    // 否则继续递归查找
                    if (option.children && option.children.length) {
                        return findSelectedOption(option.children, pathParts, currentIndex + 1);
                    }

                    return null;
                };

                // 找到最后一个选中的选项（版本）
                const versionOption = findSelectedOption(this.ruleOptions, path, 0);

                if (versionOption) {
                    // 查找父选项（规则）
                    const findParentOption = (options, targetValue, path = []) => {
                        for (let i = 0; i < options.length; i++) {
                            const option = options[i];
                            const currentPath = [...path, option];

                            if (option.value === targetValue) {
                                return currentPath;
                            }

                            if (option.children && option.children.length) {
                                const result = findParentOption(option.children, targetValue, currentPath);
                                if (result) return result;
                            }
                        }

                        return null;
                    };

                    const optionPath = findParentOption(this.ruleOptions, versionOption.value);

                    if (optionPath && optionPath.length >= 2) {
                        // 找到了规则和版本
                        const ruleOption = optionPath[optionPath.length - 2]; // 规则选项

                        // 添加到已选列表
                        this.selectedRulesList.push({
                            id: `${ruleOption.value}_${versionOption.value}`,
                            name: ruleOption.label || versionOption.ruleName, // 使用规则名称
                            version: versionOption.label || `V${versionOption.versionData?.version || '1'}` // 使用版本标签
                        });
                    } else if (versionOption.ruleName) {
                        // 如果找不到完整路径但有规则名称信息
                        this.selectedRulesList.push({
                            id: `${versionOption.ruleId}_${versionOption.value}`,
                            name: versionOption.ruleName,
                            version: versionOption.label
                        });
                    }
                }
            });
        },
        findOptionByValue(options, value) {
            return options.find(option => option.value === value)
        },
        removeRule(rule) {
            // 从已选列表中删除
            this.selectedRulesList = this.selectedRulesList.filter(item => item.id !== rule.id);

            // 从级联选择器中也删除对应的值
            const [ruleId, versionId] = rule.id.split('_');

            this.selectedRules = this.selectedRules.filter(path => {
                // 找到路径中包含此规则和版本的项
                const lastValue = path[path.length - 1];
                return lastValue !== versionId;
            });
        },
        handleFileChange(file, fileList) {
            this.fileList = fileList
        },
        // 修改handleSubmit方法
        async handleSubmit() {
            if (this.selectedRulesList.length === 0) {
                this.$message.warning('请至少选择一条规则');
                return;
            }

            try {
                this.loading = true;

                // 获取应用ID
                const applicationId = this.$store.state.app.applicationId;

                // 构建RuleVersionMap参数
                const ruleVersionMap = {};
                this.selectedRulesList.forEach(rule => {
                    const [ruleId, versionId] = rule.id.split('_');
                    ruleVersionMap[rule.name] = versionId; // 使用规则名称作为key，版本ID作为value
                });

                // 准备请求参数
                const formData = new FormData();
                formData.append('applicationId', applicationId);
                formData.append('RuleVersionMap', JSON.stringify(ruleVersionMap));

                // 根据输入类型添加不同的参数
                if (this.paramInputType === 'upload') {
                    // 如果是文件上传
                    if (this.fileList.length > 0) {
                        const file = this.fileList[0].raw;
                        formData.append('multipartFile', file);
                    } else {
                        this.$message.warning('请选择要上传的文件');
                        this.loading = false;
                        return;
                    }
                } else {
                    // 如果是JSON输入
                    try {
                        // 验证JSON格式
                        const jsonData = JSON.parse(this.jsonContent);
                        formData.append('input', JSON.stringify(jsonData));
                    } catch (error) {
                        this.$message.error(this.$t('ruleAnalysis.jsonError'));
                        this.loading = false;
                        return;
                    }
                }

                // 调用API
                const response = await ruleExecuteCompare(formData);

                // 处理响应数据
                if (response) {
                    // 假设响应中包含结果数据和规则内容数据
                    if (response.resultData) {
                        this.resultData = response.resultData;
                    }

                    if (response.ruleContentData) {
                        this.ruleContentData = response.ruleContentData;
                    }

                    this.$message.success(this.$t('ruleAnalysis.submitSuccess'));
                    // 切换到结果标签
                    this.activeTab = 'result';
                }
            } catch (error) {
                console.error('规则执行比较失败:', error);
                this.$message.error('规则执行比较失败，请重试');
            } finally {
                this.loading = false;
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