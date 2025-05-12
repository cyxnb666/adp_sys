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
                    <el-cascader ref="selectedRules" v-model="selectedRules" :options="ruleOptions" :props="{
                        multiple: true,
                        checkStrictly: true,
                        disabled: 'disabled'
                    }" clearable collapse-tags style="width: 300px" @change="handleRuleChange">
                    </el-cascader>
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
                            :on-change="handleFileChange" :file-list="fileList" :limit="1" accept=".txt">
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
        <el-card v-if="showResultCard" class="box-card result-card">
            <div slot="header" class="card-head-style1 clearfix">
                <span>{{ $t('ruleAnalysis.testResult') }}</span>
            </div>

            <div class="result-tabs">
                <el-tabs v-model="activeTab">
                    <el-tab-pane :label="$t('ruleAnalysis.executeResult')" name="result">
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
                                        <tree-node v-for="(rootItem, rootIndex) in ruleContent.treeData"
                                            :key="rootIndex" :node="rootItem" :depth="0"
                                            :diffPaths="ruleContent.diffPaths"></tree-node>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane :label="$t('ruleAnalysis.ruleContent')" name="content">
                        <div class="result-content-area rule-comparison">
                            <div class="comparison-column main-column">
                                <div class="column-content">
                                    <template v-for="ruleId in allRuleIds">
                                        <div class="result-panel" :key="'main-' + ruleId"
                                            v-if="findRuleById(mainResults, ruleId)">
                                            <div class="result-header">
                                                <div class="business-id">业务号: {{ findRuleById(mainResults,
                                                    ruleId).businessId }}</div>
                                                <div class="rule-info">{{ findRuleById(mainResults, ruleId).ruleCode }}
                                                    {{ findRuleById(mainResults, ruleId).ruleName }} <span
                                                        class="version-tag">V{{ findRuleById(mainResults,
                                                            ruleId).version }}</span></div>
                                            </div>
                                            <div class="result-body">
                                                <div class="definition-section">
                                                    <div class="section-title">预定义</div>
                                                    <div class="definition-content">
                                                        <p v-for="(def, defIndex) in findRuleById(mainResults, ruleId).definition"
                                                            :key="defIndex">{{ def }}</p>
                                                        <p v-if="findRuleById(mainResults, ruleId).codeBlock"
                                                            class="code-block">{{ findRuleById(mainResults,
                                                                ruleId).codeBlock }}</p>
                                                    </div>
                                                </div>
                                                <div class="result-section">
                                                    <div class="section-title">如果:</div>
                                                    <div class="result-content"
                                                        v-html="findRuleById(mainResults, ruleId).ifCondition"></div>
                                                    <div class="section-title">那么:</div>
                                                    <div class="result-content"
                                                        v-html="findRuleById(mainResults, ruleId).thenAction"></div>
                                                    <div class="section-title">否则:</div>
                                                    <div class="result-content"
                                                        v-html="findRuleById(mainResults, ruleId).elseAction"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="result-panel unmapped-panel" :key="'main-empty-' + ruleId" v-else>
                                            <div class="result-header">
                                                <div class="rule-info">未匹配</div>
                                            </div>
                                            <div class="result-body empty-body">
                                                <p>此规则在主规则集中不存在</p>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>

                            <div class="comparison-column second-column">
                                <div class="column-content">
                                    <template v-for="ruleId in allRuleIds">
                                        <div class="result-panel" :key="'second-' + ruleId"
                                            v-if="findRuleById(secondResults, ruleId)">
                                            <div class="result-header">
                                                <div class="business-id">业务号: {{ findRuleById(secondResults,
                                                    ruleId).businessId }}</div>
                                                <div class="rule-info">{{ findRuleById(secondResults, ruleId).ruleCode
                                                    }} {{ findRuleById(secondResults, ruleId).ruleName }} <span
                                                        class="version-tag">V{{ findRuleById(secondResults,
                                                            ruleId).version }}</span></div>
                                            </div>
                                            <div class="result-body">
                                                <div class="definition-section">
                                                    <div class="section-title">预定义</div>
                                                    <div class="definition-content">
                                                        <p v-for="(def, defIndex) in findRuleById(secondResults, ruleId).definition"
                                                            :key="defIndex">{{ def }}</p>
                                                        <p v-if="findRuleById(secondResults, ruleId).codeBlock"
                                                            class="code-block">{{ findRuleById(secondResults,
                                                                ruleId).codeBlock }}</p>
                                                    </div>
                                                </div>
                                                <div class="result-section">
                                                    <div class="section-title">如果:</div>
                                                    <div class="result-content"
                                                        v-html="findRuleById(secondResults, ruleId).ifCondition"></div>
                                                    <div class="section-title">那么:</div>
                                                    <div class="result-content"
                                                        v-html="findRuleById(secondResults, ruleId).thenAction"></div>
                                                    <div class="section-title">否则:</div>
                                                    <div class="result-content"
                                                        v-html="findRuleById(secondResults, ruleId).elseAction"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="result-panel unmapped-panel" :key="'second-empty-' + ruleId" v-else>
                                            <div class="result-header">
                                                <div class="rule-info">未匹配</div>
                                            </div>
                                            <div class="result-body empty-body">
                                                <p>此规则在次要规则集中不存在</p>
                                            </div>
                                        </div>
                                    </template>
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
import { getRuleHistory, ruleExecuteCompare, getCompareRepository } from '@/api/mainPages/decision'
import TreeNode from './TreeNode.vue'

export default {
    name: 'RuleAnalysis',
    components: {
        editor,
        TreeNode
    },
    data() {
        return {
            response: null,
            showResultCard: false,
            selectedRules: [],
            ruleOptions: [],
            selectedRulesList: [],
            ruleVersionSelections: {},
            originalCatalogueList: [],
            paramInputType: 'upload',
            fileList: [],
            activeTab: 'result',
            jsonContent: '{\n  "comCode":"1",\n  "underwriteInputXOM" : {\n    "allPremium":10\n  }\n}',
            editorOptions: {
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: true,
                showLineNumbers: true,
                tabSize: 2,
                fontSize: 14,
                showPrintMargin: false
            },
            resultData: [],
            ruleContentData: [],
        }
    },
    created() {
        this.fetchRuleOptions()
    },
    computed: {
        // 将resultData分成两组
        mainResults() {
            return this.resultData.filter(result => result.source === 'main');
        },
        secondResults() {
            return this.resultData.filter(result => result.source === 'second');
        },
        // 获取所有唯一的规则ID
        allRuleIds() {
            const allCodes = new Set();
            this.resultData.forEach(result => {
                allCodes.add(result.ruleCode);
            });
            return Array.from(allCodes);
        }
    },
    methods: {
        findRuleById(rulesArray, ruleId) {
            return rulesArray.find(rule => rule.ruleCode === ruleId);
        },
        // 重置所有版本节点的禁用状态
        resetAllDisabled(options) {
            if (!options) return;

            options.forEach(option => {
                // 如果是VERSION_NO类型，重置disabled
                if (option.leafType === 'VERSION_NO') {
                    option.disabled = false;
                }

                // 递归处理子节点
                if (option.children && option.children.length) {
                    this.resetAllDisabled(option.children);
                }
            });
        },
        disableOtherVersions(options, ruleId, selectedVersions) {
            // 递归查找规则节点
            const findAndDisable = (opts) => {
                if (!opts) return false;

                for (let i = 0; i < opts.length; i++) {
                    const opt = opts[i];

                    // 如果找到规则节点
                    if ((opt.ruleId === ruleId || opt.value === ruleId) &&
                        opt.leafType === 'RULE' &&
                        opt.children &&
                        opt.children.length) {

                        // 遍历其子节点(版本的节点)
                        opt.children.forEach(child => {
                            if (child.leafType === 'VERSION_NO' &&
                                !selectedVersions.includes(child.value)) {
                                // 禁用未被选择的版本
                                child.disabled = true;
                            }
                        });

                        return true;
                    }

                    // 递归检查子节点
                    if (opt.children && opt.children.length) {
                        if (findAndDisable(opt.children)) {
                            return true;
                        }
                    }
                }

                return false;
            };

            findAndDisable(options);
        },

        // 选项树中禁用状态
        setDisabledInOptions(options, parentValue, allowedValues) {
            for (let option of options) {
                if (option.value === parentValue && option.children) {
                    for (let child of option.children) {
                        // 只禁用非选中的版本选项
                        if (!allowedValues.includes(child.value)) {
                            child.disabled = true;
                        }
                    }
                    return true;
                } else if (option.children) {
                    if (this.setDisabledInOptions(option.children, parentValue, allowedValues)) {
                        return true;
                    }
                }
            }
            return false;
        },
        async fetchRuleOptions() {
            this.loading = true
            try {
                // 获取应用ID
                const applicationId = this.$store.state.app.applicationId

                // 获取决策库信息
                const response = await getCompareRepository(applicationId)

                if (response && response.decisionRepositoryModel) {
                    const { decisionRepositoryModel } = response

                    // 存储原始目录列表用于刷新选项
                    this.originalCatalogueList = decisionRepositoryModel.catalogueList || []

                    // 处理目录结构转换为选项格式
                    this.ruleOptions = this.buildCatalogueOptions(this.originalCatalogueList)
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
                    path: item.path,
                    // VERSION_NO类型的选项
                    disabled: !['VERSION_NO'].includes(item.leafType),
                    // 存储原始leafType和ruleId以便后续使用
                    leafType: item.leafType,
                    ruleId: item.ruleId
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
                    const versionOptions = historyData.map(version => ({
                        value: version.id,
                        label: `V${version.version || '1'}`,
                        ruleId: ruleItem.ruleId,
                        ruleName: ruleItem.label,
                        versionData: version,
                        leafType: 'VERSION_NO',
                        disabled: false
                    }))

                    // 设置规则的子选项为版本列表
                    optionItem.children = versionOptions
                }
            } catch (error) {
                console.error(`获取规则"${ruleItem.label}"的版本失败:`, error)
            }
        },

        refreshRuleOptions() {
            this.ruleOptions = this.buildCatalogueOptions(this.originalCatalogueList);
        },

        editorInit() {
            require('brace/ext/language_tools')
            require('brace/mode/json')
            require('brace/theme/chrome')
        },
        handleRuleChange(value) {
            this.selectedRulesList = [];

            if (value && value.length > 0) {
                this.processSelectedRules(value);
            }

            this.$nextTick(() => {
                this.refreshRuleOptions();
            });
        },
        processSelectedRules(values) {
            if (!values || !values.length) return;

            const validSelections = [];
            const tempRuleVersionSelections = { ...this.ruleVersionSelections };

            values.forEach(path => {
                const findSelectedOption = (options, pathParts, currentIndex) => {
                    if (!options || !options.length) return null;

                    const currentValue = pathParts[currentIndex];
                    const option = options.find(opt => opt.value === currentValue);

                    if (!option) return null;

                    if (currentIndex === pathParts.length - 1) {
                        return option;
                    }

                    if (option.children && option.children.length) {
                        return findSelectedOption(option.children, pathParts, currentIndex + 1);
                    }

                    return null;
                };

                const pathParts = Array.isArray(path) ? path : path.split(',');
                const selectedOption = findSelectedOption(this.ruleOptions, pathParts, 0);

                if (selectedOption) {
                    if (selectedOption.leafType === 'VERSION_NO') {
                        const parentPathParts = pathParts.slice(0, -1);
                        const parentOption = findSelectedOption(this.ruleOptions, parentPathParts, 0);

                        if (parentOption) {
                            const parentRuleId = parentOption.ruleId;

                            if (!tempRuleVersionSelections[parentRuleId]) {
                                tempRuleVersionSelections[parentRuleId] = [];
                            }

                            // 允许任意数量版本选择
                            validSelections.push(path);

                            if (!tempRuleVersionSelections[parentRuleId].includes(selectedOption.value)) {
                                tempRuleVersionSelections[parentRuleId].push(selectedOption.value);
                            }

                            const uniqueId = `${parentRuleId}_${selectedOption.value}`;
                            const existingItem = this.selectedRulesList.find(item => item.id === uniqueId);

                            if (!existingItem) {
                                this.selectedRulesList.push({
                                    id: uniqueId,
                                    name: parentOption.label,
                                    version: selectedOption.label,
                                    ruleId: parentRuleId,
                                    versionId: selectedOption.value
                                });
                            }
                        }
                    }
                    else if (selectedOption.leafType === 'RULE') {
                        validSelections.push(path);

                        const uniqueId = `${selectedOption.ruleId}_rule`;
                        const existingItem = this.selectedRulesList.find(item => item.id === uniqueId);

                        if (!existingItem) {
                            this.selectedRulesList.push({
                                id: uniqueId,
                                name: selectedOption.label,
                                version: '全部版本',
                                ruleId: selectedOption.ruleId
                            });
                        }
                    }
                }
            });

            this.selectedRules = validSelections;
            this.ruleVersionSelections = tempRuleVersionSelections;
        },
        findOptionByValue(options, value) {
            return options.find(option => option.value === value)
        },
        removeRule(rule) {
            // 从已选列表中删除
            this.selectedRulesList = this.selectedRulesList.filter(item => item.id !== rule.id);

            // 从selectedRules中移除
            if (rule.versionId) {
                this.selectedRules = this.selectedRules.filter(path => !path.includes(rule.versionId));
            } else {
                const ruleId = rule.ruleId || rule.id.split('_')[0];
                this.selectedRules = this.selectedRules.filter(path => !path.includes(ruleId));
            }

            const ruleId = rule.ruleId || rule.id.split('_')[0];

            if (this.ruleVersionSelections[ruleId]) {
                if (rule.versionId) {
                    // 移除特定版本
                    this.ruleVersionSelections[ruleId] = this.ruleVersionSelections[ruleId].filter(id =>
                        id !== rule.versionId
                    );
                } else if (rule.id.split('_')[1] === 'rule') {
                    // 如果移除整个规则，删除所有版本选择
                    delete this.ruleVersionSelections[ruleId];
                }

                // 如果没有选中的版本，清理对象
                if (this.ruleVersionSelections[ruleId] && this.ruleVersionSelections[ruleId].length === 0) {
                    delete this.ruleVersionSelections[ruleId];
                }
            }

            // 刷新选项
            this.$nextTick(() => {
                this.refreshRuleOptions();
            });
        },
        handleFileChange(file, fileList) {
            // 验证文件类型
            if (file.raw && !file.raw.name.endsWith('.txt')) {
                this.$message.warning('只能上传txt文件');
                this.fileList = fileList.filter(f => f.name.endsWith('.txt'));
            } else {
                this.fileList = fileList;
            }
        },
        processNestedData(data) {
            // 处理null或undefined
            if (data === null || data === undefined) {
                return [];
            }

            // 处理数组
            if (Array.isArray(data)) {
                return data.map((item, index) => {
                    return {
                        label: `[${index}]`,
                        children: this.processNestedData(item),
                        isLeaf: false
                    };
                });
            }

            // 处理对象
            if (typeof data === 'object') {
                const result = [];

                for (const key in data) {
                    const value = data[key];

                    // 基本类型值（包括null）
                    if (value === null || typeof value !== 'object') {
                        result.push({
                            label: key,
                            value: value !== null ? String(value) : 'null',
                            isLeaf: true
                        });
                    }
                    // 空对象或空数组
                    else if ((Array.isArray(value) && value.length === 0) ||
                        (!Array.isArray(value) && Object.keys(value).length === 0)) {
                        result.push({
                            label: key,
                            value: Array.isArray(value) ? '[]' : '{}',
                            isLeaf: true
                        });
                    }
                    // 非空对象或数组
                    else {
                        result.push({
                            label: key,
                            children: this.processNestedData(value),
                            isLeaf: false
                        });
                    }
                }

                return result;
            }

            // 基本类型值（不应到达这里，但为安全起见）
            return [{
                label: String(data),
                value: String(data),
                isLeaf: true
            }];
        },

        if(response) {
            console.log('规则执行比较成功:', response);

            // 处理mainResult和secondResult
            const mainResult = response.mainResult || {};
            const secondResult = response.secondResult || {};

            // 更新规则内容数据
            this.ruleContentData = [];

            // 处理主规则内容
            if (response.mainRuleMap && Object.keys(response.mainRuleMap).length > 0) {
                // 获取第一个规则的key
                const firstRuleKey = Object.keys(response.mainRuleMap)[0];
                const mainRule = response.mainRuleMap[firstRuleKey];

                this.ruleContentData.push({
                    ruleCode: firstRuleKey,
                    ruleName: mainRule.ruleName || '主执行结果',
                    version: mainRule.versionNo || 'V1',
                    treeData: this.processNestedData(response.mainResult || {}),
                    diffPaths: []
                });
            }

            // 处理次要规则内容
            if (response.secondRuleMap && Object.keys(response.secondRuleMap).length > 0) {
                // 获取第一个规则的key
                const firstRuleKey = Object.keys(response.secondRuleMap)[0];
                const secondRule = response.secondRuleMap[firstRuleKey];

                this.ruleContentData.push({
                    ruleCode: firstRuleKey,
                    ruleName: secondRule.ruleName || '次执行结果',
                    version: secondRule.versionNo || 'V2',
                    treeData: this.processNestedData(response.secondResult || {}),
                    diffPaths: []
                });
            }

            this.$message.success(this.$t('ruleAnalysis.submitSuccess'));
            this.activeTab = 'result';
        },
        findDifferences(mainResult, secondResult) {
            const mainPaths = this.collectPaths(mainResult);
            const secondPaths = this.collectPaths(secondResult);
            const diffPaths = [];

            // 比较所有路径
            for (const path in mainPaths) {
                if (secondPaths[path] !== undefined) {
                    // 如果两边都有这个路径，比较值
                    if (mainPaths[path] !== secondPaths[path]) {
                        diffPaths.push(path);
                    }
                } else {
                    // 右边没有的路径
                    diffPaths.push(path);
                }
            }

            // 检查右边有但左边没有的路径
            for (const path in secondPaths) {
                if (mainPaths[path] === undefined) {
                    diffPaths.push(path);
                }
            }

            return diffPaths;
        },

        // 收集所有路径和值
        collectPaths(data, prefix = '', result = {}) {
            if (data === null || data === undefined) {
                result[prefix] = 'null';
                return result;
            }

            if (Array.isArray(data)) {
                data.forEach((item, index) => {
                    this.collectPaths(item, prefix ? `${prefix}.[${index}]` : `[${index}]`, result);
                });
            } else if (typeof data === 'object') {
                for (const key in data) {
                    const value = data[key];
                    const newPrefix = prefix ? `${prefix}.${key}` : key;

                    if (value === null || value === undefined) {
                        result[newPrefix] = 'null';
                    } else if (typeof value !== 'object') {
                        result[newPrefix] = String(value);
                    } else if (Object.keys(value).length === 0) {
                        result[newPrefix] = '{}';
                    } else {
                        this.collectPaths(value, newPrefix, result);
                    }
                }
            } else {
                result[prefix] = String(data);
            }

            return result;
        },

        // 标记差异项
        markDifferences(treeData, diffPaths, currentPath = '') {
            return treeData.map(node => {
                const newNode = { ...node };
                const nodePath = currentPath ? `${currentPath}.${node.label}` : node.label;

                // 检查当前节点是否是差异项
                newNode.isDifferent = diffPaths.some(path =>
                    path === nodePath || path.startsWith(nodePath + '.') || nodePath.startsWith(path + '.')
                );

                // 处理子节点
                if (newNode.children && newNode.children.length) {
                    newNode.children = this.markDifferences(newNode.children, diffPaths, nodePath);
                }

                return newNode;
            });
        },
        // 添加在methods对象中
        getText(methodsList) {
            if (!methodsList || !methodsList.length) return '无';

            // 按照order属性排序
            const sortedMethods = [...methodsList].sort((a, b) => {
                const orderA = parseInt(a.order) || 0;
                const orderB = parseInt(b.order) || 0;
                return orderA - orderB;
            });

            let html = '';
            sortedMethods.forEach((method, index) => {
                if (index !== 0) {
                    html += '<br>';
                }

                html += (index + 1) + '. ';

                try {
                    // 解析details JSON字符串
                    const details = JSON.parse(method.details || '[]');

                    // 获取描述文本
                    let displayText = '';
                    details.forEach(detail => {
                        if (detail.type === "text") {
                            displayText += `<span class="fields">${detail.desc || ''}</span>`;
                        }
                    });

                    // 获取参数值
                    if (method.settingParamDTOList && method.settingParamDTOList.length) {
                        method.settingParamDTOList.forEach(param => {
                            displayText += ` <span class="values">${param.paramValue}</span>`;
                        });
                    }

                    html += displayText + ';';
                } catch (e) {
                    console.error('解析方法详情失败:', e);
                    html += `<span class="fields">${method.methodId || '未知方法'}</span>;`;
                }
            });

            return html;
        },
        async handleSubmit() {
            if (this.selectedRulesList.length === 0) {
                this.$message.warning('请至少选择一条规则');
                return;
            }

            try {
                this.loading = true;

                // 获取的应用ID
                const applicationId = this.$store.state.app.applicationId;

                // 构建RuleVersionMap参数
                const ruleVersionMap = {};

                // 首先，按照ruleId对选择项进行分组，以便处理多版本选择
                const ruleGroups = {};
                this.selectedRulesList.forEach(rule => {
                    if (!ruleGroups[rule.ruleId]) {
                        ruleGroups[rule.ruleId] = [];
                    }
                    ruleGroups[rule.ruleId].push(rule);
                });

                // 处理每组规则选择
                Object.keys(ruleGroups).forEach(ruleId => {
                    const rulesInGroup = ruleGroups[ruleId];

                    // 如果该组只有1个规则，且是RULE类型（非版本选择）
                    if (rulesInGroup.length === 1 && rulesInGroup[0].version === '全部版本') {
                        // RULE类型 - 使用格式 "label": "id"
                        const rule = rulesInGroup[0];
                        ruleVersionMap[rule.name] = rule.ruleId;
                    }
                    else {
                        // 如果只选择了一个版本
                        if (rulesInGroup.length === 1) {
                            const rule = rulesInGroup[0];
                            // 提取版本标签（去掉V前缀，如果有的话）
                            const versionLabel = rule.version.replace(/^V/i, '');
                            // 使用单版本格式 "label": "ruleId-label"
                            ruleVersionMap[versionLabel] = `${ruleId}-${versionLabel}`;
                        }
                        // 如果选择了两个版本
                        else if (rulesInGroup.length === 2) {
                            // 提取两个版本标签
                            const versionLabel1 = rulesInGroup[0].version.replace(/^V/i, '');
                            const versionLabel2 = rulesInGroup[1].version.replace(/^V/i, '');

                            // 使用多版本格式 "label1-label2": "ruleId-label1-label2"
                            const key = `${versionLabel1}-${versionLabel2}`;
                            const value = `${ruleId}-${versionLabel1}-${versionLabel2}`;

                            ruleVersionMap[key] = value;
                        }
                    }
                });

                console.log('RuleVersionMap:', ruleVersionMap);

                // 准备请求参数
                const formData = new FormData();
                formData.append('applicationId', applicationId);
                Object.keys(ruleVersionMap).forEach(key => {
                    formData.append(`ruleVersionMap[${key}]`, ruleVersionMap[key]);
                });

                // 根据输入类型添加不同的参数
                if (this.paramInputType === 'upload') {
                    // 处理文件上传
                    if (this.fileList.length > 0) {
                        const file = this.fileList[0].raw;
                        formData.append('multipartFile', file);
                    } else {
                        this.$message.warning('请选择要上传的文件');
                        this.loading = false;
                        return;
                    }
                } else {
                    // 处理JSON输入
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

                const response = await ruleExecuteCompare(formData);

                if (response) {
                    this.response = response;
                    console.log('规则执行比较成功:', response);

                    // 清空之前的结果数据
                    this.resultData = [];
                    this.ruleContentData = [];

                    // 处理mainRuleMap数据 - 用于规则内容标签页
                    if (response.mainRuleMap && Object.keys(response.mainRuleMap).length > 0) {
                        Object.keys(response.mainRuleMap).forEach(ruleKey => {
                            const rule = response.mainRuleMap[ruleKey];

                            // 区分"那么"和"否则"
                            const thenMethods = rule.methods ? rule.methods.filter(m => m.settingThen === "1") : [];
                            const elseMethods = rule.methods ? rule.methods.filter(m => m.settingThen === "0") : [];

                            this.resultData.push({
                                businessId: response.mainBusinessKey || 'Unknown',
                                ruleCode: ruleKey,
                                ruleName: rule.ruleName,
                                version: rule.versionNo || '1',
                                definition: rule.predefineContent ?
                                    [rule.predefineContent] :
                                    ['无预定义内容'],
                                codeBlock: '',
                                ifCondition: rule.ruleDesc || '无条件描述',
                                thenAction: this.getText(thenMethods),
                                elseAction: this.getText(elseMethods),
                                source: 'main' // 添加来源标记
                            });
                        });
                    }

                    // 处理secondRuleMap数据 - 用于规则内容标签页
                    if (response.secondRuleMap && Object.keys(response.secondRuleMap).length > 0) {
                        Object.keys(response.secondRuleMap).forEach(ruleKey => {
                            const rule = response.secondRuleMap[ruleKey];

                            // 区分"那么"和"否则"方法
                            const thenMethods = rule.methods ? rule.methods.filter(m => m.settingThen === "1") : [];
                            const elseMethods = rule.methods ? rule.methods.filter(m => m.settingThen === "0") : [];

                            this.resultData.push({
                                businessId: response.secondBusinessKey || 'Unknown',
                                ruleCode: ruleKey,
                                ruleName: rule.ruleName,
                                version: rule.versionNo || '1',
                                definition: rule.predefineContent ?
                                    [rule.predefineContent] :
                                    ['无预定义内容'],
                                codeBlock: '',
                                ifCondition: rule.ruleDesc || '无条件描述',
                                thenAction: this.getText(thenMethods),
                                elseAction: this.getText(elseMethods),
                                source: 'second' // 添加来源标记
                            });
                        });
                    }

                    // 处理主规则内容
                    const hasMainContent = response.mainResult && Object.keys(response.mainResult).length > 0;
                    if (hasMainContent) {
                        // 获取规则信息，如果mainRuleMap存在就用它，否则使用默认值
                        let ruleCode = "main";
                        let ruleName = "主执行结果";
                        let versionNo = "V1";

                        if (response.mainRuleMap && Object.keys(response.mainRuleMap).length > 0) {
                            const firstRuleKey = Object.keys(response.mainRuleMap)[0];
                            const mainRule = response.mainRuleMap[firstRuleKey];
                            ruleCode = firstRuleKey;
                            ruleName = mainRule.ruleName || ruleName;
                            versionNo = mainRule.versionNo || versionNo;
                        }

                        this.ruleContentData.push({
                            ruleCode: ruleCode,
                            ruleName: ruleName,
                            version: versionNo,
                            treeData: this.processNestedData(response.mainResult || {}),
                            diffPaths: []
                        });
                    }

                    // 处理次要规则内容
                    const hasSecondContent = response.secondResult && Object.keys(response.secondResult).length > 0;
                    if (hasSecondContent) {
                        // 获取规则信息，如果secondRuleMap存在就用它，否则使用默认值
                        let ruleCode = "second";
                        let ruleName = "次执行结果";
                        let versionNo = "V2";

                        if (response.secondRuleMap && Object.keys(response.secondRuleMap).length > 0) {
                            const firstRuleKey = Object.keys(response.secondRuleMap)[0];
                            const secondRule = response.secondRuleMap[firstRuleKey];
                            ruleCode = firstRuleKey;
                            ruleName = secondRule.ruleName || ruleName;
                            versionNo = secondRule.versionNo || versionNo;
                        }

                        this.ruleContentData.push({
                            ruleCode: ruleCode,
                            ruleName: ruleName,
                            version: versionNo,
                            treeData: this.processNestedData(response.secondResult || {}),
                            diffPaths: []
                        });
                    }

                    // 如果有数据需要比较，计算差异并标记
                    if (hasMainContent && hasSecondContent) {
                        // 找出两个结果之间的差异路径
                        const diffPaths = this.findDifferences(response.mainResult, response.secondResult);

                        // 更新两个结果的diffPaths
                        if (this.ruleContentData.length > 0) {
                            this.ruleContentData[0].diffPaths = diffPaths;
                        }
                        if (this.ruleContentData.length > 1) {
                            this.ruleContentData[1].diffPaths = diffPaths;
                        }

                        // 标记差异项
                        this.ruleContentData.forEach(content => {
                            content.treeData = this.markDifferences(content.treeData, content.diffPaths);
                        });
                    }

                    // 显示结果卡片
                    this.showResultCard = this.ruleContentData.length > 0 || this.resultData.length > 0;

                    if (this.showResultCard) {
                        this.$message.success(this.$t('ruleAnalysis.submitSuccess'));
                        this.activeTab = 'result';
                    } else {
                        this.$message.warning('未找到可比较的规则执行结果');
                    }
                }
            } catch (error) {
                console.error('规则执行比较失败:', error);
                this.$message.error('规则执行比较失败，请重试');
                this.showResultCard = false;
            } finally {
                this.loading = false;
            }
        }
    },
    watch: {
        selectedRules(value) {
            // 创建选项的深拷贝
            const newOptions = JSON.parse(JSON.stringify(this.ruleOptions));

            // 首先重置所有版本节点的禁用状态
            this.resetAllDisabled(newOptions);

            // 收集所有被选中的版本节点信息
            const ruleVersionMap = {};

            // 处理不同格式的选择路径
            value.forEach(path => {
                const pathArray = Array.isArray(path) ? path : path.split(',');

                // 确定这个选择是否为版本节点
                let isVersionSelection = false;
                let ruleId = null;
                let versionId = null;

                // 获取选中节点的完整信息
                const node = this.$refs.selectedRules.getCheckedNodes().find(
                    n => JSON.stringify(n.pathNodes.map(p => p.value)) === JSON.stringify(pathArray)
                );

                if (node && node.data) {
                    // 如果是版本节点
                    if (node.data.leafType === 'VERSION_NO') {
                        isVersionSelection = true;
                        versionId = node.data.value;

                        // 获取父节点(规则节点)信息
                        if (node.parent && node.parent.data) {
                            ruleId = node.parent.data.ruleId || node.parent.data.value;
                        }
                    }
                }

                // 记录版本选择
                if (isVersionSelection && ruleId && versionId) {
                    if (!ruleVersionMap[ruleId]) {
                        ruleVersionMap[ruleId] = [];
                    }

                    if (!ruleVersionMap[ruleId].includes(versionId)) {
                        ruleVersionMap[ruleId].push(versionId);
                    }
                }
            });

            // 处理每个规则的版本选择限制
            Object.keys(ruleVersionMap).forEach(ruleId => {
                const selectedVersions = ruleVersionMap[ruleId];

                // 如果某规则已选择两个版本，禁用其他版本
                if (selectedVersions.length === 2) {
                    this.disableOtherVersions(newOptions, ruleId, selectedVersions);
                }
            });

            // 更新!!!
            this.$nextTick(() => {
                this.ruleOptions = newOptions;
            });
        },
        paramInputType(newVal) {
            if (newVal === 'upload') {
                this.jsonContent = '{\n  "comCode": "",\n  "input": {\n    \n  }\n}';
            } else if (newVal === 'manual') {
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
        padding-top: 6px;
    }

    .section-content {
        flex: 1;
    }

    .radio-group-wrapper {
        margin-top: 8px;
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

    .rule-comparison {
        display: flex;
        gap: 20px;
        width: 100%;
    }

    .comparison-column {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .column-header {
        font-weight: bold;
        padding: 10px;
        background-color: #f0f9eb;
        border: 1px solid #e1f3d8;
        text-align: center;
        margin-bottom: 10px;
        border-radius: 4px;
    }

    .column-content {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .unmapped-panel {
        background-color: #f5f7fa;
        opacity: 0.8;
    }

    .empty-body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100px;
        font-style: italic;
        color: #909399;
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

::v-deep .el-tabs__item.is-active {
    color: #409EFF;
    font-weight: bold;
}

::v-deep .el-tabs__active-bar {
    background-color: #409EFF;
}

::v-deep .el-tabs__nav-wrap::after {
    background-color: #EBEEF5;
}
</style>