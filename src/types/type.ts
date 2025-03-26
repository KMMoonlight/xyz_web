export interface IUser {
  type: string;
  uid: string;
  avatar: {
    picture: IImage;
  };
  nickname: string;
  isNicknameSet: boolean;
  bio?: string;
  gender: string;
  isCancelled: boolean;
  ipLoc: string;
  relation: string;
  isBlockedByViewer: boolean;
}

export interface IPermission {
  name: string;
  status: string;
}

export interface IImage {
  picUrl: string;
  largePicUrl: string;
  middlePicUrl: string;
  smallPicUrl: string;
  thumbnailUrl: string;
  format?: string;
  width?: number;
  height?: number;
}

export interface IPodcast {
  type: string;
  pid: string;
  title: string;
  author: string;
  brief: string;
  description: string;
  subscriptionCount: number;
  image: IImage;
  color: {
    original: string;
    light: string;
    dark: string;
  };
  hasTopic: boolean;
  topicLabels: string[];
  syncMode: string;
  episodeCount: number;
  latestEpisodePubDate: string;
  subscriptionPush: boolean;
  subscriptionPushPriority: string;
  subscriptionStar: boolean;
  status: string;
  subscriptionStatus?: string;
  permissions: IPermission[];
  payType: string;
  payEpisodeCount: number;
  podcasters: IUser[];
  hasPopularEpisodes: boolean;
  contacts: {
    type: string;
    name: string;
    url?: string;
    note?: string;
  }[];
  isCustomized: boolean;
  showZhuiguangIcon: boolean;
  subscriptionOftenPlayed?: boolean;
}

export interface IEpisode {
  type: string;
  eid: string;
  pid: string;
  title: string;
  shownotes: string;
  description: string;
  image: IImage;
  enclosure: {
    url: string;
  };
  isPrivateMedia: boolean;
  mediaKey: string;
  media: {
    id: string;
    size: number;
    mimeType: string;
    source: {
      mode: string;
      url: string;
    };
  };
  clapCount: number;
  commentCount: number;
  playCount: number;
  favoriteCount: number;
  pubDate: string;
  status: string;
  duration: number;
  podcast: IPodcast;
  isPlayed: boolean;
  isFinished: boolean;
  isPicked: boolean;
  isFavorited: boolean;
  isOwned?: boolean;
  permissions: IPermission[];
  payType: string;
  wechatShare: {
    style: string;
  };
  isCustomized: boolean;
  ipLoc: string;
  transcript: {
    mediaId: string;
  };
}

export interface ISearchPreset {
  link: string;
  resident: boolean;
  text: string;
  type: string;
}

export interface IRankListItem {
  type: string;
  id: string;
  title: string;
  category: string;
  targetType: string;
  publishDate: string;
  information: string;
  items: {
    item: IEpisode;
  }[];
  rulesUrl: string;
  background: string;
}

export interface ISubscriptionInboxUpdateList {
  data: IEpisode[];
  loadMoreKey: {
    id: string;
    pubDate: string;
  };
}

export interface IMileAge {
  lastSevenDayPlayedSeconds: number;
  lastThirtyDayPlayedSeconds: number;
  tagline: string;
  totalPlayedSeconds: number;
}

export interface IUserState {
  followerCount: number;
  followingCount: number;
  subscriptionCount: number;
  totalPlayedSeconds: number;
}
