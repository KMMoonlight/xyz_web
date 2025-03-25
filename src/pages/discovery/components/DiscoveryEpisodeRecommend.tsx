import { IEpisode, IUser } from "@/types/type.ts";
import { CirclePlay, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { api, request } from "@/utils/index";
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
      <div className="mt-2 flex flex-wrap gap-4 justify-start items-center">
        {useData.target.map((cell, index) => {
          return (
            <div
              key={cell.episode.eid}
              className="w-[420px] h-[120px] mx-4 rounded-md border border-neutral-100 shadow-sm"
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
                    <span className="text-neutral-400 text-sm">
                      {cell.episode.podcast.author !== "佚名"
                        ? cell.episode.podcast.author
                        : cell.episode.podcast.title}
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
