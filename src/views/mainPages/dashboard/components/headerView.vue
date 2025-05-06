<template>
  <div class="headerView">
    <div v-for="(item,index) in headerList" :key="index" class="headerView-item">
      <img class="image" :src="item.img" alt="" width="50px" height="50px">
      <div class="boxRight">
        <div class="value"> {{ item.value }} <span class="unit">个</span></div>
        <div class="title">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>

<script>

import moment from "moment/moment";
import {appRuleSetting} from "@/api/mainPages/dashboard";

export default {
  name: 'headerView',
  components: {},
  props: {},
  data() {
    return {
      headerList: [
        {
          title: '待审核规则数量',
          key: 'approvalRuleNum',
          value: 0,
          img: require('../images/image1.png')
        },
        {
          title: '试运行规则数量',
          key: 'testRuleNum',
          value: 0,
          img: require('../images/image2.png')
        },
        {
          title: '总规则条数',
          key: 'allRuleNum',
          value: 0,
          img: require('../images/image3.png')
        },
        {
          title: '总决策路径',
          value: 0,
          key: 'decisionUrlNum',
          img: require('../images/image4.png')
        },
      ]
    };
  },
  computed: {},
  watch: {},
  created() {
    this.appRuleSetting()
  },
  mounted() {
  },
  methods: {
    appRuleSetting() {
      const data = {
        applicationId: this.$store.state.app.applicationId,
        time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      }
      appRuleSetting(data).then(res => {
        for (const resKey in res) {
          const headerItem = this.headerList.find(item => item.key === resKey);
          if (headerItem) {
            headerItem.value = res[resKey];
          }
        }
      })
    }
  },
}


</script>

<style lang="scss" scoped>
.headerView {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  &-item {
    height: 120px;
    margin-right: 20px;
    padding: 0 30px;
    width: 25%;
    background-color: #FFFFFF;
    border-radius: 4px;
    display: flex;
    align-items: center;

    &:last-child {
      margin-right: 0;
    }

    .image {
      margin-right: 20px;
    }

    .boxRight {
      .value {
        font-size: 26px;
        font-weight: 500;
        color: #141414;
        margin-bottom: 20px;

        .unit {
          font-size: 18px;
          color: #9B9B9B;
          font-weight: 400;
        }
      }

      .title {
        font-size: 16px;
        font-weight: 400;
        color: #3D3D3D;
      }
    }
  }

}
</style>

