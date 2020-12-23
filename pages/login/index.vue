<template>
  <view class="wrap">
    <view class="header-wrap width">
      <image class="header"
             src="/static/images/header.jpg"></image>
    </view>
    <view class="width">
      <view class="row">
        <text class="label">*</text>
        <input type="text"
               class="input"
               placeholder="用户名"
               v-model.trim="form.username">
      </view>
      <view class="row pwd">
        <text class="label">*</text>
        <input type="text"
               placeholder="密码"
               class="input"
               v-model.trim="form.password">
      </view>
      <view class="row">
        <text class="label">*</text>
        <input type="text"
               v-model.trim="code"
               class="input"
               placeholder="输入图片序列号如:136">
      </view>
    </view>
    <view class="width captcha-image-wrap">
      <image @click="activeImage"
             class="captcha-image"
             :src="`data:image/png;base64,${captcha}`"></image>
      <view class="refresh"
            @click="refreshHandler">刷新</view>
    </view>
    <view class="width">
      <button type="primary"
              @click.stop="login">登录</button>
    </view>
  </view>
</template>
<script>
const captchaPos = {
  "1": "40,40",
  "2": "120,40",
  "3": "180,40",
  "4": "250,40",
  "5": "40,100",
  "6": "120,100",
  "7": "180,100",
  "8": "250,100"
}
export default {
  name: "login",
  data () {
    return {
      form: {
        username: null,
        password: null,
        answer: null,
      },
      code: null,
      captcha: null,
      activedImagPos: { left: '', top: '' },
      anwserList: []
    };
  },
  methods: {
    async validateForm () {
      const flag = Object.values(this.form).every(item => item)
      return flag
    },
    async login () {
      const checkResult = await this.codeChange()
      if (!checkResult) return
      const validate = await this.validateForm()
      if (!validate) return uni.showToast({
        title: '带*为必填项',
        duration: 5000
      })

      const params = {
        data: {
          ...this.form,
          appid: 'otn'
        }
      }
      console.log('登录参数', params);
      const res = await this.$http.post('v3/member/login', params).catch(err => {
        const { error, message } = err || {}
        uni.showToast({
          title: error || message,
          duration: 5000
        })
      })
      if (res) {
        const result = res && res.join(';')
        const uriEncode = encodeURIComponent(result)
        console.log('---登录结果--', result, uriEncode);
        // uni.navigateTo({
        //   url: `/pages/home/new-index?cookie=${uriEncode}`
        // })
      }
    },
    async codeChange () {
      const arr = this.code && this.code.split('')
      console.log('---分割arr--', arr);
      if (!arr || !arr.length) return
      this.form.answer = arr.reduce((cache, item) => {
        const str = captchaPos[item]
        const codeStr = cache ? `${cache},${str}` : str
        return codeStr
      }, '')
      return await this.fetchCheckCaptcha(this.form.answer)
    },
    async fetchCheckCaptcha (captcha) {
      const params = {
        data: {
          login_site: 'E',
          rand: 'sjrand',
          answer: captcha
        }
      }
      console.log('---json--', params);
      const data = await this.$http.post('v3/member/checkCaptcha', params).catch(err => {
        const { error, message } = err || {}
        uni.showToast({
          title: error || message,
          duration: 5000
        })
      })
      return data
    },
    refreshHandler () {
      this.getImage()
    },
    activeImage (e) {
      const { detail } = e || {}
      console.log('--图片点击--', e.detail);
      const { x, y } = detail || {}
      const _y = y - 30
      this.anwserList.push(x + ',' + _y)
      const anwser = this.anwserList.join(',')
      this.$set(this.activedImagPos, 'left', `${x}rpx`)
      this.$set(this.activedImagPos, 'top', `${_y}rpx`)
    },
    async getImage () {
      this.captcha = await this.$http.get('v3/member/getCaptcha')
    }
  },
  onShow () {
    this.getImage()
  }
}
</script>
<style lang="less" scoped>
.wrap {
  background: #0a122d;
  height: 100vh;
  .label {
    color: #f56c6c;
    padding-right: 10rpx;
  }
  /deep/ .uni-input-input {
    color: #ececf5;
  }
  .pwd {
    padding: 30rpx 0;
  }
  .row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .input {
      flex: 1;
    }
  }
  .header-wrap {
    display: flex;
    justify-content: center;
    background: #0d183b;
    padding: 30rpx;
  }
  .width {
    width: 85%;
    margin: 30rpx auto 30rpx;
  }
  .captcha-image-wrap {
    position: relative;
    .actived {
      position: absolute;
      width: 54rpx;
      height: 44rpx;
    }
  }
  .refresh {
    position: absolute;
    right: 0;
    top: 10rpx;
  }
  .header {
    width: 120px;
    height: 100px;
  }
  /deep/.input {
    height: 40px;
    border: 1px solid #ececf5;
  }
}
</style>