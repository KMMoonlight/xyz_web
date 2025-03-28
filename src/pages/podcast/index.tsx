import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IEpisode, IPodcast } from "@/types/type";
import {
  api,
  emitter,
  request,
  showPubDateDiffDisplay,
  transferTimeDurationToMinutes,
} from "@/utils/index";
import CommonSkeleton from "@/components/CommonSkeleton";
import { Button } from "@/components/ui/button";
import { IEpisodeParams } from "@/utils/api";
import {
  ChevronLeft,
  CirclePlay,
  Headphones,
  Loader2,
  MessageSquareText,
} from "lucide-react";

interface IEpisodeListLoadMoreKey {
  pubDate: string;
  id: string;
  direction: string;
}

const PodcastPage: React.FC = () => {
  const { podcastId } = useParams();
  const [podcast, setPodcast] = useState<IPodcast | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [episodeListLoading, setEpisodeListLoading] = useState<boolean>(false);
  const [episodeList, setEpisodeList] = useState<IEpisode[]>([]);
  const [episodeListLoadMoreKey, setEpisodeListLoadMoreKey] =
    useState<IEpisodeListLoadMoreKey | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const queryPodcastDetail = () => {
    if (podcastId) {
      setLoading(true);
      api
        .apiPodcastDetail({ pid: podcastId })
        .then((res) => {
          setPodcast(res.data);
        })
        .catch((e) => {
          if (e.status === 401) {
            request.reCallOn401(queryPodcastDetail);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const queryEpisodeList = () => {
    if (!podcastId) return;

    setEpisodeListLoading(true);

    const queryData: IEpisodeParams = {
      pid: podcastId,
      order: "desc",
    };

    if (episodeListLoadMoreKey) {
      queryData.loadMoreKey = episodeListLoadMoreKey;
    }

    api
      .apiEpisodeList(queryData)
      .then((res) => {
        setEpisodeList((val) => {
          return [...val, ...res.data];
        });
        setTotalCount(res.total);

        if (res.loadMoreKey) {
          setHasMore(true);
          setEpisodeListLoadMoreKey(res.loadMoreKey);
        } else {
          setHasMore(false);
        }
      })
      .catch((e) => {
        if (e.status === 401) {
          request.reCallOn401(queryEpisodeList);
        }
      })
      .finally(() => {
        setEpisodeListLoading(false);
      });
  };

  useEffect(() => {
    queryPodcastDetail();
    queryEpisodeList();
  }, []);

  const navigate = useNavigate();

  const jumpToEpisodeDetail = (index: number) => {
    const targetEpisode = episodeList[index];
    navigate(`/overview/episode/${targetEpisode.eid}`);
  };

  const jumpToPodcaster = (uid: string) => {
    navigate(`/overview/podcaster/${uid}`);
  };

  const backTo = () => {
    navigate(-1);
  };

  const playPodcast = ({
    url,
    title,
    image,
  }: {
    url: string;
    title: string;
    image: string;
  }) => {
    emitter.emit("play", { url, title, image });
  };

  return (
    <div className="mt-4 w-full">
      {loading ? (
        <CommonSkeleton length={3} cellLength={1} />
      ) : (
        <div className="w-full flex flex-col items-center">
          <div className="w-[580px]">
            <ChevronLeft
              size={32}
              color={podcast?.color?.light}
              className="cursor-pointer ml-[-60px]"
              onClick={backTo}
            />
          </div>
          <div className="text-3xl font-bold w-[580px] mt-2">
            {podcast?.title}
          </div>
          <div className="flex mt-4 w-[580px]">
            <div className="flex-1 flex flex-col justify-between">
              <div
                className="text-neutral-400 line-clamp-3 text-sm"
                title={podcast?.description}
              >
                {podcast?.description}
              </div>
              <div className="flex flex-wrap items-center">
                {podcast?.podcasters.map((cell) => {
                  return (
                    <div
                      className="flex items-center mt-2 mr-4 cursor-pointer"
                      key={cell.uid}
                      onClick={() => jumpToPodcaster(cell.uid)}
                    >
                      <img
                        src={cell?.avatar?.picture?.thumbnailUrl}
                        className="w-[24px] h-[24px] rounded"
                        alt="logo"
                      />
                      <div className="text-neutral-400 text-xs ml-1">
                        {cell?.nickname}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <img
              src={podcast?.image?.picUrl}
              className="w-[96px] h-[96px] rounded ml-2"
              alt="logo"
            />
          </div>

          <div className="mt-4 flex w-[580px] justify-between items-center">
            <div className="flex items-baseline">
              <span className="">{podcast?.subscriptionCount}</span>
              <span className="text-neutral-400 text-xs ml-2">已订阅</span>
            </div>

            <Button
              variant="outline"
              style={{ borderColor: "#ebb434", color: "#ebb434" }}
            >
              <span style={{ color: "#ebb434" }}>
                {podcast?.subscriptionStatus === "ON" ? "已订阅" : "未订阅"}
              </span>
            </Button>
          </div>

          <div className="h-[1px] w-[580px] bg-neutral-200 mt-6" />

          <div className="w-[580px] mt-4">
            <div className="text-xl font-bold" style={{ color: "#ebb434" }}>
              单集更新
            </div>
            <div className="text-sm text-neutral-400 mt-2 mb-2">
              {totalCount}期
            </div>
          </div>
          <div className="mt-4 overflow-y-auto w-full h-[calc(100vh-600px)] flex flex-col items-center">
            <div className="w-[580px]">
              {episodeList.map((cell, index) => {
                return (
                  <div key={cell.eid} className="flex items-center mb-4">
                    <div className="w-[64px]">
                      <img
                        src={cell.podcast.image.picUrl}
                        className="w-[64px] h-[64px] rounded cursor-pointer"
                        alt="logo"
                        onClick={() => jumpToEpisodeDetail(index)}
                      />
                    </div>
                    <div className="flex flex-col flex-1 ml-2">
                      <div
                        className="line-clamp-2 text-neutral-900 text-sm font-bold cursor-pointer"
                        onClick={() => jumpToEpisodeDetail(index)}
                        title={cell.title}
                      >
                        {cell.title}
                      </div>
                      <div className="line-clamp-2 text-neutral-400 text-sm cursor-pointe">
                        {cell.description}
                      </div>
                      <div className="flex w-full text-neutral-400 text-xs mt-2 pr-3">
                        <div className="flex items-center">
                          <span>
                            {transferTimeDurationToMinutes(cell.duration)}分钟
                          </span>
                        </div>
                        <span className="mx-1">·</span>
                        <div className="flex items-center">
                          <span>{showPubDateDiffDisplay(cell.pubDate)}</span>
                        </div>
                        <span className="mx-1">·</span>
                        <div className="flex items-center">
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
                    <CirclePlay
                      color={cell.podcast.color.light}
                      size={32}
                      className="cursor-pointer ml-2"
                      onClick={() =>
                        playPodcast({
                          url: cell.enclosure.url,
                          title: cell.title,
                          image: cell.podcast.image.thumbnailUrl,
                        })
                      }
                    />
                  </div>
                );
              })}

              <div className="w-full flex justify-center">
                {hasMore ? (
                  <Button
                    variant="outline"
                    className="cursor-pointer mt-4 mb-4"
                    disabled={episodeListLoading}
                    onClick={queryEpisodeList}
                  >
                    {episodeListLoading && <Loader2 className="animate-spin" />}
                    <span className="text-neutral-400 text-sm">加载更多</span>
                  </Button>
                ) : (
                  <span className="text-neutral-400 text-sm mt-4 mb-4">
                    没有更多了
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PodcastPage;
