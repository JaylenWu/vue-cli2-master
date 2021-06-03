import axios from "axios";

const token = "eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2Iiwia2lkIjpudWxsLCJjdHkiOiJKV1QifQ..01S_-w7FfEppogVTh-r2eg.aTUBgfsVklgjHZUzBsZ19wZMqqyQB4HAABYx7gXnauevyqrg7OG9mHvITD6vLYE1-K5fFScy1BDZm4wku3gkmNU4It66VjCjf14RopnYM08iXE-uQS7RfKCFT0mzlUTGMFE7OIpWAJ5PFC8TlLdGlppE7-gyK8BQOfGzMG7Xyy_BPvfbaJwz4xqck4cRXo2q2m6XKBtwB4Tx-ypOSpeg8i-MvC_MC6aXHvgkAqfVa9G5Mf-wSjw3sTEz4FO00b3aaKBSVN1uhJyS_JFRxw-H5T1IDEdEyGGgM9GmvUU-NN-PQf_8ftkSwRafH-TlQGW0KVLvLUxD_Y_7i-goFrPRAhQFs9oXFoMeMOv2dEeSeITW_AcjCQdkAsTM_3me1QcwaPRhbz4DTyt9a4GCGgeqzh5SJfS-cLhJzIU5FA6Zi9u863m2b3MIOPTqddH7ps4SNTL7rNzDhrR0K79Z25xeOSeVAjo93evssE37-aID3-STrKIpUNcPmgwhkZJMGCQ8j5_iWHEy_pNJlOSP5W2YtzkrWOrQGdATjPksC5YofMX7q79idYOQt9rorBjP0qhDMTibt_WJJgoFNBWrrVoh-OxyyQXob3-R5R8YNQWlqkc.Kqu5ERxgTeXya6YoZxKHFw";

const HTTP = axios.create({
    baseURL: "https://api-stg.jushipinlei.com/daishu-api", // 基础api
    timeout: 5000,
    headers: { "x-auth-token": token }
})

let pendingAjax = []; // 请求队列
const fastClickMsg = '数据请求中，请稍后';
const CancelToken = axios.CancelToken;
const removePendingAjax = (url, type) => {
    const index = pendingAjax.findIndex(i => i.url === url)
    if (index > -1) {
        type === 'req' && pendingAjax[index].c(fastClickMsg)
        pendingAjax.splice(index, 1)
    }
}

HTTP.interceptors.request.use(config => {
    const url = config.url
    removePendingAjax(url, 'req');
    config.cancelToken = new CancelToken(c => {
        pendingAjax.push({
            url,
            c
        })
    })
    return config;
}, error => {
    console.log(error);
    return Promise.reject(error);
})

HTTP.interceptors.response.use(response => {
    removePendingAjax(response.config.url, 'resp'); // 请求响应之后移除该请求
    const { data, status } = response;
    return data;
}, error => {
    console.log(error);
    return Promise.reject(error);
})


export default HTTP;
