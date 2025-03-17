import { rGet, rPost} from "./request.ts"


//发送验证码
interface ISMSCodeParams {
    mobilePhoneNumber: string
    areaCode: string
}

export function apiSendSMSCode(data: ISMSCodeParams) {
    return rPost('/api/v1/auth/sendCode', data)
}


//登录
interface ILoginParams {
    areaCode: string
    verifyCode: string
    mobilePhoneNumber: string
}

export function apiLogin(data: ILoginParams) {
    return rPost('/api/v1/auth/loginOrSignUpWithSMS', data)
}

//---------------------------------以下需要Token-------------------------------------------

//订阅列表
interface ISubscribeListParams {
    uid?: string
    loadMoreKey?: {
        id: string
        subscribeAt: string
    }
}

export function apiGetSubscription(data: ISubscribeListParams) {
    const postData = {
        ...data,
        list: '20',
        sortOrder: 'desc',
        sortBy: 'subscribeAt',
    }
    return rPost('/api/v1/subscription/list', postData)
}


//更新订阅列表
interface IUpdateSubscribeListParams {
    pid: string
    mode: string  // "ON" "OFF"
}

export function apiUpdateSubscription(data: IUpdateSubscribeListParams) {
    return rPost('/api/v1/subscription/update', data)
}

//获取星标订阅列表
export function apiGetStarSubscription() {
    return rPost('/api/v1/subscription-star/list')
}

//未加星标订阅列表
export function apiGetNoStarSubscription() {
    return rPost('/api/v1/subscription/list-non-starred')
}


//更新星标订阅
interface IUpdateStarSubscriptionParams {
    pid: string
    withStar: boolean
}

export function apiUpdateStarSubscription(data: IUpdateStarSubscriptionParams) {
    return rPost('/api/v1/subscription-star/update', data)
}


//搜索
interface ISearchParams {
    pid: string
    type: string
    keyword: string
    loadMoreKey?: {
        loadMoreKey: number
        searchId: string
    }
}

export function apiSearch(data: ISearchParams) {
    const searchData = {
        ...data,
        limit: '20',
        sourcePageName: '4',
        currentPageName: '4',
    }

    return rPost('/api/v1/search/create', searchData)
}


//可能想搜索的
export function apiGetSearchPreset() {
    return rGet('/api/v1/search/get-preset')
}


//节目列表
interface IEpisodeParams {
    pid: string
    order: string //desc asc
    loadMoreKey?: {
        pubDate: string
        id: string
        direction: string
    }
}

export function apiEpisodeList(data: IEpisodeParams) {
    const queryData = {
        ...data,
        limit: '20'
    }

    return rPost('/api/v1/episode/list', queryData)
}


//播客内最受欢迎单集列表
interface IEpisodePopularParams {
    pid: string
}

export function apiEpisodePopular(data: IEpisodePopularParams) {
    const queryData = {
        ...data,
        label: 'POPULAR'
    }
    return rPost('/api/v1/episode/list-by-filter', queryData)
}


//查询单集详情
export function apiEpisodeDetail(params: {eid: string}) {
    return rGet('/api/episode/get', params)
}


//查询播客详情
export function apiPodcastDetail(params: {pid: string}) {
    return rGet('/api/v1/podcast/get', params)
}


//获取播客主体信息
export function apiPodcastGetInfo(params: {pid: string}) {
    return rGet('/api/v1/podcast/get-info', params)
}


//获取播客荣誉墙
export function apiPodcastHonorList(data: {pid: string}) {
    return rPost('/api/v1/podcast-honor/list', data)
}

//相关播客推荐
export function apiRelatedPodcastList(data: {pid: string}) {
    const queryData = {
        ...data,
        position: "BOTTOM"
    }

    return rPost('/api/v1/related-podcast/list', queryData)
}

//获取播客公告
export function apiPodcastBulletin(data: {pid: string}) {
    return rGet('/api/v1/podcast-bulletin/get-by-pid', data)
}

//查询当前用户信息
export function apiGetUserInfo() {
    return rGet('/api/v1/profile/get')
}

//查询用户已经获取到的贴纸
export function apiGetUserStickerList(data: {uid: string}) {
    return rPost('/api/v1/sticker/list', data)
}

//查询用户贴纸墙
export function apiGetUserSticker(data: {uid: string}) {
    return rPost('/api/v1/sticker/get-board', data)
}

//查询单集播放进度
interface IPlaybackProgressParams {
    eids: string[]
}

export function apiPlaybackProgress(data: IPlaybackProgressParams) {
    return rPost('/api/v1/playback-progress/list', data)
}


//更新单集播放进度
interface IUpdatePlaybackProgressParams {
    data: {
       pid: string
       eid: string
       progress: number
       playedAt: string
    }[]
}


export function apiUpdatePlaybackProgress(data: IUpdatePlaybackProgressParams) {
    return rPost('/api/v1/playback-progress/update', data)
}
