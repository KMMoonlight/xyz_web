import * as React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api, request, showPubDateDiffDisplay } from '@/utils/index'
import { IEpisode, IPodcast, IUser } from '@/types/type'
import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  Headphones,
  Loader2,
  MessageSquareText,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

enum SEARCH_TYPE {
  PODCAST = 'PODCAST',
  EPISODE = 'EPISODE',
  USER = 'USER',
}

const SearchResultPage: React.FC = () => {
  const params = useParams()

  const [keyword, setKeyword] = useState<string>(params.keyword as string)
  const [loading, setLoading] = useState<boolean>(false)
  const [podcastHasMore, setPodcastHasMore] = useState<boolean>(false)
  const [episodeHasMore, setEpisodeHasMore] = useState<boolean>(false)
  const [userHasMore, setUserHasMore] = useState<boolean>(false)
  const [podcastLoadMoreKey, setPodcastLoadMoreKey] = useState<{
    loadMoreKey: number
    searchId: string
  } | null>(null)
  const [episodeLoadMoreKey, setEpisodeLoadMoreKey] = useState<{
    loadMoreKey: number
    searchId: string
  } | null>(null)
  const [userLoadMoreKey, setUserLoadMoreKey] = useState<{
    loadMoreKey: number
    searchId: string
  } | null>(null)

  const [podcastList, setPodcastList] = useState<IPodcast[]>([])
  const [episodeList, setEpisodeList] = useState<IEpisode[]>([])
  const [userList, setUserList] = useState<IUser[]>([])

  const [currentTab, setCurrentTab] = useState<SEARCH_TYPE>(SEARCH_TYPE.PODCAST)

  const setLoadMoreKey = (
    type: SEARCH_TYPE,
    loadMoreKey: {
      loadMoreKey: number
      searchId: string
    } | null
  ) => {
    if (type === SEARCH_TYPE.PODCAST) {
      if (loadMoreKey) {
        setPodcastLoadMoreKey(loadMoreKey)
        setPodcastHasMore(true)
      } else {
        setPodcastHasMore(false)
      }
    } else if (type === SEARCH_TYPE.EPISODE) {
      if (loadMoreKey) {
        setEpisodeLoadMoreKey(loadMoreKey)
        setEpisodeHasMore(true)
      } else {
        setEpisodeHasMore(false)
      }
    } else if (type === SEARCH_TYPE.USER) {
      if (loadMoreKey) {
        setUserLoadMoreKey(loadMoreKey)
        setUserHasMore(true)
      } else {
        setUserHasMore(false)
      }
    }
  }

  const getLoadMoreKey = (type: SEARCH_TYPE) => {
    if (type === SEARCH_TYPE.PODCAST) {
      return podcastHasMore ? podcastLoadMoreKey : null
    } else if (type === SEARCH_TYPE.EPISODE) {
      return episodeHasMore ? episodeLoadMoreKey : null
    } else if (type === SEARCH_TYPE.USER) {
      return userHasMore ? userLoadMoreKey : null
    }
  }

  //全部：ALL、节目：PODCAST、单集：EPISODE、用户：USER
  const querySearch = (searchType: SEARCH_TYPE) => {
    setLoading(true)

    const data: any = {
      type: searchType,
      keyword: keyword,
    }

    if (getLoadMoreKey(searchType)) {
      data.loadMoreKey = getLoadMoreKey(searchType)
    }

    api
      .apiSearch(data)
      .then((res) => {
        if (searchType === SEARCH_TYPE.PODCAST) {
          setPodcastList((v) => {
            return [...v, ...res.data]
          })
        } else if (searchType === SEARCH_TYPE.EPISODE) {
          setEpisodeList((v) => {
            return [...v, ...res.data]
          })
        } else if (searchType === SEARCH_TYPE.USER) {
          setUserList((v) => {
            return [...v, ...res.data]
          })
        }
        setLoadMoreKey(searchType, res.loadMoreKey)
      })
      .catch((e) => {
        if (e.status === 401) {
          request.reCallOn401(querySearch)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const navigate = useNavigate()

  const backTo = () => {
    navigate(-1)
  }

  const [inputKeyWord, setInputKeyWord] = useState<string>(
    params.keyword as string
  )

  const onSearchInput = (e: any) => {
    setInputKeyWord(e.target.value)
  }

  const onSearchKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      //清空之前的结果
      setPodcastList([])
      setEpisodeList([])
      setUserList([])
      setPodcastHasMore(false)
      setEpisodeHasMore(false)
      setUserHasMore(false)
      setPodcastLoadMoreKey(null)
      setEpisodeLoadMoreKey(null)
      setUserLoadMoreKey(null)
      setKeyword(inputKeyWord)
      navigate(`/overview/search_result/${inputKeyWord}`, { replace: true })
    }
  }

  const changeSubscriptionStatus = (pid: string, status: string) => {
    setPodcastList((v) => {
      return v.map((cell) => {
        if (cell.pid === pid) {
          return { ...cell, subscriptionStatus: status }
        }
        return cell
      })
    })
  }

  useEffect(() => {
    if (keyword) {
      querySearch(SEARCH_TYPE.PODCAST)
      querySearch(SEARCH_TYPE.EPISODE)
      querySearch(SEARCH_TYPE.USER)
    }
  }, [keyword])

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-[580px] flex items-center mt-4">
        <ChevronLeft
          size={32}
          color="#25b4e1"
          className="cursor-pointer ml-[-60px]"
          onClick={backTo}
        />

        <Input
          value={inputKeyWord}
          onInput={onSearchInput}
          className="w-[510px] ml-[60px]"
          onKeyDown={onSearchKeyDown}
        />
      </div>

      <div className="w-[520px] h-[30px] mt-4 flex justify-between items-center">
        <div
          className="text-xl font-bold text-center flex-1 cursor-pointer"
          style={{
            color: `${currentTab === SEARCH_TYPE.PODCAST ? '#25b4e1' : ''}`,
          }}
          onClick={() => setCurrentTab(SEARCH_TYPE.PODCAST)}
        >
          节目
        </div>
        <div
          className="text-xl font-bold text-center  flex-1 cursor-pointer"
          style={{
            color: `${currentTab === SEARCH_TYPE.EPISODE ? '#25b4e1' : ''}`,
          }}
          onClick={() => setCurrentTab(SEARCH_TYPE.EPISODE)}
        >
          单集
        </div>
        <div
          className="text-xl font-bold text-center  flex-1 cursor-pointer"
          style={{
            color: `${currentTab === SEARCH_TYPE.USER ? '#25b4e1' : ''}`,
          }}
          onClick={() => setCurrentTab(SEARCH_TYPE.USER)}
        >
          用户
        </div>
      </div>
      <div className="flex items-center justify-between w-[520px] mt-2">
        <div
          className="h-[4px] w-[190px] rounded mx-2"
          style={{
            backgroundColor: `${currentTab === SEARCH_TYPE.PODCAST ? '#25b4e1' : '#e8eced'}`,
          }}
        />
        <div
          className="h-[4px] w-[190px] rounded mx-2"
          style={{
            backgroundColor: `${currentTab === SEARCH_TYPE.EPISODE ? '#25b4e1' : '#e8eced'}`,
          }}
        />
        <div
          className="h-[4px] w-[190px] rounded mx-2"
          style={{
            backgroundColor: `${currentTab === SEARCH_TYPE.USER ? '#25b4e1' : '#e8eced'}`,
          }}
        />
      </div>

      {currentTab === SEARCH_TYPE.PODCAST && (
        <PodcastList
          podcastList={podcastList}
          podcastHasMore={podcastHasMore}
          loading={loading}
          queryPodcastList={() => querySearch(SEARCH_TYPE.PODCAST)}
          changeSubscriptionStatusHandle={(pid, status) =>
            changeSubscriptionStatus(pid, status)
          }
        />
      )}

      {currentTab === SEARCH_TYPE.EPISODE && (
        <EpisodeList
          episodeList={episodeList}
          episodeHasMore={episodeHasMore}
          loading={loading}
          queryEpisodeList={() => querySearch(SEARCH_TYPE.EPISODE)}
        />
      )}

      {currentTab === SEARCH_TYPE.USER && (
        <UserList
          userList={userList}
          userHasMore={userHasMore}
          loading={loading}
          queryUserList={() => querySearch(SEARCH_TYPE.USER)}
        />
      )}
    </div>
  )
}

const PodcastList = React.memo(
  (props: {
    podcastList: IPodcast[]
    podcastHasMore: boolean
    loading: boolean
    queryPodcastList: () => void
    changeSubscriptionStatusHandle: (pid: string, status: string) => void
  }) => {
    const navigate = useNavigate()

    const jumpToPodcastDetail = (pid: string) => {
      navigate(`/overview/podcast/${pid}`)
    }

    const changeSubscriptionStatus = (pid: string, status: string) => {
      //如果pid或者订阅状态不存在的话，直接return
      if (!pid || !status) return

      const data = {
        pid,
        mode: status === 'ON' ? 'OFF' : 'ON',
      }

      api
        .apiUpdateSubscription(data)
        .then(() => {
          toast('操作成功!')
          props.changeSubscriptionStatusHandle(
            pid,
            status === 'ON' ? 'OFF' : 'ON'
          )
        })
        .catch((e) => {
          if (e.status === 401) {
            request.reCallOn401(changeSubscriptionStatus)
          }
        })
    }

    return (
      <div className="w-full flex flex-col items-center h-[calc(100vh-280px)] overflow-y-auto">
        {props.podcastList.map((podcast) => {
          return (
            <div
              key={podcast.pid}
              className="w-[520px] h-[60px] mt-4 flex justify-between items-center"
            >
              <img
                src={podcast.image.picUrl}
                alt={podcast.title}
                className="w-[60px] h-[60px] rounded-md cursor-pointer"
                onClick={() => jumpToPodcastDetail(podcast.pid)}
              />
              <div className="flex flex-col flex-1 mx-2">
                <div
                  className="text-sm font-bold cursor-pointer"
                  onClick={() => jumpToPodcastDetail(podcast.pid)}
                >
                  {podcast.title}
                </div>
                <div className="line-clamp-1 text-xs text-neutral-400 mt-1">
                  {podcast.description}
                </div>
                <div className="flex items-center mt-1">
                  {podcast.podcasters.map((cell) => {
                    return (
                      <img
                        key={cell.uid}
                        src={cell.avatar.picture.thumbnailUrl}
                        className="w-[16px] h-[16px] rounded-full mr-1"
                      />
                    )
                  })}

                  <div className="text-xs text-neutral-400">
                    {showPubDateDiffDisplay(podcast.latestEpisodePubDate)}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                style={{ color: '#ebb434' }}
                onClick={() =>
                  changeSubscriptionStatus(
                    podcast.pid,
                    podcast?.subscriptionStatus || ''
                  )
                }
              >
                {podcast?.subscriptionStatus === 'ON' ? '已订阅' : '未订阅'}
              </Button>
            </div>
          )
        })}

        <div className="w-full flex justify-center">
          {props.podcastHasMore ? (
            <Button
              variant="outline"
              className="cursor-pointer mt-4 mb-4"
              disabled={props.loading}
              onClick={() => props.queryPodcastList()}
            >
              {props.loading && <Loader2 className="animate-spin" />}
              <span className="text-neutral-400 text-sm">加载更多</span>
            </Button>
          ) : (
            <span className="text-neutral-400 text-sm mt-4 mb-4">
              没有更多了
            </span>
          )}
        </div>
      </div>
    )
  }
)

const EpisodeList = React.memo(
  (props: {
    episodeList: IEpisode[]
    episodeHasMore: boolean
    loading: boolean
    queryEpisodeList: () => void
  }) => {
    const navigate = useNavigate()

    const jumpToEpisodeDetail = (eid: string) => {
      navigate(`/overview/episode/${eid}`)
    }

    const goToPodcast = (pid: string) => {
      navigate(`/overview/podcast/${pid}`)
    }

    return (
      <div className="w-full flex flex-col items-center h-[calc(100vh-280px)] overflow-y-auto">
        {props.episodeList.map((cell) => {
          return (
            <div key={cell.eid} className="flex mt-4 w-[480px]">
              <div className="w-[64px]">
                <img
                  src={cell.podcast.image.thumbnailUrl}
                  className="w-[64px] h-[64px] rounded  cursor-pointer"
                  alt="logo"
                  onClick={() => jumpToEpisodeDetail(cell.eid)}
                />
              </div>
              <div className="flex flex-col flex-1 ml-2">
                <div
                  className="line-clamp-2 text-neutral-900 text-sm font-bold cursor-pointer"
                  onClick={() => jumpToEpisodeDetail(cell.eid)}
                >
                  {cell.title}
                </div>
                <div className="line-clamp-2 text-neutral-400 text-sm cursor-pointe">
                  {cell.description}
                </div>
                <div
                  className="flex w-full text-neutral-400 text-xs mt-2 pr-3 cursor-pointer"
                  onClick={() => goToPodcast(cell.podcast.pid)}
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
          )
        })}

        <div className="w-full flex justify-center">
          {props.episodeHasMore ? (
            <Button
              variant="outline"
              className="cursor-pointer mt-4 mb-4"
              disabled={props.loading}
              onClick={() => props.queryEpisodeList()}
            >
              {props.loading && <Loader2 className="animate-spin" />}
              <span className="text-neutral-400 text-sm">加载更多</span>
            </Button>
          ) : (
            <span className="text-neutral-400 text-sm mt-4 mb-4">
              没有更多了
            </span>
          )}
        </div>
      </div>
    )
  }
)

const UserList = React.memo(
  (props: {
    userList: IUser[]
    userHasMore: boolean
    loading: boolean
    queryUserList: () => void
  }) => {
    const navigate = useNavigate()

    const jumpToUserDetail = (uid: string) => {
      navigate(`/overview/podcaster/${uid}`)
    }

    return (
      <div className="w-full flex flex-col items-center h-[calc(100vh-280px)] overflow-y-auto">
        {props.userList.map((user) => {
          return (
            <div
              key={user.uid}
              className="w-[520px] h-[60px] mt-4 flex justify-between items-center cursor-pointer"
              onClick={() => jumpToUserDetail(user.uid)}
            >
              <img
                src={user.avatar.picture.thumbnailUrl}
                alt="user"
                className="w-[60px] h-[60px] rounded-full cursor-pointer"
              />
              <div className="flex flex-col flex-1 mx-4">{user.nickname}</div>
            </div>
          )
        })}

        <div className="w-full flex justify-center">
          {props.userHasMore ? (
            <Button
              variant="outline"
              className="cursor-pointer mt-4 mb-4"
              disabled={props.loading}
              onClick={() => props.queryUserList()}
            >
              {props.loading && <Loader2 className="animate-spin" />}
              <span className="text-neutral-400 text-sm">加载更多</span>
            </Button>
          ) : (
            <span className="text-neutral-400 text-sm mt-4 mb-4">
              没有更多了
            </span>
          )}
        </div>
      </div>
    )
  }
)

export default SearchResultPage
