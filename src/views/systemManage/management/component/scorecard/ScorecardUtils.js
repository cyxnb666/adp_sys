/**
 * Utility functions for scorecard operations
 */


/**
 * Format scorecard data for API submission
 * @param {Object} scorecardData - The scorecard data from the component
 * @returns {Object} - Formatted data for API
 */
export function formatScorecardForSubmission(scorecardData) {
  // 创建深拷贝，避免修改原始数据
  const payload = JSON.parse(JSON.stringify(scorecardData));

  // 将嵌套结构转换为扁平结构，以符合后端 API 的要求
  if (payload.rule) {
    payload.ruleId = payload.rule.ruleId;
    payload.ruleContent = payload.rule.ruleContent;
    payload.ruleDesc = payload.rule.ruleDesc;
    delete payload.rule;
  }

  // 处理条件行数据
  if (payload.conditionRows && payload.conditionRows.length > 0) {
    // 将条件行中的数据分配到属性组和属性中
    payload.attributeGroups.forEach(group => {
      if (!group.attributes) {
        group.attributes = [];
      }

      group.attributes.forEach(attr => {
        // 重置条件数组，确保只包含当前条件行中的条件
        attr.conditions = [];
      });
    });

    // 遍历条件行，将条件分配到对应的属性中
    payload.conditionRows.forEach((row, rowIndex) => {
      if (!row.conditions) return;

      row.conditions.forEach(cond => {
        // 找到对应的属性组
        const group = payload.attributeGroups.find(g => g.scorecardAttributeGroupId === cond.scorecardAttributeGroupId);
        if (!group) return;

        // 找到对应的属性
        const attr = group.attributes.find(a => a.scorecardAttributeId === cond.scorecardAttributeId);
        if (!attr) return;

        // 将条件添加到属性的条件数组中
        attr.conditions.push({
          scorecardConditionId: cond.scorecardConditionId,
          conditionOrder: attr.conditions.length + 1, // 始终使用属性的条件数量计算顺序号，确保顺序号连续
          conditionOperator: cond.conditionOperator || '',
          conditionValue: cond.conditionValue || '',
          conditionExpression: `${attr.attributeFieldPath} ${cond.conditionOperator || ''} ${cond.conditionValue || ''}`.trim(),
          conditionDescription: cond.conditionDescription || '点击编辑条件',
          weight: parseFloat(row.weight) || 0,
          scoreValue: parseFloat(row.scoreValue) || 0
        });
      });
    });
  } else {
    // 如果没有条件行，清空所有属性的条件数组
    payload.attributeGroups.forEach(group => {
      if (!group.attributes) {
        group.attributes = [];
      }

      group.attributes.forEach(attr => {
        attr.conditions = [];
      });
    });
  }

  // 删除不需要发送给后端的数据
  delete payload.conditionRows;

  return payload;
}

/**
 * Initialize a new scorecard data structure
 * @param {Object} options - Options for initialization
 * @returns {Object} - New scorecard data structure
 */
export function initScorecardData(options = {}) {
  const { decisionRepositoryId = null, scorecardPath = '/', decisionRepCatalogueId = null } = options;

  // 使用简单的临时ID，后端会生成正式UUID
  const tempGroupId = 'group_' + Date.now();

  return {
    scorecardInfoId: null,
    scorecardName: '',
    scorecardPath: scorecardPath,
    decisionRepositoryId: decisionRepositoryId,
    decisionRepCatalogueId: decisionRepCatalogueId,
    ruleId: null,
    ruleContent: null,
    ruleDesc: '',
    scoreContainerFieldPath: '',
    scoreContainerFieldName: '',
    scoreContainerFieldType: '',
    // 添加嵌套结构，与前端代码中使用的结构保持一致
    rule: {
      ruleTips: null, // 提示
      ruleContent: null, // 规则详情
      ruleDesc: '', // 规则中文描述
      ruleName: null, // 规则名称
      ruleId: null, // 规则id
      predefineText: null, // 预定义文本
      editPredefineText: null, // 编辑预定义文本
      predefine: null // 预定义对象
    },
    attributeGroups: [
      {
        scorecardAttributeGroupId: tempGroupId, // 使用临时ID，后端会生成正式UUID
        groupName: '属性组 1',
        groupOrder: 1,
        attributes: []
      }
    ],
    conditionRows: [
      {
        rowId: 'row_' + Date.now(), // 使用临时ID，后端会生成正式UUID
        conditions: [
          {
            scorecardAttributeGroupId: tempGroupId, // 使用上面的临时属性组ID
            scorecardAttributeId: '',
            scorecardConditionId: 'cond_' + Date.now(), // 使用临时ID，后端会生成正式UUID
            conditionOperator: '',
            conditionValue: '',
            conditionDescription: '点击编辑条件'
          }
        ],
        weight: 0,
        scoreValue: 0
      }
    ]
  };
}

/**
 * Generate table data for rendering
 * @param {Object} scorecardData - The scorecard data
 * @returns {Array} - Formatted table data for rendering
 */
export function generateTableData(scorecardData) {
  if (!scorecardData || !scorecardData.conditionRows || !scorecardData.attributeGroups) {
    return [];
  }

  // 创建原始数据的深拷贝，确保不会修改原始数据
  const conditionRows = JSON.parse(JSON.stringify(scorecardData.conditionRows));
  const attributeGroups = JSON.parse(JSON.stringify(scorecardData.attributeGroups));

  // 确保每个属性组都有attributes属性
  attributeGroups.forEach(group => {
    if (!group.attributes) {
      group.attributes = [];
    }
  });

  // 定义返回的表格数据
  const tableData = [];

  // 首先处理每一行
  conditionRows.forEach((row, rowIndex) => {
    // 确保条件数组存在
    if (!row.conditions) {
      row.conditions = [];
    }

    // 创建基本行数据
    const tableRow = {
      rowId: row.rowId,
      weight: typeof row.weight === 'number' ? row.weight : 0,
      scoreValue: typeof row.scoreValue === 'number' ? row.scoreValue : 0,
      _originalRow: row // 保存原始行引用，便于后续更新
    };

    // 处理每个属性组
    attributeGroups.forEach(group => {
      // 查找该行中该属性组的条件
      let condition = row.conditions.find(c => c.scorecardAttributeGroupId === group.scorecardAttributeGroupId);

      // 如果没有找到条件，创建一个新的条件
      if (!condition) {
        condition = {
          scorecardAttributeGroupId: group.scorecardAttributeGroupId,
          scorecardAttributeId: '',
          scorecardConditionId: `cond_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          conditionOperator: '',
          conditionValue: '',
          conditionDescription: '点击编辑条件'
        };
        row.conditions.push(condition);
      }

      // 添加属性列
      const selectedAttribute = condition.scorecardAttributeId ?
        group.attributes.find(attr => attr.scorecardAttributeId === condition.scorecardAttributeId) : null;

      tableRow[`attribute_${group.scorecardAttributeGroupId}`] = {
        scorecardAttributeGroupId: group.scorecardAttributeGroupId,
        scorecardAttributeId: condition.scorecardAttributeId || '',
        // 添加属性名称和字段类型
        attributeName: selectedAttribute ? (selectedAttribute.attributeFieldName || selectedAttribute.attributeName) : '',
        attributeFieldType: selectedAttribute ? selectedAttribute.attributeFieldType : '',
        options: group.attributes.map(attr => ({
          value: attr.scorecardAttributeId,
          label: attr.attributeFieldName || attr.attributeName || '请选择属性'
        }))
      };

      // 添加条件列
      tableRow[`condition_${group.scorecardAttributeGroupId}`] = {
        scorecardAttributeGroupId: group.scorecardAttributeGroupId,
        scorecardAttributeId: condition.scorecardAttributeId || '',
        scorecardConditionId: condition.scorecardConditionId,
        conditionOperator: condition.conditionOperator || '',
        conditionValue: condition.conditionValue || '',
        conditionDescription: condition.conditionDescription || '点击编辑条件',
        conditionOrder: condition.conditionOrder // 保留原始的条件顺序号
      };
    });

    tableData.push(tableRow);
  });

  // 处理属性列的合并单元格

  // 首先按行的顺序对每个属性组进行排序
  // 这样可以确保添加条件行时保持原有的顺序
  const sortedRows = {};

  // 对每个属性组处理
  attributeGroups.forEach(group => {
    // 初始化该属性组的排序容器
    sortedRows[group.scorecardAttributeGroupId] = {};

    // 对每一行处理
    tableData.forEach(row => {
      const attributeId = row[`attribute_${group.scorecardAttributeGroupId}`].scorecardAttributeId;
      if (!attributeId) return; // 跳过空属性

      // 如果这个属性还没有对应的行数组，创建一个
      if (!sortedRows[group.scorecardAttributeGroupId][attributeId]) {
        sortedRows[group.scorecardAttributeGroupId][attributeId] = [];
      }

      // 将行添加到对应属性的行数组中
      sortedRows[group.scorecardAttributeGroupId][attributeId].push(row);
    });
  });

  // 处理合并单元格
  attributeGroups.forEach(group => {
    const groupId = group.scorecardAttributeGroupId;

    // 对每个属性处理
    Object.keys(sortedRows[groupId]).forEach(attributeId => {
      const rows = sortedRows[groupId][attributeId];

      if (rows.length > 0) {
        // 第一行是属性的主行
        const firstRow = rows[0];
        firstRow[`attribute_${groupId}`].isFirstRow = true;
        firstRow[`attribute_${groupId}`].spanRows = rows.length;

        // 其他行是子行
        for (let i = 1; i < rows.length; i++) {
          const childRow = rows[i];
          childRow[`attribute_${groupId}`].isFirstRow = false;
          childRow[`attribute_${groupId}`].parentRowId = firstRow.rowId;
        }
      }
    });
  });

  // 处理没有属性的行
  tableData.forEach(row => {
    attributeGroups.forEach(group => {
      if (!row[`attribute_${group.scorecardAttributeGroupId}`].scorecardAttributeId) {
        // 如果属性ID为空，确保条件列也显示为空
        row[`condition_${group.scorecardAttributeGroupId}`].conditionDescription = '点击编辑条件';
        row[`condition_${group.scorecardAttributeGroupId}`].conditionOperator = '';
        row[`condition_${group.scorecardAttributeGroupId}`].conditionValue = '';
      }
    });
  });

  return tableData;
}

/**
 * 从属性组中生成条件行
 * @param {Array<ScorecardAttributeGroupDTO>} attributeGroups - 属性组列表
 * @returns {Array<ConditionRow>} 条件行列表
 */
export function generateConditionRowsFromAttributes(attributeGroups) {
  // 创建条件行数组
  const conditionRows = [];

  // 收集所有属性组的属性和条件
  const allConditions = [];

  // 首先收集所有属性组的属性和条件
  attributeGroups.forEach(group => {
    if (group.attributes) {
      // 按属性顺序排序属性
      const sortedAttributes = [...group.attributes].sort((a, b) =>
        (a.attributeOrder || 0) - (b.attributeOrder || 0)
      );

      // 对每个属性处理条件
      sortedAttributes.forEach(attribute => {
        if (attribute.conditions && attribute.conditions.length > 0) {
          // 按条件顺序排序条件
          const sortedConditions = [...attribute.conditions].sort((a, b) =>
            (a.conditionOrder || 0) - (b.conditionOrder || 0)
          );

          // 添加每个条件
          sortedConditions.forEach(condition => {
            allConditions.push({
              group,
              attribute,
              condition,
              weight: condition.weight || 0,
              scoreValue: condition.scoreValue || 0
            });
          });
        } else {
          // 如果属性没有条件，添加一个空条件
          allConditions.push({
            group,
            attribute,
            condition: null,
            weight: 0,
            scoreValue: 0
          });
        }
      });
    }
  });

  // 按权重和分值分组条件
  const conditionsByKey = {};

  allConditions.forEach(item => {
    const key = `${item.weight}_${item.scoreValue}`;
    if (!conditionsByKey[key]) {
      conditionsByKey[key] = [];
    }
    conditionsByKey[key].push(item);
  });

  // 为每组条件创建一行
  Object.keys(conditionsByKey).forEach(key => {
    const conditionItems = conditionsByKey[key];
    if (conditionItems.length > 0) {
      const rowId = `row_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // 创建条件行
      const conditionRow = {
        rowId,
        weight: conditionItems[0].weight,
        scoreValue: conditionItems[0].scoreValue,
        conditions: []
      };

      // 添加每个属性组的属性和条件信息
      conditionItems.forEach(item => {
        const { group, attribute, condition } = item;
        const groupId = group.scorecardAttributeGroupId;

        // 添加属性信息
        conditionRow[`attribute_${groupId}`] = {
          groupId: groupId,
          attributeId: attribute.scorecardAttributeId,
          attributeName: attribute.attributeFieldName || attribute.attributeName || '',
          attributeFieldType: attribute.attributeFieldType || ''
        };

        // 添加条件信息
        if (condition) {
          conditionRow[`condition_${groupId}`] = {
            groupId: groupId,
            attributeId: attribute.scorecardAttributeId,
            conditionId: condition.scorecardConditionId,
            operator: condition.conditionOperator || '',
            value: condition.conditionValue || '',
            display: condition.conditionDescription || ''
          };

          // 添加到条件数组
          conditionRow.conditions.push({
            scorecardAttributeGroupId: groupId,
            scorecardAttributeId: attribute.scorecardAttributeId,
            scorecardConditionId: condition.scorecardConditionId,
            conditionOperator: condition.conditionOperator || '',
            conditionValue: condition.conditionValue || '',
            conditionDescription: condition.conditionDescription || '',
            conditionOrder: condition.conditionOrder // 保留原始的条件顺序号
          });
        } else {
          // 如果没有条件，添加空条件信息
          conditionRow[`condition_${groupId}`] = {
            groupId: groupId,
            attributeId: attribute.scorecardAttributeId,
            conditionId: '',
            operator: '',
            value: '',
            display: '无条件'
          };
        }
      });

      // 添加到条件行数组
      conditionRows.push(conditionRow);
    }
  });

  return conditionRows;
}
