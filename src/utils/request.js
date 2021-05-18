import axios from "axios";
import { getToken } from "@/utils/auth";


// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 3000000 // request timeout
});

// request interceptor
service.interceptors.request.use(
    config => {
        // do something before request is sent

        if (store.getters.token) {
            // let each request carry token
            // ['X-Token'] is a custom headers key
            // please modify it according to the actual situation
            config.headers["x-auth-token"] = getToken();
        }
        return config;
    },
    error => {
        // do something with request error
        console.log(error); // for debug
        return Promise.reject(error);
    }
);

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
    response => {
        const { data: res, config } = response;
        const { baseURL, url } = config;
        const { message } = res;
        const code = Number(res.code);

        console.log(`Request ${url.replace(baseURL, "")}`, res);

        // if the custom code is not 20000, it is judged as an error.
        if (code !== 200) {
            
            Message({
                message: message || "Error",
                type: "error",
                duration: 5 * 1000
            });

            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (code === 50008 || code === 50012 || code === 50014) {
                // to re-login
                MessageBox.confirm(
                    "You have been logged out, you can cancel to stay on this page, or log in again",
                    "Confirm logout",
                    {
                        confirmButtonText: "Re-Login",
                        cancelButtonText: "Cancel",
                        type: "warning"
                    }
                ).then(() => {
                    store.dispatch("user/resetToken").then(() => {
                        location.reload();
                    });
                });
            }

            return Promise.reject(new Error(message || "Error"));
        } else {
            return res;
        }
    },
    error => {
        
        console.error("err" + error); // for debug
        const { data, status, code, message } = error.response;

        switch (status) {
            case 401:
                store.dispatch("user/resetToken").then(() => {
                    location.reload();
                })
                break;
        }
        if(status === 401) {
            Message({
                message: "你已在其它设备登陆，请重新登陆",
                type: "error",
                duration: 2 * 1000
            });
        }
        return Promise.reject(error);
    }
);

export default service;
