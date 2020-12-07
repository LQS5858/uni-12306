
// const curEnv = process.env.NODE_ENV
const curEnv = 'production'

export const apiUrl = curEnv === 'development' ? 'https://wapi.bituan.pro' : 'https://wapi.bituan.pro'

const obj = {
    development: 'https://bituan-intranet.oss-cn-shenzhen.aliyuncs.com/manifest.json',
    production: 'https://bituan-client.oss-cn-shenzhen.aliyuncs.com/manifest.json'
}

export const manifestUrl = obj[curEnv]
