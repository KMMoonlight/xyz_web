import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  api,
  highlightTime,
  request,
  showPubDateDiffDisplay,
} from "@/utils/index";
import { IComment } from "@/types/type";
import CommonSkeleton from "@/components/CommonSkeleton";
import { ChevronLeft, Loader2, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const CommentPage: React.FC = () => {
  const params = useParams();

  const [loading, setLoading] = useState<boolean>(false);
  const [commentList, setCommentList] = useState<IComment[]>([]);
  const [loadMoreKey, setLoadMoreKey] = useState<{
    id: string;
    direction: string;
    hotSortScore: number;
  } | null>(null);

  const [hasMore, setHasMore] = useState<boolean>(true);

  const navigate = useNavigate();

  const queryCommentList = () => {
    setLoading(true);

    let data: any = {
      order: "HOT",
      id: params.eid || "",
    };

    if (loadMoreKey) {
      data.loadMoreKey = loadMoreKey;
    }

    api
      .apiGetCommentPrimary(data)
      .then((res) => {
        setCommentList((val) => {
          return [...val, ...res.data];
        });
        if (res.loadMoreKey) {
          setLoadMoreKey(res.loadMoreKey);
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      })
      .catch((e) => {
        if (e.status === 401) {
          request.reCallOn401(queryCommentList);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadMore = () => {
    queryCommentList();
  };

  useEffect(() => {
    queryCommentList();
  }, []);

  const backTo = () => {
    navigate(-1);
  };

  const jumpToUser = (uid: string) => {
    navigate(`/overview/podcaster/${uid}`);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-[580px] mt-4">
        <ChevronLeft
          size={32}
          className="ml-[-60px] cursor-pointer"
          color="#25b4e1"
          onClick={backTo}
        />
      </div>
      <div className="w-full flex flex-col items-center w-full mt-6 overflow-y-auto h-[calc(100vh-300px)]">
        {commentList.map((item) => (
          <div key={item.id} className="w-[580px] mb-10">
            <div className="flex justify-between items-center">
              <img
                src={item.author.avatar.picture.picUrl}
                className="w-[32px] h-[32px] rounded-[16px] cursor-pointer"
                alt="avatar"
                onClick={() => jumpToUser(item.author.uid)}
              />
              <div className="flex flex-1 flex-col ml-4">
                <div
                  className="text-sm text-neutral-400 font-bold cursor-pointer"
                  onClick={() => jumpToUser(item.author.uid)}
                >
                  {item.author.nickname}
                </div>
                <div className="text-xs text-neutral-400">
                  <span>{showPubDateDiffDisplay(item.createdAt)}</span>
                  <span className="ml-2">{item.ipLoc}</span>
                </div>
              </div>
              <div className="flex items-center">
                <ThumbsUp size={16} color="grey" />
                <span className="ml-2 text-neutral-400">{item.likeCount}</span>
              </div>
            </div>
            <div
              className="text-sm text-neutral-600 mt-2 mx-12 show-notes"
              dangerouslySetInnerHTML={{
                __html: item.text
                  ? highlightTime(item.text || "")
                  : "<p>空</p>",
              }}
            />
            {item.replies && item.replies.length > 0 ? (
              <div className="mt-2 mx-12 rounded-md bg-neutral-100 p-2">
                {item.replies.map((reply) => (
                  <div key={reply.id} className="text-sm text-neutral-600 my-1">
                    <span className="text-neutral-400">
                      {reply.author.nickname}：
                    </span>
                    <span
                      className="text-neutral-600 show-notes"
                      dangerouslySetInnerHTML={{
                        __html: reply.text
                          ? highlightTime(reply.text || "")
                          : "<p>空</p>",
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}
          </div>
        ))}
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

export default CommentPage;
