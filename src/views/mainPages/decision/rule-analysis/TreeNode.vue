<template>
    <div class="tree-item">
        <div class="tree-item-header" @click="toggleExpand">
            <i :class="hasChildren ? (expanded ? 'el-icon-arrow-down' : 'el-icon-arrow-right') : ''"></i>
            <!-- 增加条件样式，如果是差异项则显示红色 -->
            <span v-if="!node.isLeaf" :class="{ 'highlight-diff': node.isDifferent }">{{ node.label }}</span>
            <span v-else :class="{ 'highlight-diff': node.isDifferent }">{{ node.label }} >>> {{ node.value }}</span>
        </div>

        <!-- 增加class以便添加缩进样式 -->
        <div class="tree-item-children indented" v-if="expanded && hasChildren">
            <!-- 递归渲染子节点 -->
            <tree-node v-for="(child, index) in node.children" :key="index" :node="child" :depth="depth + 1"
                :diffPaths="diffPaths"></tree-node>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TreeNode',
    props: {
        node: {
            type: Object,
            required: true
        },
        depth: {
            type: Number,
            default: 0
        },
        // 添加一个prop传递差异路径集合
        diffPaths: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            expanded: true
        }
    },
    computed: {
        hasChildren() {
            return this.node.children && this.node.children.length > 0;
        },
        indent() {
            return 20;
        }
    },
    methods: {
        toggleExpand() {
            this.expanded = !this.expanded;
        }
    }
}
</script>

<style scoped>
.tree-item-children.indented {
    padding-left: 20px;
}

.tree-item-header {
    display: flex;
    align-items: center;
    padding: 4px 0;
    cursor: pointer;
}

.tree-item-header i {
    margin-right: 5px;
}

/* 差异项高亮样式 */
.highlight-diff {
    color: red;
    font-weight: bold;
}
</style>