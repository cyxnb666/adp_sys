import axios from 'axios'

const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000 // request timeout
})



// request interceptor
service.interceptors.request.use(
  config => {
    config.headers['adp-token'] = 
    `eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDQ0MDY2OTEsInVzZXJJZCI6ImhlYmFvIiwiYXV0aG9yaXRpZXMiOlt7InJvbGVJZCI6IlJPTEVfU1lTVEVNX01BTkFHRVIiLCJyb2xlTmFtZSI6bnVsbCwiYXV0aG9yaXR5IjoiUk9MRV9TWVNURU1fTUFOQUdFUiJ9LHsicm9sZUlkIjoiUk9MRV9PUkdBTklaQVRJT04iLCJyb2xlTmFtZSI6bnVsbCwiYXV0aG9yaXR5IjoiUk9MRV9PUkdBTklaQVRJT04ifSx7InJvbGVJZCI6IlJPTEVfUlVMRV9TRVRURVIiLCJyb2xlTmFtZSI6bnVsbCwiYXV0aG9yaXR5IjoiUk9MRV9SVUxFX1NFVFRFUiJ9LHsicm9sZUlkIjoiUk9MRV9SVUxFX01BTkFHRVIiLCJyb2xlTmFtZSI6bnVsbCwiYXV0aG9yaXR5IjoiUk9MRV9SVUxFX01BTkFHRVIifV19.LGdwR6-mZo1AhIfMgpFdrgGyeZffsGDx-wjUzit1CzE`
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
)

export default service
