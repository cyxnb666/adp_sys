<template>
  <div class="system-dashboard app-container">
    <div class="title-style1 text-center">
      <i class="icon icon-1" />
      <h6>{{ $t('dashboard.express') }}</h6>
    </div>
    <el-row :gutter="30" type="flex" class="flex-row">
      <div v-if="getList.length">
        <el-col v-for="(item,index) in getList" :key="index" class="text-center mt-30" :span="6">
          <div class="grid-content thumb-wrapper bg-purple" @click="$router.push(item.path)">
            <div class="thumb-img">
              <img :src="item.thumb" alt="">
            </div>
            <h5>{{ item.title }}</h5>
          </div>
        </el-col>
      </div>
      <el-empty v-else style="width: 100%" :description="$t('dashboard.noExpress')" />
      <!-- <el-col :span="6">
        <div class="grid-content bg-purple-light">
          <h5>管理业务对象模型</h5>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <h5>管理中文业务对象模型</h5>
        </div>
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
import img1 from './1.png'
import img2 from './2.png'
import img4 from './4.png'
import img5 from './5.png'
import i18n from '@/languages/index'
export default {
  name: 'SystemDashboard',
  data() {
    return {
      defaultRoles: [
        'ROLE_RULE_MANAGER',
        'ROLE_SYSTEM_MANAGER'
      ],
      list: [
        { title: i18n.t('bomCreat.createObj'), thumb: img1, id: 1, path: '/bom/creat' },
        { title: i18n.t('dashboard.manaModel'), thumb: img2, id: 2, path: '/bom/manage' },
        { title: i18n.t('router.translatemanage'), thumb: img2, id: 3, path: '/bom/translatemanage' },
        { title: i18n.t('ruleManage.ruleManage'), thumb: img4, id: 4, path: '/rule/management' },
        { title: i18n.t('dashboard.createApp'), thumb: img5, id: 5, path: '/new-app/new' }
      ]
    }
  },
  computed: {
    getList() {
      if (this.$store.state.user.roles.includes('ROLE_RULE_MANAGER' || 'ROLE_SYSTEM_MANAGER')) {
        return this.list
      } else {
        return []
      }
    }
  },
  mounted() {
    console.log(this.$store.state.user.roles, 'roles')
  }
}
</script>

<style lang="scss">
.system-dashboard {
  padding-top: 60px;;
  .flex-row {
    flex-wrap: wrap;
    align-content:flex-start;
  }
  .thumb-wrapper {
    cursor: pointer;
    border: 1px solid #f2f6fc;
    background: #fff;
    border-radius: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 15px;
    transition: all 0.8s;
    h5 {
      font-weight: normal;
    }
    &:hover {
      border-color: #0079ff;
      h5 {
        color: #0079ff;
      }
    }
    .thumb-img {
      max-width: 100%;
      margin: 0 auto;
      img{
        max-width: 100%;
        border-radius: 30px;
      }
    }
    h5 {
      margin: 10px;
      margin-bottom: 0;
    }
  }
}
</style>
