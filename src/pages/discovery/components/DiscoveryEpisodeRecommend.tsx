import { IEpisode, IUser } from "@/types/type.ts";
import { CirclePlay, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { api, emitter, request } from "@/utils/index";
import * as React from "react";
import { useNavigate } from "react-router-dom";

interface DiscoveryEpisodeRecommendItem {
  title: string;
  moduleType: string;
  targetType: string;
  target: {
    episode: IEpisode;
    recommendation: string;
    relatedUsers: IUser[];
    hasNegativeFeedback: boolean;
  }[];
  feedback: {
    canFeedback: boolean;
    feedbackSource: string;
  };
}

const DiscoveryEpisodeRecommend: React.FC<{
  data: DiscoveryEpisodeRecommendItem;
}> = (props: { data: DiscoveryEpisodeRecommendItem }) => {
  const [refreshData, setRefreshData] =
    useState<DiscoveryEpisodeRecommendItem | null>(null);
  const [refreshLoading, setRefreshLoading] = useState<boolean>(false);

  const refreshRecommend = () => {
    setRefreshLoading(true);
    api
      .apiRefreshEpisodeRecommend()
      .then((res) => {
        setRefreshData(res.data);
      })
      .catch((e) => {
        if (e.status === 401) {
          request.reCallOn401(refreshRecommend);
        }
      })
      .finally(() => {
        setRefreshLoading(false);
      });
  };

  const useData = useMemo(() => {
    return refreshData ? refreshData : props.data;
  }, [props.data, refreshData]);

  const navigate = useNavigate();

  const jumpToEpisodeDetail = (index: number) => {
    const targetEpisode = useData.target[index];
    navigate(`/overview/episode/${targetEpisode.episode.eid}`);
  };

  const goToPodcast = (index: number) => {
    const podcastId = useData.target[index].episode.podcast.pid;
    navigate(`/overview/podcast/${podcastId}`);
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

  return (
    <>
      <div className="ml-4 mt-4 flex w-[30%] justify-between">
        <span className="text-2xl" style={{ color: "#25b4e1" }}>
          {useData.title}
        </span>
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={refreshRecommend}
        >
          <RefreshCcw
            size={12}
            className={refreshLoading ? "animate-spin" : ""}
          />
          <span className="text-neutral-400 text-sm">换一换</span>
        </Button>
      </div>
      <div className="mt-2 flex flex-col justify-start items-center">
        {useData.target.map((cell, index) => {
          return (
            <div
              key={cell.episode.eid}
              className="w-[420px] h-[120px] mx-4 rounded-md border border-neutral-100 shadow-sm mb-6"
            >
              <div className="flex mx-4 my-2">
                <img
                  src={cell.episode.podcast.image.thumbnailUrl}
                  alt="podcast"
                  className="w-[64px] h-[64px] rounded cursor-pointer"
                  onClick={() => jumpToEpisodeDetail(index)}
                />
                <div className="flex flex-1 items-center justify-between">
                  <div className="flex flex-col h-full ml-2 mr-2">
                    <span
                      className="text-neutral-400 text-sm cursor-pointer"
                      onClick={() => goToPodcast(index)}
                    >
                      {cell.episode.podcast.title}
                    </span>
                    <span
                      className="line-clamp-2 color-neutral-900 text-sm font-bold cursor-pointer"
                      title={cell.episode.title}
                      onClick={() => jumpToEpisodeDetail(index)}
                    >
                      {cell.episode.title}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CirclePlay
                      color="#25b4e1"
                      size={32}
                      className="cursor-pointer"
                      onClick={() =>
                        playPodcast({
                          url: cell.episode.enclosure.url,
                          title: cell.episode.title,
                          image: cell.episode.podcast.image.thumbnailUrl,
                          eid: cell.episode.eid,
                          pid: cell.episode.podcast.pid,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex text-sm text-neutral-400 w-full pl-[84px]">
                {`"${cell.recommendation}`}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default DiscoveryEpisodeRecommend;
