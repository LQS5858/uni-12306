<template>
  <view class="wrap">
    <image class="header-img"
           src="~@/assets/images/header.jpg"></image>
    <view class="cookie">
      <text>Cookie</text>
      <input type="text"
             placeholder-class="cookie-placeholder"
             class="cookie-input"
             placeholder="填写cookie值"
             v-model.trim="cookie">
    </view>
    <view class="u-flex">
      <view class="u-flex location-wrap u-relative"
            @click="showFromLocation=true">
        <text class="from-location">出发地</text>
        <text class="u-border select">{{fromLocation}}</text>
        <u-select v-model="showFromLocation"
                  @confirm="fromSelectHandler"
                  :list="locationListFormat">
        </u-select>
        <u-icon name="arrow-down-fill"
                color="black"
                class="u-absolute down-icon"
                size="5"></u-icon>
      </view>
      <view class="u-flex location-wrap u-relative"
            @click="showEndLocation=true">
        <text class="from-location">目的地</text>
        <text class="u-border select">{{toLocation}}</text>
        <u-select v-model="showEndLocation"
                  @confirm="toSelectHandler"
                  :list="locationListFormat"></u-select>
        <u-icon name="arrow-down-fill"
                color="black"
                class="u-absolute down-icon"
                size="5"></u-icon>
      </view>
      <view class="u-flex date-wrap">
        <text>出发日期</text>
        <u-calendar v-model="showCalendar"
                    @change="calendarHandler"></u-calendar>
        <view class="u-flex u-relative"
              @click="showCalendar=true">
          <text class="u-border date">{{curCalenda}}</text>
          <u-icon name="arrow-down-fill"
                  color="black"
                  class="u-absolute down-icon"
                  size="5"></u-icon>
        </view>
      </view>

    </view>
    <view class="tiket-list">
      <text class="header">匹配订单列表(说明:默认自动抢票订单列表第一个订单)</text>
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
    <view class="footer-btn">
      <u-button type="success"
                @click="test">开始抢票</u-button>
    </view>
  </view>
</template>
<script>
import _ from 'lodash'
import Station from 'config/station.json'
import moment from 'moment'
import { ua } from 'config/ua'
export default {
  name: "home",
  data () {
    return {
      cookie: 'JSESSIONID=10511304EF9124A77CFCE66A45605653; tk=ghbJkLKbI7JIbBEgET52xxlSGd-LDKW_6ZwVGgubL1L0; BIGipServerotn=1675165962.50210.0000; BIGipServerpassport=786956554.50215.0000; route=c5c62a339e7744272a54643b3be5bf64; current_captcha_type=Z; BIGipServerportal=3168010506.16671.0000; _jc_save_wfdc_flag=dc; RAIL_EXPIRATION=1606893507134; RAIL_DEVICEID=qQiIRYLYepBY5vR1pi734t2yVNCuXPdnxLP7ta3srHwMvsEwnevZA6iOjdhfBAVd6RqFctCZojUX2my1YrMIMglX3IoqLrZ83F5QeKK3A092fXHU7u6_3ufTHP2zC9Q9DarH-8YAFEc8BXz5HIMH6NaW2D42iUez; _jc_save_showIns=true; _jc_save_fromStation=%u6DF1%u5733%2CSZQ; _jc_save_toStation=%u7941%u9633%u5317%2CQVQ; _jc_save_toDate=2020-12-02; uKey=a5b4d83dc650acb4ff695856c9e1d2c33f661c6803cac0f7e119299c8fb35bb9; _jc_save_fromDate=2020-12-03',
      scrollTop: 0,

      showFromLocation: false,
      showCalendar: false,
      showEndLocation: false,
      fromLocation: null,
      toLocation: null,
      curCalenda: null,
      ticketList: [],
      locationList: Station.stationInfo
    };
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
	async  test(){
		  const res= await uniCloud.callFunction({
			  name:'test',
			  data:{
				 
			  }
		  })
		  console.log('---用户--',res)
	  },
    calendarHandler (date) {
      const { result } = date || {}
      this.curCalenda = result
    },
    fromSelectHandler (v) {
      console.log('--select--', v);
      const [item] = v || []
      const { label } = item || {}
      this.fromLocation = label
    },
    toSelectHandler (v) {
      console.log('--select--', v);
      const [item] = v || []
      const { label } = item || {}
      this.toLocation = label
    },
    getSubmitParams (row) {
      const m = String(row[13]).split('')
      let t = m.slice(0, 4)
      t = t.join('')
      let _t = m.slice(4, 6)
      _t = _t.join('')
      let __t = m.slice(-2)
      __t = __t.join('')
      const train_date = `${t}-${_t}-${__t}`
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
    async fetchTicketConfirm (item) {
		const _self=this
      const { sk, train_date, back_train_date } = item || {}
      const user = await uniCloud.callFunction({
        name: 'query-ticket',
        data: {
          "url": "https://kyfw.12306.cn/otn/login/checkUser",
          "headers": {
            "Cookie": "JSESSIONID=1DC0C03838F6FCCE615F904AA0FC42DE; tk=MF5Adjyh8wWWNPCS60qCOD6NqvGEyYK50sTFYwmkL1L0; BIGipServerotn=1675165962.50210.0000; BIGipServerpassport=786956554.50215.0000; route=c5c62a339e7744272a54643b3be5bf64; current_captcha_type=Z; BIGipServerportal=3168010506.16671.0000; _jc_save_wfdc_flag=dc; RAIL_EXPIRATION=1606893507134; RAIL_DEVICEID=qQiIRYLYepBY5vR1pi734t2yVNCuXPdnxLP7ta3srHwMvsEwnevZA6iOjdhfBAVd6RqFctCZojUX2my1YrMIMglX3IoqLrZ83F5QeKK3A092fXHU7u6_3ufTHP2zC9Q9DarH-8YAFEc8BXz5HIMH6NaW2D42iUez; _jc_save_showIns=true; _jc_save_fromStation=%u6DF1%u5733%2CSZQ; _jc_save_toStation=%u7941%u9633%u5317%2CQVQ; _jc_save_toDate=2020-12-02; uKey=2f8bd57c5c87b749fa2037c0baf456796f5fac91f8530b4ce01b95df24f6ee40; _jc_save_fromDate=2020-12-03",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36"
          },
          "params": {
            "_json_att": null
          }
        }
      })
      console.log('--uuserr--', user);
      // method, url, headers, tranform, params
      const res = await uniCloud.callFunction({
        name: 'query-ticket',
        data: {
          url: 'https://kyfw.12306.cn/otn/leftTicket/submitOrderRequest',
          headers: {
            Cookie: _self.cookie,
            'User-Agent': ua
          },
          params: {
            secretStr: sk,
            train_date,
            back_train_date,
            tour_flag: 'dc',
            purpose_codes: 'ADULT',
            query_from_station_name: '深圳',
            query_to_station_name: '祁阳北'
          }
        }
      })
      const { result } = res || {}
      console.log('--submit--结果--', result);
      const { httpstatus } = result || {}
      if (httpstatus !== 200) {
        uni.showToast({
          title: '糟糕订单确认失败，得重来哟',
          duration: 3000
        })
        return
      }
      this.fetchInitDc()
    },
    async fetchInitDc () {
		const _self=this
      const res = await uniCloud.callFunction({
        name: 'query-ticket',
        data: {
          url: 'https://kyfw.12306.cn/otn/confirmPassenger/initDc',
          headers: {
            Cookie: _self.cookie,
            'User-Agent': ua
          }
        }
      })
      const { result } = res || {}
      console.log('---订单页面--init', result);
      const REPEAT_SUBMIT_TOKEN = this.extractVariable(result)

      console.log('---订单页面--init-token', REPEAT_SUBMIT_TOKEN);

      const passengerInfo = await uniCloud.callFunction({
        name: 'query-ticket',
        data: {
			url:'https://kyfw.12306.cn/otn/confirmPassenger/getPassengerDTOs',
          headers:{
			  Cookie: _self.cookie,
			  'User-Agent': ua
		  },
		  params:{
			  ...REPEAT_SUBMIT_TOKEN,
			  _json_att:null
		  }
        }
      })
      console.log('--乘客信息--', passengerInfo);
    },
    extractVariable (result) {
      const globalRepeatSubmitTokenRegx = /globalRepeatSubmitToken.*=.*/gi
      let REPEAT_SUBMIT_TOKEN = result.match(globalRepeatSubmitTokenRegx)[0]
      REPEAT_SUBMIT_TOKEN = REPEAT_SUBMIT_TOKEN && REPEAT_SUBMIT_TOKEN.split('=')[1]
      REPEAT_SUBMIT_TOKEN = REPEAT_SUBMIT_TOKEN && REPEAT_SUBMIT_TOKEN.replace(/\\/gi, '')
      REPEAT_SUBMIT_TOKEN = REPEAT_SUBMIT_TOKEN && REPEAT_SUBMIT_TOKEN.replace(/;/gi, '')
      REPEAT_SUBMIT_TOKEN = REPEAT_SUBMIT_TOKEN && REPEAT_SUBMIT_TOKEN.replace(/\s/gi, '')
      REPEAT_SUBMIT_TOKEN = REPEAT_SUBMIT_TOKEN && REPEAT_SUBMIT_TOKEN.replace(/\\/gi, '')
      REPEAT_SUBMIT_TOKEN = REPEAT_SUBMIT_TOKEN && REPEAT_SUBMIT_TOKEN.replace(/'/gi, '')
      return {
        REPEAT_SUBMIT_TOKEN
      }
    },
    async openTicker () {
		const _self=this
      const data = await uniCloud.callFunction({
        name: 'query-ticket',
        data: {
          url: 'https://kyfw.12306.cn/otn/leftTicket/query?leftTicketDTO.train_date=2020-12-03&leftTicketDTO.from_station=SZQ&leftTicketDTO.to_station=QVQ&purpose_codes=ADULT',
          headers: {
			  'User-Agent': ua,
            Cookie: _self.cookie
          },
        }
      })
      const { result } = data || {}
      console.log('---ticket--data---', result);
      const { httpstatus } = result || {}
      if (httpstatus !== 200) {
        uni.showToast({
          title: '糟糕,暂无订单,请切换站点或时间重新订票',
          duration: 3000
        })
        return
      }
      const { data: _data } = result || {}
      const { result: _result } = _data || {}
      this.ticketList = _result && _result.map(item => {
        return this.formatTrainData(item)
      })
      console.log('--tiket格式化--', this.ticketList)
      const [item] = this.ticketList || []
      this.fetchTicketConfirm(item)
    }
  }
}
</script>
<style lang="less" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  .footer-btn {
    margin-top: 20rpx;
  }
  .down-icon {
    right: 5rpx;
  }
  .tiket-list {
    .table-header {
      display: flex;
      justify-content: space-between;
    }
  }
  .date-wrap {
    .date {
      width: 100rpx;
      height: 30rpx;
    }
  }
  .location-wrap {
    .from-location {
      padding-right: 10rpx;
    }
    .select {
      height: 30rpx;
      width: 100rpx;
    }
  }
  .cookie {
    display: flex;
    align-items: center;
    margin-top: 20rpx;
    .cookie-placeholder {
      padding-left: 10rpx;
    }
    .cookie-input {
      height: 35px;
      background: #e9ecef;
      padding-left: 10rpx;
      border-radius: 25px;
      margin-left: 10rpx;
      border: 1px solid #cad1d7;
      div {
        padding-left: 10rpx;
      }
    }
  }
  .header-img {
    margin-top: 20rpx;
    width: 80px;
    height: 60px;
  }
}
</style>