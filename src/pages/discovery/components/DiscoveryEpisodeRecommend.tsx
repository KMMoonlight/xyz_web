import {IEpisode, IUser} from "@/types/type.ts";
import { CirclePlay } from "lucide-react";

interface DiscoveryEpisodeRecommendItem {
    title: string
    moduleType: string
    targetType: string
    target: {
        episode: IEpisode
        recommendation: string
        relatedUsers: IUser[]
        hasNegativeFeedback: boolean
    }[]
    feedback: {
        canFeedback: boolean
        feedbackSource: string
    }
}


export default function DiscoveryEpisodeRecommend(props: {data: DiscoveryEpisodeRecommendItem}) {
    return (
        <>
            <div className="text-2xl ml-4 mt-4" style={{color: '#25b4e1'}}>
                {props.data.title}
            </div>
            <div className="mt-2 flex flex-wrap gap-4 justify-start items-center">
                {
                    props.data.target.map((cell) => {
                        return (
                            <div key={cell.episode.eid}
                                 className="w-[420px] h-[120px] mx-4 rounded-md border border-neutral-100 shadow-sm">
                                <div className="flex mx-4 my-2">
                                    <img
                                        src={cell.episode?.image?.thumbnailUrl || cell.episode.podcast.image.thumbnailUrl}
                                        alt="podcast" className="w-[64px] h-[64px] rounded"/>
                                    <div className="flex flex-1 items-center justify-between">
                                        <div className="flex flex-col h-full ml-2 mr-2">
                                            <span className="text-neutral-400 text-sm">
                                                {cell.episode.podcast.author !== '佚名' ? cell.episode.podcast.author : cell.episode.podcast.title}
                                            </span>
                                            <span className="line-clamp-2 color-neutral-900 text-sm font-bold cursor-pointer"
                                                  title={cell.episode.title}>
                                                {cell.episode.title}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <CirclePlay color="#25b4e1" size={32} className="cursor-pointer"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex text-sm text-neutral-400 w-full pl-[84px]">
                                    {`"${cell.recommendation}`}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}