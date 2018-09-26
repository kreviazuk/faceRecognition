/**
 * Created by dhj on 2018/5/21.
 */
export const env = (function () {
  if (process.env.NODE_ENV == 'development') {
    return {
      envName: 'development',
      root: 'https://10.154.2.51'
    };
  } else {
    return {
      envName: 'production',
      root: 'https://' + location.hostname
    }
  }
})()
