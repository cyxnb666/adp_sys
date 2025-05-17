<template>
  <div class="scorecard-setting" @scroll="handleScroll">
    <div class="mt-15 padding-15 flex-wrap justify-content-between">
      <div class="card-head-style1 clearfix">
        <span>{{ $t('scorecardSetting.scorecardSetting') }}</span>
      </div>
      <div>
        <el-input
          v-model="condition"
          :placeholder="$t('scorecardSetting.searchPlaceholder')"
          style="width: 500px"
          clearable
          @change="findScorecard"
        >
          <el-button slot="append" icon="el-icon-search" @click="findScorecard" />
        </el-input>
        <el-button style="margin-left:20px" class="btn-border" @click="openScorecardList">{{ $t('scorecardSetting.openScorecardList') }}</el-button>
      </div>
    </div>
    <transition name="slide-fade">
      <div v-if="loading" class="loading">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <el-form v-else ref="scorecardSettingForm" :model="scorecardSettingForm" :inline="true">
        <ValidationObserver ref="obs" tag="form">
          <div
            v-if="scorecardSettingForm.scorecardList.length"
            class="content scorecard-list"
          >
            <!--  0-待审批，1-一级审批，2-二级审批，3-审批通过，4-退回修改，5-无需审批，6-审批不通过 -->
            <div
              v-for="(item, index) in scorecardSettingForm.scorecardList"
              :key="index"
              v-loading="showScorecard"
              class="item-wrap"
              :class="[
                'status_' + item.approvalStatus,
                { 'is-border': item.children ? true : false },
              ]"
            >
              <!-- 评分卡设置组件 -->
              <div class="">
                <ScorecardItem :item="item" :index="index" :edit="true" @previewScorecard="previewScorecard" @modifyScorecard="modifyScorecard" @deleteScorecard="deleteScorecard" @moveUpScorecard="moveUpScorecard" @updateDateRange="updateDateRange">
                  <template #status>
                    <div class="item approvalStatusDiv">
                      <span class="name">{{ $t('userInfo.approvalStatus') }}：</span>
                      <span class="value f14" :class="'approval_status_' + item.approvalStatus">{{ tableStatus(item.approvalStatus) }}</span>
                    </div>
                  </template>
                </ScorecardItem>
              </div>

            </div>
          </div>
          <div v-else class="no-data">{{ $t('scorecardSetting.noScorecardData') }}</div>
        </ValidationObserver>
      </el-form>
    </transition>

    <!-- 底部按钮 -->
    <div class="footer-btn-wrap app-container">
      <div />
      <div class="text-center">
        <el-button class="btn-border medium" @click="resetScorecards">{{ $t('common.reset') }}</el-button>
        <el-button class="btn-background medium" @click="saveScorecards">{{ $t('common.saveChange') }}</el-button>
      </div>
      <div />
    </div>

    <!-- 右侧的评分卡列表 -->
    <el-drawer
      :visible.sync="drawer"
      :with-header="false"
      size="520px"
      direction="rtl"
      custom-class="custom-class-drawer"
    >
      <div class="drawer-wrapper">
        <div class="head">
          {{ $t('scorecardSetting.scorecardList') }}
        </div>

        <div class="flex-wrap justify-content-between mt-15 mb-15">
          <div>
            <el-button class="btn-border mini" @click="openNewPage('/rule/management')">{{ $t('ruleManage.newScorecard') }}</el-button>
          </div>
          <div>
            <el-input
              v-model="search"
              :placeholder="$t('ruleList.searchEnter')"
              clearable
              @change="getScorecardList"
            >
              <el-button slot="append" icon="el-icon-search" @click="getScorecardList" />
            </el-input>
          </div>
        </div>
        <div class="content scroll" v-loading="drawerLoading">
          <NoData v-if="applicationScorecardList.length === 0" :text="$t('scorecardSetting.noScorecardData')" />
          <div
            v-for="(item, index) in applicationScorecardList"
            :key="index"
            class="rule-item"
          >
            <div class="item flex-wrap align-item-center relative">
              <svg-icon icon-class="ruleId" />
              <span class="name">评分卡名称：</span>
              <span class="value">{{ item.scorecardName }}</span>
            </div>
            <div class="item flex-wrap align-item-center">
              <svg-icon icon-class="path" />
              <span class="name">路径：</span>
              <span class="value">{{ item.scorecardPath }}</span>
            </div>
            <div class="flex-wrap justify-content-between mt-10">
              <div>
                <el-button type="mini" class="btn-border mini operation" @click="previewScorecard(item)">{{ $t('decisionTable.preview') }}</el-button>
              </div>
              <div>
                <el-button v-if="!hasScorecardId(item.scorecardInfoId)" type="mini" class="btn-border mini operation" @click="addScorecard(item)">{{ $t('scorecardSetting.add') }}</el-button>
                <el-button v-else type="mini" class="btn-background mini operation" disabled>{{ $t('scorecardSetting.added') }}</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- 预览评分卡 -->
    <el-dialog :title="previewScorecardItem.scorecardName" :visible.sync="showScorecard" width="80%">
      <ScorecardPreview v-if="showScorecard" :current-node="{scorecardId: previewScorecardItem.scorecardInfoId, leafType: 'SCORECARD'}" :read-only="true" />
    </el-dialog>

    <!-- 更新评分卡设置 -->
    <el-dialog :title="currentModel.scorecardName" :visible.sync="dialogFormVisible">
      <div>
        <h5>
          {{ $t('scorecardSetting.effTime') }}-{{ $t('scorecardSetting.noEffTime') }}
        </h5>
        <el-date-picker
          v-model="time"
          type="datetimerange"
          :range-separator="$t('dashboard.to')"
          :start-placeholder="$t('scorecardSetting.effTime')"
          :end-placeholder="$t('scorecardSetting.noEffTime')"
        />
      </div>
      <div class="mt-15">
        <h5>{{ $t('scorecardSetting.trial') }}</h5>
        <el-select v-model="scorecardTest" :placeholder="$t('scorecardSetting.pTrial')">
          <el-option :label="$t('scorecardSetting.trialOperation')" value="1" />
          <el-option :label="$t('scorecardSetting.startRun')" value="0" />
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handlePutScorecard">{{ $t('button.OK') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import SvgIcon from '@/components/SvgIcon'
import { handleStatus, tableStatus } from '@/views/mainPages/decision/utils'
import { getScorecardsByRepository } from '@/api/mainPages/scorecard'
import { getScorecardSettings, postScorecardSetting, putScorecardSetting, deleteScorecardSetting } from '@/api/mainPages/scorecard'
import { getDecisionRepositoryDetail } from '@/api/mainPages/decision'
import ScorecardPreview from './ScorecardPreview'
import NoData from '@/components/NoData'

export default {
  components: {
    SvgIcon,
    NoData,
    ScorecardItem: () => import('@/components/ScorecardItem'),
    ScorecardPreview
  },
  props: {
    decisionUrlId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      search: '',
      applicationScorecardList: [], // 该应用里所有的评分卡
      drawer: false, // 右侧列表
      dialogFormVisible: false, // 显示编辑弹框
      currentModel: '', // 当前编辑操作的评分卡
      time: [-28800000, 3155731200000], // 生效时间-失效时间
      scorecardTest: '0', // 试运行状态
      lang: this.$store.state.settings.lang,
      showScorecard: false, // 显示评分卡预览
      previewScorecardItem: {}, // 预览的评分卡项
      loading: false,
      scorecardSettingForm: { scorecardList: [] }, // 展示设置评分卡列表
      condition: '',
      handleScrollFlag: true,
      queryflag: false, // 防止重复加载标志
      drawerLoading: false, // 抽屉内容的加载状态
      decisionRepositoryId: '', // 存储决策库ID
      saveScorecardList: [] // 临时存储添加的评分卡
    }
  },
  filters: {
    formatDate(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      return date.toLocaleString()
    }
  },
  created() {
    this.handleStatus = handleStatus
    this.tableStatus = tableStatus
    this.loading = true
    this.getDecisionRepositoryId().then(() => {
      this.getScorecardSettings()
    })
  },
  methods: {
    // 查询评分卡设置列表
    getScorecardSettings(isReset) {
      // 如果已经在查询中，则返回
      if (this.queryflag) return

      // 如果不是重置操作且decisionUrlId为空，则返回
      if (!this.decisionUrlId && !isReset) {
        this.loading = false
        return
      }

      // 如果是重置操作，清空临时列表
      if (isReset) {
        this.saveScorecardList = []
      }

      // 设置查询标志
      this.queryflag = true

      getScorecardSettings(this.decisionUrlId, this.condition).then(res => {
        this.scorecardSettingForm.scorecardList = res.map(item => {
          return {
            ...item,
            time: [
              item.effectiveDate || -28800000,
              item.invalidatedDate || 3155731200000
            ]
          }
        })
        this.loading = false
        this.queryflag = false // 重置查询标志
      }).catch(() => {
        this.loading = false
        this.queryflag = false // 重置查询标志
      })
    },
    // 获取决策库ID
    getDecisionRepositoryId() {
      return getDecisionRepositoryDetail(this.$store.state.app.applicationId).then(res => {
        if (res && res.decisionRepositoryModel) {
          this.decisionRepositoryId = res.decisionRepositoryModel.id
        }
        return Promise.resolve()
      }).catch(error => {
        console.error('获取决策库信息失败', error)
        return Promise.resolve()
      })
    },

    // 查询应用下所有的评分卡
    getScorecardList() {
      if (!this.decisionRepositoryId) {
        console.error('决策库ID不存在')
        return Promise.resolve([])
      }

      return getScorecardsByRepository(this.decisionRepositoryId, this.search).then(res => {
        this.applicationScorecardList = res || []
        return res
      })
    },
    // 搜索评分卡
    findScorecard() {
      // 重置加载状态
      this.loading = true
      this.getScorecardSettings()
    },
    // 打开添加评分卡列表抽屉
    openScorecardList() {
      this.drawerLoading = true
      this.drawer = true

      this.getScorecardList().then(() => {
        this.drawerLoading = false
      }).catch(() => {
        this.drawerLoading = false
      })
    },

    // 预览评分卡
    previewScorecard(item) {
      this.previewScorecardItem = item
      this.showScorecard = true
    },

    // 评分卡是否被添加
    hasScorecardId(id) {
      // 检查显示列表中是否已有该评分卡
      return this.scorecardSettingForm.scorecardList.some(item => {
        return item.scorecardInfoId === id
      })
    },
    // 添加评分卡
    addScorecard(item) {
      // 创建评分卡数据对象
      const data = {
        scorecardInfoId: item.scorecardInfoId,
        decisionUrlId: this.decisionUrlId,
        effectiveDate: this.setTimeToMidnight(new Date()).getTime(),
        invalidatedDate: this.setTimeToEndOfDay(new Date('2099-12-31')).getTime(),
        scorecardTest: '0',
        scorecardOrder: this.scorecardSettingForm.scorecardList.length + 1
      }

      // 添加到临时列表
      this.saveScorecardList.push(data)

      // 添加到显示列表
      this.scorecardSettingForm.scorecardList.push({
        ...data,
        scorecardName: item.scorecardName,
        scorecardPath: item.scorecardPath,
        isNew: true // 标记为新添加的评分卡
      })
    },
    // 修改评分卡设置
    modifyScorecard(item) {
      this.dialogFormVisible = true
      this.time = [item.effectiveDate, item.invalidatedDate]
      this.scorecardTest = item.scorecardTest
      this.currentModel = item
    },

    // 上移评分卡
    moveUpScorecard(index) {
      if (index <= 0) return

      // 使用 splice 方法交换元素
      const front = this.scorecardSettingForm.scorecardList[index - 1]
      const last = this.scorecardSettingForm.scorecardList[index]
      this.scorecardSettingForm.scorecardList.splice(index - 1, 2, last, front)

      // 更新排序
      this.scorecardSettingForm.scorecardList.forEach((item, i) => {
        item.scorecardOrder = i + 1
      })

      // 强制视图更新
      this.$forceUpdate()
    },

    // 更新日期范围
    updateDateRange({ index, effectiveDate, invalidatedDate }) {
      // 更新列表中的日期
      const item = this.scorecardSettingForm.scorecardList[index]
      if (item) {
        item.effectiveDate = effectiveDate
        item.invalidatedDate = invalidatedDate
        item.time = [effectiveDate, invalidatedDate]

        // 如果是新添加的评分卡，更新临时列表中的日期
        if (item.isNew) {
          const savedItem = this.saveScorecardList.find(saved => saved.scorecardInfoId === item.scorecardInfoId)
          if (savedItem) {
            savedItem.effectiveDate = effectiveDate
            savedItem.invalidatedDate = invalidatedDate
          }
        } else {
          // 对于已存在的评分卡，检查是否已在临时列表中
          let savedItem = this.saveScorecardList.find(saved =>
            saved.scorecardInfoId === item.scorecardInfoId &&
            saved.decisionUrlId === this.decisionUrlId
          )

          // 如果不在临时列表中，添加到临时列表
          if (!savedItem) {
            savedItem = {
              scorecardInfoId: item.scorecardInfoId,
              decisionUrlId: this.decisionUrlId,
              effectiveDate: effectiveDate,
              invalidatedDate: invalidatedDate,
              scorecardOrder: item.scorecardOrder
            }
            this.saveScorecardList.push(savedItem)
          } else {
            // 如果已在临时列表中，更新日期
            savedItem.effectiveDate = effectiveDate
            savedItem.invalidatedDate = invalidatedDate
          }
        }
      }
    },

    // 将时间设置为零点
    setTimeToMidnight(date) {
      const newDate = new Date(date)
      newDate.setHours(0, 0, 0, 0)
      return newDate
    },

    // 将时间设置为一天结束 (23:59:59)
    setTimeToEndOfDay(date) {
      const newDate = new Date(date)
      newDate.setHours(23, 59, 59, 0)
      return newDate
    },
    // 更新评分卡设置信息
    handlePutScorecard() {
      const data = [{
        scorecardInfoId: this.currentModel.scorecardInfoId,
        decisionUrlId: this.decisionUrlId,
        effectiveDate: this.time[0],
        invalidatedDate: this.time[1],
        scorecardTest: this.scorecardTest
      }]

      putScorecardSetting(data).then(() => {
        this.getScorecardSettings()
        this.dialogFormVisible = false
      })
    },
    // 删除评分卡设置
    deleteScorecard(item, index) {
      // 如果是新添加的记录，直接从列表中移除
      if (item.isNew) {
        // 从显示列表中移除
        this.scorecardSettingForm.scorecardList.splice(index, 1);

        // 从临时列表中移除
        const saveIndex = this.saveScorecardList.findIndex(saved =>
          saved.scorecardInfoId === item.scorecardInfoId &&
          saved.decisionUrlId === this.decisionUrlId
        );
        if (saveIndex !== -1) {
          this.saveScorecardList.splice(saveIndex, 1);
        }

        // 更新排序
        this.scorecardSettingForm.scorecardList.forEach((item, i) => {
          item.scorecardOrder = i + 1
        })

        return;
      }

      // 如果是已保存的记录，调用后端 API 删除
      const data = {
        scorecardInfoId: item.scorecardInfoId,
        decisionUrlId: this.decisionUrlId
      }

      deleteScorecardSetting(data).then(() => {
        this.getScorecardSettings()
      })
    },
    // 下载评分卡
    downloadScorecard(item) {
      // 这里可以实现下载评分卡的功能，如果需要的话
    },
    // 打开新页面
    openNewPage(path) {
      this.$router.push(path)
    },
    // 滚动加载
    handleScroll() {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop
      const windowHeight = window.innerHeight
      const scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight
      if (scrollHeight - (scrollTop + windowHeight + (scrollHeight / 2)) <= 0) {
        if (this.handleScrollFlag) {
          this.getScorecardSettings()
        }
      }
    },
    // 撤销全部修改
    resetScorecards() {
      // 清空临时列表
      this.saveScorecardList = []

      // 先清空当前数据
      this.scorecardSettingForm.scorecardList = []
      // 重置加载状态
      this.loading = true
      // 然后重新加载，传入true表示这是一个重置操作
      this.getScorecardSettings(true)
      this.$message.success(this.$t('common.success'))
    },
    // 保存全部修改
    async saveScorecards() {
      // 检查是否有修改
      if (this.saveScorecardList.length === 0) {
        this.$message({
          message: '内容暂无修改',
          type: 'warning'
        })
        return false
      }

      // 调用API保存数据
      try {
        this.loading = true
        // 调用API保存数据
        await postScorecardSetting(this.saveScorecardList)

        // 清空临时列表
        this.saveScorecardList = []

        // 保存成功后显示成功消息
        this.$message.success(this.$t('common.success'))

        // 重新加载数据
        this.getScorecardSettings()
      } catch (error) {
        console.error('保存评分卡设置失败', error)
        this.$message.error('保存失败，请重试')
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss">
.scorecard-setting {
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    span {
      display: inline-block;
      width: 8px;
      height: 100%;
      margin-right: 5px;
      border-radius: 4px;
      background: lightgreen;
      animation: load 1s ease infinite;
      &:nth-child(2) {
        animation-delay: 0.2s;
      }
      &:nth-child(3) {
        animation-delay: 0.4s;
      }
      &:nth-child(4) {
        animation-delay: 0.6s;
      }
      &:nth-child(5) {
        animation-delay: 0.8s;
      }
    }
  }
  @keyframes load {
    0%,
    100% {
      height: 20px;
      background: lightgreen;
    }
    50% {
      height: 60px;
      margin-top: -20px;
      background: lightblue;
    }
  }
  .drawer-wrapper {
    padding: 23px;
    .head {
      padding-bottom: 15px;
      font-size: 16px;
      font-weight: bold;
      border-bottom: 1px solid #eee;
    }
    .content {
      height: calc(100vh - 225px);
      overflow-y: auto;
      .rule-item {
        margin-bottom: 15px;
        padding: 15px;
        border: 1px solid #ccc;
        border-radius: 4px;

        .item {
          margin-bottom: 10px;
          display: flex;
          align-items: center;

          &.line {
            width: 1px;
            height: 12px;
            background-color: #DCDFE6;
            margin: 0 10px;
          }

          .svg-icon {
            margin-right: 5px;
            font-size: 16px;
          }

          .name {
            font-weight: bold;
            margin-right: 5px;
            color: #60769C;
          }

          .value {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            flex: 1;
            color: #435475;
            font-size: 14px;

            &:hover {
              overflow: visible;
            }
          }

          .handle-right {
            margin-left: auto;
          }
        }
      }
    }
  }
  .no-data {
    text-align: center;
    padding: 20px;
    color: #999;
  }
  .preview-scorecard {
    padding: 20px;
    .scorecard-info {
      margin-bottom: 20px;
      .info-item {
        margin-bottom: 10px;
        .label {
          font-weight: bold;
          margin-right: 10px;
        }
      }
    }
  }
  .status_0 {
    border-left: 4px solid #e6a23c !important;
  }
  .status_1 {
    border-left: 4px solid #67c23a !important;
  }
  .status_2 {
    border-left: 4px solid #f56c6c !important;
  }
  .status_3 {
    border-left: 4px solid #909399 !important;
  }
  .status_4 {
    border-left: 4px solid #f56c6c !important;
  }
  .approval_status_0 {
    color: #e6a23c;
  }
  .approval_status_1 {
    color: #67c23a;
  }
  .approval_status_2 {
    color: #f56c6c;
  }
  .approval_status_3 {
    color: #909399;
  }
  .approval_status_4 {
    color: #f56c6c;
  }
}
</style>
