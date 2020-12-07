<template>
  <view class="content">
    <image class="logo"
           src="/static/logo.png"></image>
    <view class="text-area">
      <view class="title">{{title}}</view>
      <input type="text"
             v-model="username"
             placeholder="用户名" />
      <input type="text"
             v-model="password"
             placeholder="密码"
             password />
      <image :src="`data:image/png;base64,${base64}`"></image>
      <button @click='onButtonClick'>登录</button>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      title: '登录页面',
      username: '',
      password: '',
      base64: null
    }
  },
  onLoad () {
  },
  methods: {

    async onButtonClick () {
      const { username, password } = this
      const res = await uniCloud.callFunction({
        name: "login",
        data: {
          username,
          password
        }
      })
      console.log('--结果--', res)
    }
  }
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
input {
  display: block;
  border-bottom: 1px solid #f4f4f4;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>