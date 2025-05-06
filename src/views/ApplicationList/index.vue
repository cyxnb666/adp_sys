<template>
  <div class="get-application-list">
    <div class="title flex-wrap justify-content-center">
      <div>
        <img src="./images/icon-title.png" alt="">
      </div>
      <div>
        <h1>{{ $t('applicationList.applicationList') }}</h1>
        <h3>DECISION  APPLICATION</h3>
      </div>
    </div>
    <div class="app-container text-center">
      <el-input v-if="applicationList.length > 6" v-model="searchText" class="search" :placeholder="$t('applicationList.enterAppNum')" />

      <el-carousel v-if="goodList.length > 0" :interval="10000" indicator-position="outside" height="500px">
        <el-carousel-item v-for="item in Math.ceil(goodList.length / 6)" :key="item">
          <el-row class="wrap" type="flex" justify="center" :gutter="10">
            <el-col
              v-for="(site) in goodList.slice((item - 1) * 6, item * 6)"
              :key="site.applicationId"
              :xs="24"
              :sm="12"
              :md="10"
              :lg="8"
              :xl="8"
              @click.native="handleApplication(site)"
            >

              <div class="grid-content bg-purple">
                <h4 class="ellipsis">{{ site.applicationName }}</h4>
                <h6>{{ $t('versionList.applicationId') }}:{{ site.applicationId }}</h6>
                <h6>{{ $t('applicationList.version') }}:{{ site.version ||'1.0.0' }}</h6>
              </div>

            </el-col>
          </el-row>
        </el-carousel-item>
      </el-carousel>

    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getApplicationList } from '@/api/mainPages/decision'
import { takeFirstRoute } from '@/router/permission'
import { filterAsyncRoutes } from '@/store/modules/permission'
export default {
  name: 'GetApplicationList',
  data() {
    return {
      // ApplicationList: [],
      searchText: '' // 搜索关键字
    }
  },
  computed: {
    ...mapGetters(['routes', 'applicationList']),
    goodList() {
      let val = []
      if (!this.searchText) {
        return this.applicationList
      }
      val = this.applicationList.filter(element => {
        return element.applicationName.toUpperCase().includes(this.searchText.toUpperCase()) || element.applicationId.toUpperCase().includes(this.searchText.toUpperCase())
      })
      return val
    }
  },
  created() {
     this.getApplicationList()
  },
  methods: {
    getApplicationList() {
      getApplicationList().then(res => {
        if (res.length === 0) {

          this.$message(this.$t('applicationList.noApp'))
          setTimeout(() => {
            this.$store.dispatch('permission/changeRoutes', 'system')
            this.$router.push(takeFirstRoute(filterAsyncRoutes(this.routes)))
          }, 3000)
        }
        this.ApplicationList = res
      })
        .catch(err => {
          window.console.log(err)
          this.$message(this.$t('applicationList.noApp'))
          setTimeout(() => {
            this.$store.dispatch('permission/changeRoutes', 'system')
            this.$router.push('/system-dashboard')
          }, 3000)
        })
    },
    handleApplication(application) {
      this.$store.dispatch('permission/changeRoutes', 'main')
      this.$store.dispatch('app/setApplication', application) // 把applicationId 存到vuex、cookies
      this.$store.dispatch('bom/SET_bomBaseInfo', application.bomBaseInfoId) // 把applicationId 存到vuex、cookies
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
.get-application-list {
  // display: flex;
  // align-items: center;
  // justify-content: center;
  background-image: url(./images/bg.png);
  background-size: 100% 100%;
  color: #fff;
  min-height: 100vh;

  .title {
    // position: absolute;
    text-align: center;
    margin-bottom: 100px;
    margin-top: 0;
    padding-top: 100px;
    img {
        width: 88px;
        margin-right: 15px;
      }
    h1 {
      font-size: 66px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      margin-top: 0;
      color: #29344F;
      margin-bottom: 18px;
      background: linear-gradient(0deg, #415A97 0%, #050B19 99.31640625%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0;

    }
    h3 {
      font-size: 32px;
      font-family: Arial;
      font-weight: normal;
      color: #2F52A3;
      margin-top: 18px;
    }
  }
  @media screen and (max-width: 300px) {
    .title {
      margin-bottom: 30px;
      padding-top: 30px;
    }
  }
  .grid-content {
    cursor: pointer;
    height: 200px;
    width: 360px;
    padding: 20px 30px;
    background-image: url(./images/bg-application.png);;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    border-radius: 16px;
    margin: 20px auto;
    transition: all .8s;
    &:hover {
      // position: absolute;
      // width: 415px;
      // height: 250px;
      background-image: url(./images/bg-application-active.png);;
      box-shadow: 0 0 30px #409eff;
      transform: translateY(-20px);
    }
    @media screen and (max-width: 375px) {
        width: 350px;
    }
  }
  .el-carousel__indicators--outside button {
    background-color: #3f64da;
    height: 5px;
    width: 50px;
  }
  .search {
    max-width: 500px;
    margin: 0 auto;
    margin-bottom: 30px;
    input {
      border: 0;
    }
  }
}
</style>
