const env = "development" //开发环境的配置，有：production（生成版）、development（开发版）

//const develop = 'https://0344a5dd.ngrok.io'
const develop = 'https://api-dev.lueek.com'
const production = 'https://www.gezispace.com'

// const ossUrl = 'https://community-v.oss-cn-beijing.aliyuncs.com'
// const ossUrlCDN = 'https://v.lueek.com'
let h5Url = null
if (env === 'production') {
  h5Url = production
} else if (env === 'development') {
  h5Url = develop
} else {
  h5Url = develop
}
export {h5Url, env }