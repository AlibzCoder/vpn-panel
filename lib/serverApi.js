import axios from 'axios';
const serverApi = (ip)=>{
    const baseURL = `http://${ip}:5000/`;
    const instance = axios.create({baseURL : baseURL});
    const refreshTokenApi = axios.create({baseURL : baseURL});
  
  
    const callRefresh = ()=>new Promise((resolve,reject)=>{
      let serverCredentials = localStorage.getItem(ip);
  
      if(serverCredentials){
        serverCredentials = JSON.parse(serverCredentials);
        const {Authorization,RefreshToken} = serverCredentials;
        let headers = {"authorization": Authorization,"refreshToken": RefreshToken}
        refreshTokenApi.post('/refreshToken', null, { "headers": headers }).then(res=>{
          serverCredentials["Authorization"] = res.data.Authorization;
          localStorage.setItem(ip,JSON.stringify(serverCredentials));
          resolve(res.data.Authorization)
        }).catch(err=>reject(err))
      }else{reject(null)}
    })
  
    
  
    const use_ = function(onFullfilled, onRejected) {
      instance.interceptors.response.use(
          // onFullfilled
          function(response) {
              try {
                  return onFullfilled(response);
              }
              catch(e) {
                  return onRejected(e);
              }
          },
          // onRejected
          onRejected,
      )
    }
    const interceptorConfig = (config)=>{
      let serverCredentials = localStorage.getItem(ip);
      if(serverCredentials){
        serverCredentials = JSON.parse(serverCredentials);
        const {Authorization,RefreshToken} = serverCredentials;
        config.headers["authorization"] = Authorization;
        config.headers["refreshToken"] = RefreshToken;
      }
      return config;
    };
    const interceptorCatchError = (error)=>{return Promise.reject(error);};
  
  
  
  
    let isRefreshing = false;
    let failedQueue = [];
    const processQueue = (error, token = null) => {
        failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        failedQueue = [];
    };
  
  
    const onResponse = (res)=>{
      return res;
    }
    const onError = (err)=>{
      if (err.response && err.response.status === 401) {
        const originalRequest = err.config;
        if(!originalRequest._retry){
          if (isRefreshing) {
            return new Promise(function(resolve, reject) {
                failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers['authorization'] = token;
              return axios(originalRequest);
            }).catch(err => {return Promise.reject(err);});
          }
          originalRequest._retry = true;
          isRefreshing = true;
  
          return new Promise(function(resolve, reject) {
            callRefresh().then(auth => {
              instance.defaults.headers.common['authorization'] = auth;
              originalRequest.headers['authorization'] = auth;
              processQueue(null, auth);
              resolve(instance(originalRequest));
            }).catch(err => {
              processQueue(err, null);
              document.dispatchEvent(new CustomEvent('CALL_LOGOUT'))
              reject(err);
            }).then(() => {isRefreshing = false;});
          });
        }
      }
      return Promise.reject(err);
    }
  
  
  
    instance.interceptors.response.use_ = use_;
    instance.interceptors.request.use(interceptorConfig,interceptorCatchError);
    instance.interceptors.response.use_(onResponse, onError);
  
  
    return instance;
}

export default serverApi;