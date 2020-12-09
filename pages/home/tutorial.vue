<template>
  <view class="tutorial-wrap">

    <view>1.登录12306网站</view>
    <image src="/static/images/1.jpg"></image>
    <view>2.进入查询订单页面</view>
    <image src="/static/images/2.jpg"></image>
    <view>3.mac电脑按fn+F12(windows按F12)打开控制台,点击控制台的Network->XHR->复制Cookie内容</view>
    <image src="/static/images/3.jpg"></image>

  </view>
</template>
<script>
export default {
  name: "tutorial",
  data () {
    return {
    };
  }
}
</script>
<style lang="less" scoped>
.tutorial-wrap {
  uni-view {
    margin: 20rpx;
  }
}
</style>