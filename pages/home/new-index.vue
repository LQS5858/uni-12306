<template>
  <view class="wrap">
    <view class="u-flex u-row-center img-wrap">
      <image class="header-img"
             mode="widthFix"
             src="/static/images/header.jpg"></image>
    </view>

    <view class="middle-wrap">
      <view class="cookie">
        <text class="required-text">*</text>
        <text style="margin-right:20rpx">Cookie</text>
        <view style="flex:1">
          <textarea class="textarea"
                    clearable
                    adjust-position
                    maxlength="800"
                    v-model.trim="form.cookie" />
          <button size="mini"
                  @click.stop="jumpTo"
                  style="margin-top:10rpx"
                  shape="circle"
                  type="primary">查看获取cookie教程</button>
        </view>
      </view>
      <view class="location-wrap">
        <view @click="showFromLocation=true"
              class="row">
          <text class="required-text">*</text>
          <text class="from-location">出发地</text>
          <input class="u-border select uni-input"
                 placeholder="深圳"
                 @input="form.fromLocation=form.fromLocation.replace(/\s*/g,'')"
                 v-model.trim="form.fromLocation" />

        </view>
        <view @click="showEndLocation=true"
              class="row">
          <text class="required-text">*</text>
          <text class="from-location">目的地</text>
          <input class="u-border select uni-input"
                 placeholder="祁阳北"
                 @input="form.toLocation=form.toLocation.replace(/\s*/g,'')"
                 v-model.trim="form.toLocation" />

        </view>
        <view class="date-wrap row">
          <text class="required-text">*</text>
          <text class="from-location">出发日期</text>
          <picker mode="date"
                  class="date uni-input"
                  :value="pickDate"
                  :start="startDate"
                  :end="endDate"
                  @change="bindDateChange">
            <view class="uni-input">{{form.curCalenda}}</view>
          </picker>
          <!-- <input class="date uni-input"
                 @blur="curCalendaBlur"
                 placeholder="格式:2020-12-30"
                 v-model.trim="form.curCalenda" /> -->
        </view>
        <view class="email date-wrap row">
          <!-- <text class="required-text">*</text> -->
          <text class="email">邮箱</text>
          <view style="flex:1">
            <input v-model.trim="email"
                   @input="email=email.replace(/\s*/g,'')"
                   class="date uni-input"
                   type="text" />
            <text class="email-tip">邮箱用于接收下单成功后发送提示信息</text>
          </view>
        </view>
        <view class="bottom date-wrap row">
          <text class="no">购买车次</text>
          <input v-model.trim="train_no"
                 type="text"
                 placeholder="车次"
                 class="date uni-input" />
        </view>
        <view class="bottom date-wrap row">
          <text class="no">定时抢票下单时间</text>
          <picker mode="date"
                  :value="orderDate"
                  :start="startDate"
                  :end="endDate"
                  style="flex:3"
                  class="date uni-input"
                  @change="bindOrderDateChange">
            <view class="uni-input">{{showDate}}</view>
          </picker>
          <view>-</view>
          <picker mode="time"
                  style="flex:1"
                  class="date uni-input"
                  :value="time"
                  start="00:00"
                  end="23:59"
                  @change="bindOrderTimeChange">
            <view class="uni-input">{{time}}</view>
          </picker>
          <!-- <input type="text"
                 placeholder="2020-12-30 13:58"
                 class="date uni-input"
                 v-model.trim="date"> -->
        </view>
      </view>

      <view class="tiket-list">
        <text class="required-text">*</text>
        <text>乘客信息</text>
        <template v-if="passengerList&&passengerList.length">
          <radio-group @change="radioChange"
                       class="uni-radio-group">
            <label class="uni-list-cell uni-list-cell-pd"
                   v-for="(item, index) in passengerList"
                   :key="index">
              <view>
                <radio :value="String(index)"
                       :checked="(item&&item.index_id)===(passengerInfo&&passengerInfo.index_id)" />
              </view>
              <view>{{item.passenger_name}}</view>
            </label>
          </radio-group>
          <!-- <radio-group v-model="passenger">
            <radio v-for="(item, index) in passengerList"
                   :key="index"
                   :name="item.passenger_name">
              {{item.passenger_name}}
            </radio>
          </radio-group> -->
        </template>
        <template v-else>
          <view style="margin-top:30rpx;text-align:center">暂无数据</view>
        </template>

      </view>
      <view class="footer-btn">
        <button type="primary"
                :disabled="ticketBtnDisable"
                @click="openTicker">开始抢票</button>
      </view>
    </view>
    <view class="tiket-list">
      <text class="header">车次列表(说明:没有输入车次的话默认自动抢票订单列表第一个订单)</text>
      <view>
        <scroll-view :scroll-top="scrollTop"
                     scroll-y="true"
                     class="scroll-Y">
          <view class="table-header">
            <text>车次</text>
            <text>商务座</text>
            <text>一等座</text>
            <text>二等座</text>
          </view>
          <view v-for="(item,key) in ticketList"
                :key="key"
                class="table-header">
            <text>{{item.trainNo}}</text>
            <text>{{item.swz}}</text>
            <text>{{item.ydz}}</text>
            <text>{{item.edz}}</text>

          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>
<script>
import _ from 'lodash'
import Station from 'config/station.json'
import moment from 'moment'
import { ua } from 'config/ua'
function getDate (type) {
  const date = new Date();

  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (type === 'start') {
    year = year - 10;
  } else if (type === 'end') {
    year = year + 10;
  }
  month = month > 9 ? month : '0' + month;;
  day = day > 9 ? day : '0' + day;

  return `${year}-${month}-${day}`;
}
export default {
  name: "home",
  data () {
    return {
      scrollTop: 0,
      time: '',
      showDate: '',
      ticketBtnDisable: false,
      showFromLocation: false,
      showCalendar: false,
      passengerInfo: {},
      startDate: getDate('start'),
      endDate: getDate('end'),
      passengerList: [],
      email: null,
      pickDate: getDate({
        format: true
      }),
      orderDate: getDate({
        format: true
      }),
      form: {
        cookie: null,
        fromLocation: null,
        toLocation: null,
        curCalenda: null
      },
      showEndLocation: false,
      fromLocation: null,
      toLocation: null,
      train_no: null,
      flag: false,
      date: null,
      info: {
        lunar: true,
        range: true,
        insert: false,
        selected: []
      },
      dateFormat: {
        year: true,
        month: true,
        day: true,
        hour: false,
        minute: false,
      },
      orderTimeFormat: {
        year: true,
        month: true,
        day: true,
        hour: true,
        minute: true,
      },
      curCalenda: null,
      ticketList: [],
      locationList: Station.stationInfo
    };
  },
  components: {},
  watch: {
    form: {
      deep: true,
      handler (val) {
        this.fetchTicket(val)
      }
    },

    'form.cookie': {
      async handler (val) {
        if (val) {
          this.passengerInfo = await this.fetchPassenger()
          console.log('---passenger--', this.passengerInfo);
          uni.setStorage({
            key: 'cookie',
            data: this.form.cookie,
            success: function () {
              console.log('success');
            }
          });
        }
      }
    }
  },
  computed: {
    locationListFormat () {
      const list = Object.values(this.locationList)
      const arr = _.map(list, item => {
        const { name: label, code: value } = item
        return {
          ...item,
          label,
          value
        }
      })
      const _arr = Object.freeze(arr)
      return _arr
    }
  },
  methods: {
    bindOrderTimeChange (e) {
      const { value } = e.detail || {}
      console.log('--time--', value);
      this.time = value
      this.date = `${this.showDate} ${value}`
    },
    bindOrderDateChange (e) {
      const { value } = e.detail || {}
      this.showDate = value
      this.date = this.time ? `${this.showDate} ${this.time}` : value
    },
    bindDateChange: function (e) {
      const { value } = e.detail || {}
      this.form.curCalenda = value
    },

    radioChange (v) {
      console.log('--v--', v);
      const { detail } = v || {}
      const { value } = detail || {}
      this.passengerInfo = this.passengerList[value]
      console.log('---passenger--', this.passengerInfo);
    },
    getResult () { },

    jumpTo () {
      uni.navigateTo({
        url: '/pages/home/tutorial'
      })
    },
    dateHandler (v) {
      //       day: "08"
      // hour: "13"
      // minute: "24"
      // month: "12"
      // year: "2020"
      console.log('--定时时间--', v);
      const { year, month, day, hour, minute } = v || {}
      this.date = `${year}-${month}-${day} ${hour}:${minute}`
    },
    getLocationCode (name) {
      const { value } = _.find(this.locationListFormat, item => item.label === name) || {}
      return value
    },
    async fetchTicket (val) {
      const { fromLocation, toLocation, curCalenda, cookie: token } = val || {}
      if (fromLocation && toLocation && curCalenda && token) {
        const from_station = this.getLocationCode(fromLocation)
        const to_station = this.getLocationCode(toLocation)
        if (!from_station || !toLocation) {
          uni.showToast({
            title: '没有您查询的站点,请核准站点重新查询!',
            duration: 5000
          })
          return
        }
        const _from_station = this.$utils.trim(from_station)
        const _to_station = this.$utils.trim(to_station)
        const train_date = this.$utils.trim(curCalenda)
        const query = `from_station=${_from_station}&to_station=${_to_station}&train_date=${train_date}&token=${token}`
        const res = await this.$http.get(`v3/query/ticket?${query}`).catch(err => {
          const { error, message } = err || {}
          uni.showToast({
            title: error || message,
            duration: 5000
          })
        })
        console.log('--res--', res);
        this.ticketList = res && res.map(item => {
          return this.formatTrainData(item)
        })
      }
    },
    calendarHandler (date) {
      console.log('--date--', date);
      const { year, month, day } = date || {}
      this.form.curCalenda = `${year}-${month}-${day} `
    },
    fromSelectHandler (v) {
      console.log('--select--', v);
      const [item] = v || []
      const { label } = item || {}
      this.form.fromLocation = label
    },
    toSelectHandler (v) {
      console.log('--select--', v);
      const [item] = v || []
      const { label } = item || {}
      this.form.toLocation = label
    },
    getSubmitParams (row) {
      const m = String(row[13]).split('')
      let t = m.slice(0, 4)
      t = t.join('')
      let _t = m.slice(4, 6)
      _t = _t.join('')
      let __t = m.slice(-2)
      __t = __t.join('')
      const train_date = `${t} -${_t} -${__t}`
      const back_train_date = moment().format('YYYY-MM-DD')
      const sk = decodeURIComponent(row[0])
      return {
        train_date,
        back_train_date,
        sk
      }
    },
    /**
       * 格式化车次数据
       */
    formatTrainData (data) {
      let ret = {}
      for (let i = 0; i < data.length; i++) {
        let row = data.split('|')
        const dateObj = this.getSubmitParams(row)
        ret = {
          trainNo: row[3], //车次
          trainNumber: row[2], //车票号
          startTime: row[8], //出发时间
          endTime: row[9], //到达时间
          fromStation: row[6], //出发站代号
          toStation: row[7], //到达站代号
          date: row[13], //出发日期
          canWebBuy: row[11], //是否能购买：Y 可以
          rw: row[23] ? row[23] : '无', //软卧
          rz: row[24] ? row[24] : '无', //软座
          yz: row[29] ? row[29] : '无',
          wz: row[26] ? row[26] : '无', //无座
          yw: row[28] ? row[28] : '无', //硬卧
          edz: row[30] ? row[30] : '无', //二等座
          ydz: row[31] ? row[31] : '无', //一等座
          swz: row[32] ? row[32] : '无', //商务座
          ...dateObj
        }
      }
      return ret
    },
    clearCookie () {
      uni.removeStorage({
        key: 'cookie',
        success: function (res) {
          console.log('success');
        }
      });
      this.form.cookie = null
    },
    async fetchPassenger () {
      const { cookie } = this.form || {}
      const params = {
        data: {
          token: cookie
        }
      }
      const res = await this.$http.post('v3/passenger/findPage', params).catch(err => {
        const { error, message } = err || {}
        this.clearCookie()
        uni.showToast({
          title: error || '获取乘客信息失败！',
          duration: 5000
        })
      })
      console.log('--乘客信息--', res);
      const { normal_passengers } = res || {}
      const info = normal_passengers && normal_passengers[0]
      this.passengerList = normal_passengers || []
      return info
    },
    async submitTicket () {
      /**
      * 出发日期train_date
      * 出发站from_station
      * 目的站to_station
      * cookie
      * 定时执行时间 date  YYYY-MM-DD HH:MM
      * 车次号train_no
      */
      const { curCalenda: train_date, fromLocation, toLocation, cookie: token } = this.form || {}
      const from_station = this.getLocationCode(fromLocation)
      const to_station = this.getLocationCode(toLocation)
      const _from_station = this.$utils.trim(from_station)
      const _to_station = this.$utils.trim(to_station)
      const _train_date = this.$utils.trim(train_date)
      if (!from_station || !to_station) {
        uni.showToast({
          title: '没有您查询的站点,请核查站点后重新查询',
          duration: 5000
        })
        return
      }
      const params = {
        data: {
          train_date: _train_date,
          from_station: _from_station,
          to_station: _to_station,
          token,
          scheduleDate: this.date,
          email: this.email,
          train_no: this.train_no,
          passengerInfo: this.passengerInfo
        }
      }
      console.log('---parasm-data--', params.data);
      this.$http.post('v3/ticket/submit', params).then(() => {
        uni.showToast({
          title: this.date ? '已提交预定时间抢票,到达预定时间后会自动执行抢票!' : '抢票成功,请登录12306查看',
          duration: 5000
        })
        const id = setTimeout(() => {
          this.ticketBtnDisable = false
          clearTimeout(id)
        }, 5000);
      }).catch(err => {
        this.ticketBtnDisable = false
        const { error, message } = err || {}
        uni.showToast({
          title: error || message,
          duration: 5000
        })
      })
    },
    async setCookie (option) {
      const { cookie } = option || {}
      const _cookie = decodeURIComponent(cookie)
      this.$set(this.form, 'cookie', _cookie)
      console.log('--接受cookie--', option, _cookie, this.form.cookie);

    },
    async openTicker () {
      const { cookie, fromLocation, toLocation, curCalenda, } = this.form || {}
      if (!cookie || !fromLocation || !toLocation || !curCalenda || _.isEmpty(this.passengerInfo)) {
        uni.showToast({
          title: '带*项为必填项',
          duration: 5000
        })
        return
      }
      const params = {
        data: {
          token: cookie,
        }
      }
      console.log('--params--', params);
      this.ticketBtnDisable = true
      const res = await this.$http.post('v3/member/checkUser', params).catch(err => {
        const { error, message } = err || {}
        this.clearCookie()
        uni.showToast({
          title: '未登录或登录已失效!',
          duration: 5000
        })
        return
      })
      console.log('--定时下单时间--', this.date);
      this.submitTicket()
    },
    initCookie () {
      uni.getStorage({
        key: 'cookie',
        success: (res) => {
          console.log(res.data);
          const { data } = res || {}
          this.form.cookie = data
        }
      })
    }
  },
  onShow () {
    this.initCookie()
  },
  onLoad (options) {
    this.setCookie(options)
  }
}
</script>
<style lang="less" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  //   height: 100vh;
  color: #ececf5;
  background: #0a122d;
  .required-text {
    color: red;
    padding-right: 5px;
  }
  /deep/ .uni-input-input {
    color: #ececf5;
  }
  .email {
    .email {
      padding-right: 40rpx;
    }
    .email-tip {
      font-size: 8px;
      color: red;
    }
  }
  .middle-wrap {
    background: #0d183b;
    width: 90%;
    margin: 20rpx 0;
    .bottom {
      padding-bottom: 40rpx;
      .no {
        padding-right: 40rpx;
      }
    }
  }
  .img-wrap {
    width: 90%;
    background: #0d183b;
  }
  & > uni-view {
    width: 100%;
    padding: 0 40rpx;
  }
  .footer-btn {
    margin: 20rpx 0;
    .ticket-btn {
      background: #409eff;
      color: #fff;
    }
  }
  .down-icon {
    right: 5rpx;
    /deep/.u-icon__icon {
      color: #ececf5 !important;
    }
  }
  .tiket-list {
    background: #0d183b;
    min-height: 300rpx;
    margin-bottom: 20rpx;
    width: 90%;
    /deep/.uni-radio-input {
      width: 20rpx;
      height: 20rpx;
    }
    /deep/.uni-radio-group {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
    /deep/.uni-list-cell {
      display: flex;
      align-items: center;
      padding-right: 40rpx;
    }
    /deep/ .u-radio__label {
      color: #ececf5;
    }
    .table-header {
      display: flex;
      justify-content: space-between;
    }
  }
  .date-wrap {
    .date {
      height: 70rpx;
      // width: 100%;
      line-height: 70rpx;
      border: 1px solid;
    }
  }
  .location-wrap {
    .row {
      padding-bottom: 40rpx;
      display: flex;
      align-items: center;
      .uni-input {
        flex: 1;
      }
    }
    .from-location {
      padding-right: 30rpx;
    }
    .select {
      height: 70rpx;
      line-height: 70rpx;
      border: 1px solid;
      flex: 1;
    }
  }
  .cookie {
    display: flex;
    align-items: center;
    margin-top: 20rpx;
    padding-bottom: 40rpx;
    // .cookie-input {
    //   width: 100%;
    //   .room {
    //     text-align: right;
    //   }
    // }
    .textarea {
      height: 200rpx;
      flex: 1;
      width: 100%;
      border: 1px solid;
      /deep/.uni-textarea-textarea {
        color: #ececf5;
      }
    }
    .cookie-placeholder {
      padding-left: 10rpx;
    }
    .cookie-input {
      height: 35px;
      background: #0b1533;
      padding-left: 10rpx;
      border-radius: 25px;
      width: 100%;
      margin-left: 10rpx;
      border: 1px solid #1a2445;
      div {
        padding-left: 10rpx;
      }
    }
  }
  .header-img {
    width: 100%;
    height: 60px;
    padding: 20rpx 0;
  }
}
</style>