let company = 'picc';
const config = {
  "dark_logo": {
    airong: '/images/dark_logo.png',
    suntest: '/images/sunshine1.png',
    zc: '/images/bxtx_logo_fff.png',
    byd: '/images/byd.png',
    picc: '/images/picc.png',
    funde: '/images/funde-logo.png'
  }[company],
  "title": {
    airong: '艾融科技',
    suntest: '阳光保险',
    zc: '保行天下',
    byd: '比亚迪保险',
    picc: '中国人民保险',
    funde: '富德生命人寿'
  }[company],
  "copyright": {
    airong: '©2025 艾融科技版权所有',
    suntest: '©2025 艾融科技版权所有',
    zc: '©2025 保行天下版本所有',
    byd: '©2025 艾融科技版权所有',
    picc: '©2025 保行天下版本所有',
    funde: '©2025 艾融科技版权所有'
  }[company],
  "logo": {
    airong: '/images/logo.svg',
    suntest: '/images/sunshine.png',
    zc: '/images/bxtx_logo.png',
    byd: '/images/byd.png',
    picc: '/images/picc.png',
    funde: '/images/funde-logo.png'
  }[company],
  "color_primary": "#0079FF",
  "color_sideBar": "#15315f",
  "locale": "zh",
  "lang": 'zh_CN',
  "baseUrlEnv": {
    "development": "http://demo-rule.zhixunchelian.com:12980/api", // 子渊本地人保环境
    "test": "http://192.168.0.206:8989", // 测试坏境
    "production": "/api"//生产环境
  },
  "customPages": [
  ]
}
