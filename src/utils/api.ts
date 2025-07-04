import { rGet, rPost } from "./request.ts";

//发送验证码
interface ISMSCodeParams {
  mobilePhoneNumber: string;
  areaCode: string;
}

export function apiSendSMSCode(data: ISMSCodeParams) {
  return rPost("/api/v1/auth/sendCode", data, true);
}

//登录
interface ILoginParams {
  areaCode: string;
  verifyCode: string;
  mobilePhoneNumber: string;
}

export function apiLogin(data: ILoginParams) {
  return rPost("/api/v1/auth/loginOrSignUpWithSMS", data, true, true);
}

//---------------------------------以下需要Token-------------------------------------------

//订阅列表
interface ISubscribeListParams {
  uid?: string;
  loadMoreKey?: {
    id: string;
    subscribeAt: string;
  };
}

export function apiGetSubscription(data: ISubscribeListParams) {
  const postData = {
    ...data,
    limit: "100",
    sortOrder: "desc",
    sortBy: "subscribedAt",
  };
  return rPost("/api/v1/subscription/list", postData);
}

//更新订阅列表
interface IUpdateSubscribeListParams {
  pid: string;
  mode: string; // "ON" "OFF"
}

export function apiUpdateSubscription(data: IUpdateSubscribeListParams) {
  return rPost("/api/v1/subscription/update", data);
}

//获取星标订阅列表
export function apiGetStarSubscription() {
  return rPost("/api/v1/subscription-star/list");
}

//未加星标订阅列表
export function apiGetNoStarSubscription() {
  return rPost("/api/v1/subscription/list-non-starred");
}

//更新星标订阅
interface IUpdateStarSubscriptionParams {
  pid: string;
  withStar: boolean;
}

export function apiUpdateStarSubscription(data: IUpdateStarSubscriptionParams) {
  return rPost("/api/v1/subscription-star/update", data);
}

//搜索
interface ISearchParams {
  pid?: string;
  type: string;
  keyword: string;
  loadMoreKey?: {
    loadMoreKey: number;
    searchId: string;
  };
}

export function apiSearch(data: ISearchParams) {
  const searchData = {
    ...data,
    limit: "20",
    sourcePageName: "4",
    currentPageName: "4",
  };

  return rPost("/api/v1/search/create", searchData);
}

//可能想搜索的
export function apiGetSearchPreset() {
  return rGet("/api/v1/search/get-preset");
}

//节目列表
export interface IEpisodeParams {
  pid: string;
  order: string; //desc asc
  loadMoreKey?: {
    pubDate: string;
    id: string;
    direction: string;
  };
}

export function apiEpisodeList(data: IEpisodeParams) {
  const queryData = {
    ...data,
    limit: "20",
  };

  return rPost("/api/v1/episode/list", queryData);
}

//播客内最受欢迎单集列表
interface IEpisodePopularParams {
  pid: string;
}

export function apiEpisodePopular(data: IEpisodePopularParams) {
  const queryData = {
    ...data,
    label: "POPULAR",
  };
  return rPost("/api/v1/episode/list-by-filter", queryData);
}

//查询单集详情
export function apiEpisodeDetail(params: { eid: string }) {
  return rGet("/api/v1/episode/get", params);
}

//查询播客详情
export function apiPodcastDetail(params: { pid: string }) {
  return rGet("/api/v1/podcast/get", params);
}

//获取播客主体信息
export function apiPodcastGetInfo(params: { pid: string }) {
  return rGet("/api/v1/podcast/get-info", params);
}

//获取播客荣誉墙
export function apiPodcastHonorList(data: { pid: string }) {
  return rPost("/api/v1/podcast-honor/list", data);
}

//相关播客推荐
export function apiRelatedPodcastList(data: { pid: string }) {
  const queryData = {
    ...data,
    position: "BOTTOM",
  };

  return rPost("/api/v1/related-podcast/list", queryData);
}

//获取播客公告
export function apiPodcastBulletin(data: { pid: string }) {
  return rGet("/api/v1/podcast-bulletin/get-by-pid", data);
}

//查询当前用户信息
interface IUserInfoParams {
  uid: string;
}
export function apiGetUserInfo(params: IUserInfoParams) {
  return rGet("/api/v1/profile/get", params);
}

//查询用户已经获取到的贴纸
export function apiGetUserStickerList(data: { uid: string }) {
  return rPost("/api/v1/sticker/list", data);
}

//查询用户贴纸墙
export function apiGetUserSticker(data: { uid: string }) {
  return rPost("/api/v1/sticker/get-board", data);
}

//查询单集播放进度
interface IPlaybackProgressParams {
  eids: string[];
}

export function apiPlaybackProgress(data: IPlaybackProgressParams) {
  return rPost("/api/v1/playback-progress/list", data);
}

//更新单集播放进度
interface IUpdatePlaybackProgressParams {
  data: {
    pid: string;
    eid: string;
    progress: number;
    playedAt: string;
  }[];
}

export function apiUpdatePlaybackProgress(data: IUpdatePlaybackProgressParams) {
  return rPost("/api/v1/playback-progress/update", data);
}

//查询单集的评论
interface ICommentPrimaryParams {
  order: string;
  id: string;
  loadMoreKey?: {
    id: string;
    direction: string;
    hotSortScore: number;
  };
}

export function apiGetCommentPrimary(data: ICommentPrimaryParams) {
  const query = {
    order: data.order,
    owner: {
      id: data.id,
      type: "EPISODE",
    },
    loadMoreKey: data.loadMoreKey,
  };

  return rPost("/api/v1/comment/list-primary", query);
}

//查询回复的评论
interface ICommentThreadParams {
  order: string;
  primaryCommentId: string;
}

export function apiGetCommentThread(data: ICommentThreadParams) {
  return rPost("/api/v1/comment/list-thread", data);
}

//收藏评论
interface ICommentCollectParams {
  commentId: string;
}

export function apiCommentCollect(data: ICommentCollectParams) {
  return rPost("/api/v1/comment/collect/create", data);
}

//取消收藏评论
interface IRemoveCommentCollectParams {
  commentId: string;
}

export function apiRemoveCommentCollect(data: IRemoveCommentCollectParams) {
  return rPost("/api/v1/comment/collect/remove", data);
}

//获取收藏评论列表
export function apiGetCommentCollectList() {
  return rPost("/api/v1/comment/collect/list");
}

//点赞 取消点赞评论
interface ICommentLikeUpdateParams {
  id: string;
  liked: boolean;
}

export function apiUpdateCommentLike(data: ICommentLikeUpdateParams) {
  const query = {
    liked: data.liked,
    target: {
      id: data.id,
      type: "COMMENT",
    },
    sourcePageName: 15,
    currentPageName: 20,
  };
  return rPost("/api/v1/like/update", query);
}

//首页榜单、精选节目、推荐等
export function apiDiscoveryFeedList() {
  return rPost("/api/v1/discovery-feed/list");
}

//刷新首页大家都在听
export function apiRefreshEpisodeRecommend() {
  return rPost("/api/v1/discovery-collection/refresh-episode-recommend");
}

//榜单
interface IRankCategoryParams {
  category: string;
}

export function apiGetRankList(params: IRankCategoryParams) {
  return rGet("/api/v1/top-list/get", params);
}

//订阅更新列表
interface IInboxUpdateParams {
  loadMoreKey: {
    id: string;
    pubDate: string;
  };
}

export function apiInboxUpdateList(data?: IInboxUpdateParams) {
  let p = {
    limit: 20
  }
  
  if (data) {
   p = {
     ...p,
     ...data
   } 
  }
  return rPost("/api/v1/inbox/list", p);
}

//获取用户信息
export function apiGetProfile(params: { uid: string }) {
  return rGet("/api/v1/profile/get", params);
}

//获取用户统计数据 关注人数 粉丝数 订阅数
export function apiGetUserState(params: { uid: string }) {
  return rGet("/api/v1/user-stats/get", params);
}

//获取关注的人
export function apiGetFollowingInfo(data: { uid: string }) {
  return rPost("/api/v1/user-relation/list-following", data);
}

//获取关注我的人
export function apiGetFollowerInfo(data: { uid: string }) {
  return rPost("/api/v1/user-relation/list-follower", data);
}

//获取收听时长概览
export function apiGetMileAge() {
  return rGet("/api/v1/mileage/get");
}

interface IMileAgeRankParams {
  rank: string; //TOTAL  LAST_THIRTY_DAYS 全部，最近30天
}

//获取收听时长排行
export function apiMileAgeRankList(data: IMileAgeRankParams) {
  return rPost("/api/v1/mileage/list", data);
}

//收听历史
interface IEpisodePlayedHistoryParams {
  uid: string;
}

export function apiEpisodePlayedHistory(data: IEpisodePlayedHistoryParams) {
  return rPost("/api/v1/episode-played/list", data);
}
