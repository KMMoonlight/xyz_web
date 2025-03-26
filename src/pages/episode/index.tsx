import * as React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  api,
  highlightTime,
  request,
  showPubDateDiffDisplay,
  transferTimeDurationToMinutes,
} from "@/utils/index.ts";
import { IEpisode } from "@/types/type.ts";
import CommonSkeleton from "@/components/CommonSkeleton.tsx";
import {
  ChevronLeft,
  CircleDollarSign,
  CirclePlay,
  ListPlus,
  MessageSquareMore,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

enum PERMISSION_TYPE {
  COMMENT = "COMMENT",
  PAY = "PAY",
  COMMENT_PAGE = "COMMENT_PAGE",
}

const EpisodePage: React.FC = () => {
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<IEpisode | undefined>(undefined);

  const queryEpisodeDetail = () => {
    setLoading(true);
    api
      .apiEpisodeDetail({ eid: params.episodeId || "" })
      .then((res) => {
        setDetailData(res.data);
      })
      .catch((e) => {
        if (e.status === 401) {
          request.reCallOn401(queryEpisodeDetail);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const permissionMap = useMemo(() => {
    const map: Record<PERMISSION_TYPE, boolean> = {
      COMMENT: true,
      COMMENT_PAGE: true,
      PAY: true,
    };

    if (detailData) {
      detailData.permissions.forEach((cell) => {
        if (
          cell.name === PERMISSION_TYPE.COMMENT ||
          cell.name === PERMISSION_TYPE.COMMENT_PAGE
        ) {
          map[cell.name] =
            cell.status !== "PURCHASE_REQUIRED" && cell.status !== "DENIED";
        }
      });

      if (detailData.payType === "PAY_EPISODE") {
        map["PAY"] = detailData?.isOwned || false;
      }
    }

    return map;
  }, [detailData]);

  const podcastColor = useMemo(() => {
    return detailData?.podcast?.color?.light || "#ebb434";
  }, [detailData]);

  useEffect(() => {
    queryEpisodeDetail();
  }, []);

  const navigate = useNavigate();

  const backTo = () => {
    navigate(-1);
  };

  const goToPodcast = () => {
    const podcastId = detailData?.podcast.pid;
    navigate(`/overview/podcast/${podcastId}`);
  };

  return (
    <>
      {loading ? (
        <CommonSkeleton length={4} cellLength={1} />
      ) : (
        <>
          <div className="mt-4 w-[540px]">
            <ChevronLeft
              size={32}
              color={podcastColor}
              className="ml-[-60px] cursor-pointer"
              onClick={backTo}
            />
            <img
              src={detailData?.podcast.image.thumbnailUrl}
              className="h-[32px] w-[32px] rounded mt-4"
              alt="podcast"
            />
            <div className="mt-2 flex justify-between items-center">
              <div className="w-[400px] flex flex-col">
                <div>
                  <span>
                    {detailData?.payType === "PAY_EPISODE" ? (
                      <CircleDollarSign
                        size={22}
                        color={podcastColor}
                        className="inline align-text-bottom mr-2"
                      />
                    ) : (
                      ""
                    )}
                  </span>
                  <span className="text-xl font-bold">{detailData?.title}</span>
                </div>
                <span
                  className="text-sm mt-4 cursor-pointer"
                  style={{ color: podcastColor }}
                  onClick={goToPodcast}
                >
                  {detailData?.podcast.title}
                  <span className="ml-2">&gt;</span>
                </span>
              </div>
              <CirclePlay
                color={podcastColor}
                size={32}
                className="cursor-pointer"
              />
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center text-sm text-neutral-400">
                <span>
                  {transferTimeDurationToMinutes(detailData?.duration || 0)}分钟
                </span>
                <span>&nbsp;·&nbsp;</span>
                <span>{showPubDateDiffDisplay(detailData?.pubDate || "")}</span>
              </div>
              <div className="flex items-center">
                <ListPlus
                  size={26}
                  color={
                    permissionMap["PAY"] ? podcastColor : podcastColor + "88"
                  }
                  className={
                    permissionMap["PAY"]
                      ? "cursor-pointer"
                      : "cursor-not-allowed"
                  }
                />

                <MessageSquareMore
                  size={26}
                  color={
                    permissionMap["COMMENT_PAGE"]
                      ? podcastColor
                      : podcastColor + "88"
                  }
                  className={
                    permissionMap["COMMENT_PAGE"]
                      ? "cursor-pointer ml-6"
                      : "cursor-not-allowed ml-6"
                  }
                />
              </div>
            </div>
            <div className="w-full h-[1px] bg-neutral-200 mt-4" />
          </div>
          <div className="w-full h-[calc(100vh-340px)] overflow-y-auto flex flex-col items-center">
            <div
              className="w-[500px] text-sm show-notes mb-4"
              dangerouslySetInnerHTML={{
                __html: detailData?.shownotes
                  ? highlightTime(detailData?.shownotes || "")
                  : "<p>空</p>",
              }}
            ></div>
          </div>
        </>
      )}
    </>
  );
};

//PURCHASE_REQUIRED
//PERMITTED
//DENIED

export default EpisodePage;
