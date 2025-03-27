import * as React from "react";
import { api, getUserID, request, timeToHours } from "@/utils/index";
import { useEffect, useMemo, useState } from "react";
import { IEpisode, IMileAge, IUser, IUserState } from "@/types/type.ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
//import {apiEpisodePlayedHistory, apiGetUserState} from "@/utils/api.ts";
import { useNavigate } from "react-router-dom";
import { Headphones, MessageSquareText } from "lucide-react";
import Plant from "@/assets/plant.gif";
import CommonSkeleton from "@/components/CommonSkeleton.tsx";

const UserInfoPage: React.FC<{ uid: string }> = (props: { uid: string }) => {
  const [userInfo, setUserInfo] = useState<IUser | undefined>(undefined);
  const [mileAgeInfo, setMileAgeInfo] = useState<IMileAge | undefined>(
    undefined
  );
  const [userState, setUserState] = useState<IUserState | undefined>(undefined);
  const [playedHistoryList, setPlayedHistoryList] = useState<IEpisode[]>([]);
  const [playedHistoryLoading, setPlayedHistoryLoading] =
    useState<boolean>(false);

  //获取个人信息
  const queryUserProfile = () => {
    api
      .apiGetProfile({ uid: props.uid })
      .then((res) => {
        setUserInfo(res.data);
      })
      .catch((e) => {
        if (e.status === 401) {
          request.reCallOn401(queryUserProfile);
        }
      });
  };

  const queryUserState = () => {
    api
      .apiGetUserState({ uid: props.uid })
      .then((res) => {
        setUserState(res.data);
        if (!isCurrentUser) {
          setMileAgeInfo({
            lastSevenDayPlayedSeconds: 0,
            lastThirtyDayPlayedSeconds: 0,
            tagline: "",
            totalPlayedSeconds: res.data.totalPlayedSeconds,
          });
        }
      })
      .catch((e) => {
        if (e.status === 401) {
          request.reCallOn401(queryUserState, { uid: props.uid });
        }
      });
  };

  //获取关注人/被关注的信息

  //获取收听历史排行及收听数据统计
  const queryMileAge = () => {
    api
      .apiGetMileAge()
      .then((res) => {
        setMileAgeInfo(res.data);
      })
      .catch((e) => {
        if (e.status === 401) {
          request.reCallOn401(queryMileAge);
        }
      });
  };

  const queryPlayedHistory = () => {
    setPlayedHistoryLoading(true);
    api
      .apiEpisodePlayedHistory({ uid: props.uid })
      .then((res) => {
        setPlayedHistoryList(res.data);
      })
      .catch((e) => {
        if (e.status === 401) {
          request.reCallOn401(queryPlayedHistory);
        }
      })
      .finally(() => {
        setPlayedHistoryLoading(false);
      });
  };

  // const queryMileAgeRecordListLast30Days = () => {
  //     api.apiMileAgeRankList({rank: MileageType.LAST_THIRTY_DAYS}).then((res) => {
  //         console.log('res', res)
  //     }).catch((e) => {
  //         if (e.status === 401) {
  //             request.reCallOn401(queryMileAgeRecordListLast30Days)
  //         }
  //     })
  // }
  //
  // const queryMileAgeRecordListTotal = () => {
  //     api.apiMileAgeRankList({rank: MileageType.TOTAL}).then((res) => {
  //         console.log('res', res)
  //     }).catch((e) => {
  //         if (e.status === 401) {
  //             request.reCallOn401(queryMileAgeRecordListTotal)
  //         }
  //     })
  // }

  useEffect(() => {
    queryUserProfile();
    queryUserState();
    if (isCurrentUser) {
      queryMileAge();
    }
    queryPlayedHistory();
  }, []);

  const userBasicInfo = useMemo(() => {
    return {
      nickname: userInfo?.nickname || "",
      bio: userInfo?.bio || "还没有设置个人签名",
      avatar: userInfo?.avatar?.picture?.thumbnailUrl || "",
    };
  }, [userInfo]);

  const userFollowInfo = useMemo(() => {
    return {
      followerCount: userState?.followerCount || 0,
      followingCount: userState?.followingCount || 0,
      subscriptionCount: userState?.subscriptionCount || 0,
      totalPlayedSeconds: userState?.totalPlayedSeconds || 0,
    };
  }, [userState]);

  const isCurrentUser = useMemo(() => {
    return getUserID() === props.uid;
  }, [props.uid]);

  return (
    <div className="w-full flex flex-col items-center">
      <UserBasicInfo data={userBasicInfo} />
      <UserFollowInfo data={userFollowInfo} uid={props.uid} />
      {mileAgeInfo && <MileageRankInfo data={mileAgeInfo as IMileAge} />}
      {playedHistoryLoading ? (
        <CommonSkeleton length={3} cellLength={1} />
      ) : (
        <PlayedHistoryList data={playedHistoryList} />
      )}
    </div>
  );
};

interface IUserBasicInfo {
  nickname: string;
  bio?: string;
  avatar: string;
}

const UserBasicInfo: React.FC<{ data: IUserBasicInfo }> = React.memo(
  (props: { data: IUserBasicInfo }) => {
    return (
      <div className="flex items-center mt-4 w-[480px] h-[80px] justify-between">
        <div className="flex flex-col h-full justify-around">
          <div className="text-xl font-bold">{props.data.nickname}</div>
          <div className="text-sm text-neutral-400">{props.data.bio}</div>
        </div>
        {props.data.avatar && (
          <img
            src={props.data.avatar}
            className="w-[80px] h-[80px] rounded-[40px]"
            alt="avatar"
          />
        )}
      </div>
    );
  }
);

const UserFollowInfo: React.FC<{ data: IUserState; uid: string }> = React.memo(
  (props: { data: IUserState; uid: string }) => {
    const [followerList, setFollowerList] = useState<IUser[]>([]);
    const [followingList, setFollowingList] = useState<IUser[]>([]);
    const navigate = useNavigate();

    const queryFollowingInfo = () => {
      api
        .apiGetFollowingInfo({ uid: props.uid })
        .then((res) => {
          setFollowingList(res.data);
        })
        .catch((e) => {
          if (e.status === 401) {
            request.reCallOn401(queryFollowingInfo);
          }
        });
    };

    const queryFollowerInfo = () => {
      api
        .apiGetFollowerInfo({ uid: props.uid })
        .then((res) => {
          setFollowerList(res.data);
        })
        .catch((e) => {
          if (e.status === 401) {
            request.reCallOn401(queryFollowerInfo);
          }
        });
    };

    const jumpToSubscriptionPage = () => {
      navigate(`/overview/subscription/podcasts/${props.uid}`);
    };

    const jumpToPodcaster = (uid: string) => {
      navigate(`/overview/podcaster/${uid}`);
    };

    return (
      <div className="flex items-center mt-4">
        <Dialog>
          <DialogTrigger>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => queryFollowingInfo()}
            >
              <div className="text-base font-bold">
                {props.data.followingCount}
              </div>
              <div className="text-sm text-neutral-400 ml-2">关注</div>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>我关注的人</DialogTitle>
            <DialogDescription></DialogDescription>
            <div className="max-h-[300px] overflow-auto">
              {followingList.map((cell) => {
                return (
                  <div
                    key={cell.uid}
                    className="flex justify-between items-center mt-4"
                  >
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => jumpToPodcaster(cell.uid)}
                    >
                      <img
                        src={cell.avatar.picture.thumbnailUrl}
                        className="w-[40px] h-[40px] rounded-[20px]"
                        alt="avatar"
                      />
                      <div className="ml-4">{cell.nickname}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger>
            <div
              className="flex items-center ml-8 cursor-pointer"
              onClick={() => queryFollowerInfo()}
            >
              <div className="text-base font-bold">
                {props.data.followerCount}
              </div>
              <div className="text-sm text-neutral-400 ml-2">粉丝</div>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>关注我的人</DialogTitle>
            <DialogDescription></DialogDescription>
            <div className="max-h-[300px] overflow-auto">
              {followerList.map((cell) => {
                return (
                  <div
                    key={cell.uid}
                    className="flex justify-between items-center mt-4"
                  >
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => jumpToPodcaster(cell.uid)}
                    >
                      <img
                        src={cell.avatar.picture.thumbnailUrl}
                        className="w-[40px] h-[40px] rounded-[20px]"
                        alt="avatar"
                      />
                      <div className="ml-4">{cell.nickname}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
        <div
          className="flex items-center cursor-pointer ml-8"
          onClick={() => jumpToSubscriptionPage()}
        >
          <div className="text-base font-bold">
            {props.data.subscriptionCount}
          </div>
          <div className="text-sm text-neutral-400 ml-2">订阅数</div>
        </div>
      </div>
    );
  }
);

// enum MileageType {
//     TOTAL = 'TOTAL',
//     LAST_THIRTY_DAYS = 'LAST_THIRTY_DAYS'
// }

const MileageRankInfo: React.FC<{ data: IMileAge }> = React.memo(
  (props: { data: IMileAge }) => {
    // const [currentTab, setCurrentTab] = useState<MileageType>(MileageType.LAST_THIRTY_DAYS)
    //
    // const changeTab = (tab: MileageType) => {
    //     setCurrentTab(tab)
    // }

    const displayHours = useMemo(() => {
      return timeToHours(props.data.totalPlayedSeconds);
    }, [props.data.totalPlayedSeconds]);

    //IMileAge
    return (
      <div className="mt-6 flex items-center">
        <img
          src={Plant as string}
          style={{ backgroundColor: "transparent" }}
          className="w-[70px] h-[70px]"
          alt="plant"
        />

        <div className="ml-6">
          <div className="flex items-center">
            <span>
              {displayHours.hours > 0 ? (
                <>
                  <span className="text-3xl font-bold">
                    {displayHours.hours}
                  </span>
                  <span className="text-sm text-neutral-400">小时</span>
                </>
              ) : (
                ""
              )}
            </span>

            <span className="ml-4">
              {displayHours.minutes > 0 ? (
                <>
                  <span className="text-3xl font-bold">
                    {displayHours.minutes}
                  </span>
                  <span className="text-sm text-neutral-400">分钟</span>
                </>
              ) : (
                ""
              )}
            </span>
          </div>
          <div
            className="mt-4 text-neutral-400 max-w-[400px] text-ellipsis"
            title={props.data.tagline}
          >
            {props.data.tagline}
          </div>
        </div>

        {/*<div className="flex items-center justify-around w-[420px] h-[30px] mt-6">*/}
        {/*    <div className="flex justify-center cursor-pointer"*/}
        {/*         onClick={() => changeTab(MileageType.LAST_THIRTY_DAYS)}>*/}
        {/*        <span className="text-2xl" style={{color: '#25b4e1'}}>*/}
        {/*            最近30天*/}
        {/*        </span>*/}
        {/*    </div>*/}
        {/*    <div className="flex justify-center cursor-pointer" onClick={() => changeTab(MileageType.TOTAL)}>*/}
        {/*        <span className="text-2xl" style={{color: '#25b4e1'}}>*/}
        {/*            全部*/}
        {/*        </span>*/}
        {/*    </div>*/}

        {/*</div>*/}
        {/*<div className="flex items-center justify-between w-[420px] mt-2">*/}
        {/*    <div className="h-[4px] w-[210px] rounded"*/}
        {/*         style={{backgroundColor: `${currentTab === MileageType.LAST_THIRTY_DAYS ? '#25b4e1' : '#e8eced'}`}}/>*/}
        {/*    <div className="h-[4px] w-[210px] rounded"*/}
        {/*         style={{backgroundColor: `${currentTab === MileageType.TOTAL ? '#25b4e1' : '#e8eced'}`}}/>*/}
        {/*</div>*/}
      </div>
    );
  }
);

const PlayedHistoryList: React.FC<{ data: IEpisode[] }> = React.memo(
  (props: { data: IEpisode[] }) => {
    const navigate = useNavigate();

    const jumpToEpisodeDetail = (index: number) => {
      const targetEpisode = props.data[index];
      navigate(`/overview/episode/${targetEpisode.eid}`);
    };

    const goToPodcast = (index: number) => {
      const podcastId = props.data[index]?.podcast.pid;
      navigate(`/overview/podcast/${podcastId}`);
    };

    return (
      <div className="mt-6 w-full flex flex-col items-center">
        <div className="text-2xl mb-4" style={{ color: "#25b4e1" }}>
          最近听过
        </div>
        <div className="max-h-[calc(100vh-380px)] w-full overflow-auto flex flex-col items-center">
          {props.data.map((cell, index) => {
            return (
              <div key={cell.eid} className="flex mb-4 w-[480px]">
                <div className="w-[64px]">
                  <img
                    src={cell.podcast.image.thumbnailUrl}
                    className="w-[64px] h-[64px] rounded  cursor-pointer"
                    alt="logo"
                    onClick={() => jumpToEpisodeDetail(index)}
                  />
                </div>
                <div className="flex flex-col flex-1 ml-2">
                  <div
                    className="line-clamp-2 text-neutral-900 text-sm font-bold cursor-pointer"
                    onClick={() => jumpToEpisodeDetail(index)}
                  >
                    {cell.title}
                  </div>
                  <div className="line-clamp-2 text-neutral-400 text-sm cursor-pointe">
                    {cell.description}
                  </div>
                  <div
                    className="flex w-full text-neutral-400 text-xs mt-2 pr-3 cursor-pointer"
                    onClick={() => goToPodcast(index)}
                  >
                    <div>{cell.podcast.title}</div>
                    <div className="flex items-center ml-4">
                      <Headphones size={12} />
                      <span className="ml-1">{cell.playCount}</span>
                    </div>
                    <span className="mx-1">·</span>
                    <div className="flex items-center">
                      <MessageSquareText size={12} />
                      <span className="ml-1">{cell.commentCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

export default UserInfoPage;
