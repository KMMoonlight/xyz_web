import * as React from "react";
import { useEffect, useState } from "react";
import {
  api,
  emitter,
  getUserID,
  request,
  showPubDateDiffDisplay,
  transferTimeDurationToMinutes,
} from "@/utils/index";
import { IEpisode, ISubscriptionInboxUpdateList } from "@/types/type";
import {
  CircleDollarSign,
  CirclePlay,
  Headphones,
  Layers,
  Loader2,
  MessageSquareMore,
  MessageSquareText,
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadMoreKey, setLoadMoreKey] = useState<
    { id: string; pubDate: string } | undefined
  >(undefined);
  const [inboxList, setInboxList] =
    useState<ISubscriptionInboxUpdateList | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const queryInboxList = (isLoad = true) => {
    setLoading(true);
    const params = isLoad && loadMoreKey ? { loadMoreKey } : undefined;
    api
      .apiInboxUpdateList(params)
      .then((res) => {
        setInboxList((val) => {
          if (!val) return res;

          return {
            ...val,
            data: val?.data.concat(res.data),
          };
        });

        if (res.loadMoreKey) {
          setLoadMoreKey(res.loadMoreKey);
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      })
      .catch((e: any) => {
        if (e.status === 401) {
          request.reCallOn401(queryInboxList, isLoad);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadMore = () => {
    queryInboxList();
  };

  const jumpToPodcastSubscription = () => {
    navigate(`/overview/subscription/podcasts/${getUserID()}`);
  };

  useEffect(() => {
    queryInboxList(false);
  }, []);

  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex justify-end items-center mt-4 w-[540px]">
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={jumpToPodcastSubscription}
        >
          <Layers size={18} color="#25b4e1" />
          <span className="ml-2">我的订阅</span>
        </Button>
      </div>
      <div className="flex flex-col max-h-[calc(100vh-250px)] overflow-y-auto w-full items-center pl-[20px] pr-[20px]">
        <InboxList data={inboxList?.data || []} />
        {hasMore ? (
          <Button
            variant="outline"
            className="cursor-pointer mt-4 mb-4"
            disabled={loading}
            onClick={loadMore}
          >
            {loading && <Loader2 className="animate-spin" />}
            <span className="text-neutral-400 text-sm">加载更多</span>
          </Button>
        ) : (
          <span className="text-neutral-400 text-sm mt-4 mb-4">没有更多了</span>
        )}
      </div>
    </div>
  );
};

const InboxList: React.FC<{ data: IEpisode[] }> = (props: {
  data: IEpisode[];
}) => {
  const navigate = useNavigate();

  const jumpToEpisodeDetail = (index: number) => {
    const targetEpisode = props.data[index];
    navigate(`/overview/episode/${targetEpisode.eid}`);
  };

  const jumpToComment = (eid: string) => {
    navigate(`/overview/comment/${eid}`);
  };

  const playPodcast = ({
    url,
    title,
    image,
    eid,
    pid,
  }: {
    url: string;
    title: string;
    image: string;
    eid: string;
    pid: string;
  }) => {
    emitter.emit("play", { url, title, image, eid, pid });
  };

  return props.data.map((cell, index) => {
    return (
      <div key={cell.eid} className="flex mt-8 w-[540px]">
        <div className="w-[64px]">
          <img
            src={cell.podcast.image.thumbnailUrl}
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
            {cell.payType === "PAY_EPISODE" && (
              <div className="flex items-center mr-2">
                <CircleDollarSign size={12} color="#ebb434" />
                <span className="ml-1" style={{ color: "#ebb434" }}>
                  付费试听
                </span>
              </div>
            )}
            <div className="flex items-center">
              <span>{transferTimeDurationToMinutes(cell.duration)}分钟</span>
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

          <div className="flex justify-end items-center mt-2">
            <MessageSquareMore
              size={26}
              color="#25b4e1"
              className="cursor-pointer mr-4"
              onClick={() => {
                jumpToComment(cell.eid);
              }}
            />
            <CirclePlay
              color="#25b4e1"
              size={26}
              className="cursor-pointer"
              onClick={() =>
                playPodcast({
                  url: cell.enclosure.url,
                  title: cell.title,
                  image: cell.podcast.image.picUrl,
                  eid: cell.eid,
                  pid: cell.podcast.pid,
                })
              }
            />
          </div>
        </div>
      </div>
    );
  });
};

export default SubscriptionPage;
