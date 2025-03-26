import * as React from "react";
import { useEffect, useState } from "react";
import { api, getUserID, request } from "@/utils/index";
import { IPodcast } from "@/types/type";
import { Button } from "@/components/ui/button.tsx";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubscriptionPodcastPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [podcastList, setPodcastList] = useState<IPodcast[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadMoreKey, setLoadMoreKey] = useState<
    { id: string; subscribedAt: string } | undefined
  >(undefined);

  const querySubscriptionPodcastList = (load: boolean) => {
    setLoading(true);

    const params: any =
      load && loadMoreKey
        ? { uid: getUserID(), loadMoreKey }
        : { uid: getUserID() };

    api
      .apiGetSubscription(params)
      .then((res) => {
        if (res.loadMoreKey) {
          setLoadMoreKey(res.loadMoreKey);
          setHasMore(true);
        } else {
          setHasMore(false);
        }

        setPodcastList((val) => {
          return val.concat(res.data);
        });
      })
      .catch((e) => {
        if (e.status === 401) {
          request.reCallOn401(querySubscriptionPodcastList, load);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadMore = () => {
    querySubscriptionPodcastList(true);
  };

  useEffect(() => {
    querySubscriptionPodcastList(false);
  }, []);

  const navigate = useNavigate();

  const backTo = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="w-[540px]">
        <ChevronLeft
          size={32}
          color="#25b4e1"
          className="ml-[-60px] cursor-pointer mt-2"
          onClick={backTo}
        />
      </div>

      <div className="max-h-[calc(100vh-130px)] overflow-y-auto w-full flex flex-col items-center">
        <GridPodcastList data={podcastList} />
        <div className="w-full flex justify-center w-[540px]">
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
            <span className="text-neutral-400 text-sm mt-4 mb-4">
              没有更多了
            </span>
          )}
        </div>
      </div>
    </>
  );
};

const GridPodcastList: React.FC<{ data: IPodcast[] }> = (props: {
  data: IPodcast[];
}) => {
  const navigate = useNavigate();

  const goToPodcast = (index: number) => {
    const podcastId = props.data[index].pid;
    navigate(`/overview/podcast/${podcastId}`);
  };

  return (
    <div className="grid grid-flow grid-cols-3 gap-2 w-[540px] mt-4">
      {props.data.map((cell, index) => {
        return (
          <div
            key={cell.pid}
            className="relative cursor-pointer"
            onClick={() => goToPodcast(index)}
          >
            <img
              src={cell.image.smallPicUrl}
              alt="logo"
              className="rounded-md"
            />
            {cell.subscriptionOftenPlayed ? (
              <span
                style={{ backgroundColor: "#DAF1FA", color: "#25b4e1" }}
                className="w-[40px] text-center  rounded absolute text-sm right-2 bottom-2"
              >
                常听
              </span>
            ) : (
              ""
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SubscriptionPodcastPage;
