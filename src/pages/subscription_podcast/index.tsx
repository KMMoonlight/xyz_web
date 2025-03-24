import * as React from 'react'
import {useEffect, useState} from "react"
import {api, getUserID, request} from '@/utils/index'
import {IPodcast} from "@/types/type"
import {Button} from "@/components/ui/button.tsx";
import {Loader2} from "lucide-react";

const SubscriptionPodcastPage: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const [podcastList, setPodcastList] = useState<IPodcast[]>([])
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [loadMoreKey, setLoadMoreKey] = useState<{id: string, subscribedAt: string} | undefined>(undefined)

    const querySubscriptionPodcastList = (load: boolean) => {
        setLoading(true)

        const params: any = load && loadMoreKey ? {uid: getUserID(), loadMoreKey} : {uid: getUserID()}

        api.apiGetSubscription(params).then((res) => {
            if (res.loadMoreKey) {
                setLoadMoreKey(res.loadMoreKey)
                setHasMore(true)
            }else {
                setHasMore(false)
            }

            setPodcastList((val) => {
              return val.concat(res.data)
            })
        }).catch((e) => {
            if (e.status === 401) {
                request.reCallOn401(querySubscriptionPodcastList, load)
            }
        }).finally(() => {
            setLoading(false)
        })
    }


    const loadMore = () => {
        querySubscriptionPodcastList(true)
    }

    useEffect(() => {
        querySubscriptionPodcastList(false)
    }, [])

    return (
        <>
            <GridPodcastList data={podcastList}/>
            {
                hasMore ? <Button variant="outline" className="cursor-pointer mt-4 mb-4" disabled={loading} onClick={loadMore}>
                                    {loading && <Loader2 className="animate-spin"/>}
                                    <span className="text-neutral-400 text-sm">
                                        加载更多
                                    </span>
                </Button> : <span className="text-neutral-400 text-sm mt-4 mb-4">没有更多了</span>
            }
        </>
    )
}



const GridPodcastList: React.FC<{data: IPodcast[]}> = (props: {data: IPodcast[]}) => {
    return (
        <div className="grid grid-flow grid-cols-3 gap-2 w-[480px] mt-2">
            {
                props.data.map((cell) => {
                    return (
                        <div key={cell.pid} className="relative">
                            <img src={cell.image.smallPicUrl} alt="logo" className="rounded-md"/>
                            {
                                cell.subscriptionOftenPlayed ? <span style={{backgroundColor: '#DAF1FA', color: '#25b4e1'}} className="w-[40px] text-center  rounded absolute text-sm right-2 bottom-2">
                                    常听
                                </span> : ''
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}


export default SubscriptionPodcastPage
