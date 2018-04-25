<template>
  <div id="app">
    <vheader :seller="seller"></vheader>
    <div class="tab border-1px">
      <div v-for="item of tabItem" class="tab-item">
        <router-link :to="item.link">{{item.name}}</router-link>
      </div>
    </div>
    <router-view :seller="seller" keep-alive></router-view>
  </div>
</template>
<script>

import vheader from '@/components/common/header/header.vue'
import vfooter from '@/components/common/footer/footer.vue'

const ERR_OK = 0;

let tabItem = [
                {name:'商品',link:'/goods'},
                {name:'评论',link:'/ratings'},
                {name:'商家',link:'/seller'}
              ]

export default {
  name: 'app',
  components:{
    vheader,
    vfooter
  },
  created(){
      this.getSeller();
  },
  methods:{
     getSeller(){
        this.$http.get('/api/seller').then((res)=>{
          res = res.data;
          if(res.errno === ERR_OK){
            this.seller = res.data;
          }
        },(res)=>{
          console.log('出错了')
        })
     }
  },
  data(){
    return {
      tabItem,
      seller:{}
    }
  }
}
</script>

<style lang="scss">
@import './assets/css/mixin.scss';

  #app{
    .tab{
      width: 100%;
      display: flex;
      height: 40px;
      line-height: 40px;
      @include bottom-1px(rgba(7,17,27,.1));
      .tab-item{
        flex: 1;
        text-align: center;
        a{
          display:block;
          font-size:14px;
          color:rgb(77,85,93);
          &.active{
            color:rgb(240,20,20)
          }
        }
      }
    }
  }
</style>
