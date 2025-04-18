//查询Token
import {getStorageItem, setStorageItem} from "@/utils/storage.ts"



function formatDate() {
    const date = new Date();

    // 日期时间部分
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    // 时区偏移部分
    const tzOffset = date.getTimezoneOffset();
    const sign = tzOffset <= 0 ? '+' : '-';
    const offsetHours = String(Math.floor(Math.abs(tzOffset) / 60)).padStart(2, '0');
    const offsetMinutes = String(Math.abs(tzOffset) % 60).padStart(2, '0');

    return `${year}-${month}-${day}T${hour}:${minute}:${second}${sign}${offsetHours}:${offsetMinutes}`;
}

function formatParams(params: any) {
    if (Object.keys(params).length === 0) {
        return ''
    }

    const result = Object.keys(params).map((key) => {
        const value = params[key]
        return `${key}=${value}`
    })

    return `?${result.join('&')}`
}

const commonHeader = {
    "Host":                        "api.xiaoyuzhoufm.com",
    "User-Agent":                  "Xiaoyuzhou/2.57.1 (build:1576; iOS 17.4.1)",
    "Market":                      "AppStore",
    "App-BuildNo":                 "1576",
    "OS":                          "ios",
    "Manufacturer":                "Apple",
    "BundleID":                    "app.podcast.cosmos",
    "Connection":                  "keep-alive",
    "abtest-info":                 "{\"old_user_discovery_feed\":\"enable\"}",
    "Accept-Language":             "zh-Hans-CN;q=1.0, zh-Hant-TW;q=0.9",
    "Model":                       "iPhone14,2",
    "app-permissions":             "4",
    "Accept":                      "*/*",
    "Content-Type":                "application/json",
    "App-Version":                 "2.57.1",
    "WifiConnected":               "true",
    "OS-Version":                  "17.4.1",
    "x-custom-xiaoyuzhou-app-dev": "",
    "Timezone":                    "Asia/Shanghai",
    "x-jike-device-id":            "",
    "x-jike-device-properties":    ""
}

function rGet(url: string, params: any = {}) {
    const paramsResult = formatParams(params)
    const urlResult = `${url}${paramsResult}`
    const XJikeAccessToken = getStorageItem('XJikeAccessToken', '')
    const XJikeRefreshToken = getStorageItem('XJikeRefreshToken', '')

    if (XJikeAccessToken && XJikeRefreshToken) {
        return fetch(urlResult, {
            method: 'GET',
            headers: {
                ...commonHeader,
                'Local-Time': formatDate(),
                'x-jike-access-token': XJikeAccessToken,
            },
        }).then((resp) => {
            if (resp.ok) {
                return resp.json()
            }else {
                return Promise.reject({
                    status: resp.status,
                    statusText: resp.statusText
                })
            }
        })
    }

    return Promise.reject()
}

function rPost(url: string, data: any = {}, canNoToken = false, getTokenHeader = false) {
    const XJikeAccessToken = getStorageItem('XJikeAccessToken', '')
    const XJikeRefreshToken = getStorageItem('XJikeRefreshToken', '')

    if ((XJikeAccessToken && XJikeRefreshToken) || canNoToken) {
        return fetch(url, {
            method: 'POST',
            headers: {
                ...commonHeader,
                'Local-Time': formatDate(),
                'x-jike-access-token': XJikeAccessToken,
            },
            body: JSON.stringify(data),
        }).then((resp) => {
            if (resp.ok) {
                if (getTokenHeader) {
                    const accessToken: string = resp.headers.get('x-jike-access-token') || ''
                    const refreshToken: string = resp.headers.get('x-jike-refresh-token') || ''
                    setStorageItem('XJikeAccessToken', accessToken)
                    setStorageItem('XJikeRefreshToken', refreshToken)
                }
                return resp.json()
            }else {
                return Promise.reject({
                    status: resp.status,
                    statusText: resp.statusText
                })
            }
        })
    }

    return Promise.reject()
}

//刷新Token
function refreshToken() {
    const XJikeAccessToken = getStorageItem('XJikeAccessToken', '')
    const XJikeRefreshToken = getStorageItem('XJikeRefreshToken', '')
    return fetch('/api/app_auth_tokens.refresh', {
        method: 'POST',
        headers: {
            ...commonHeader,
            'x-jike-access-token': XJikeAccessToken,
            'x-jike-refresh-token': XJikeRefreshToken,
        }
    }).then((resp) => {
        const accessToken: string = resp.headers.get('x-jike-access-token') || ''
        const refreshToken: string = resp.headers.get('x-jike-refresh-token') || ''
        setStorageItem('XJikeAccessToken', accessToken)
        setStorageItem('XJikeRefreshToken', refreshToken)
        return resp.json()
    }).catch((err) => console.error(err))
}

function reCallOn401(func: any, params?: any) {
    setStorageItem('XJikeAccessToken', '')
    refreshToken().then(() => {
        const XJikeAccessToken = getStorageItem('XJikeAccessToken', '')
        if (XJikeAccessToken) {
            func.call(null, params)
        }
    })
}

export { rGet, rPost, reCallOn401 }
