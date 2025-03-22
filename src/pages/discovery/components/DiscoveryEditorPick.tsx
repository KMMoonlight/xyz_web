import {IUser, IPermission, IEpisode} from "@/types/type.ts"
import { Headphones, MessageSquareText, CirclePlay } from 'lucide-react'

interface DiscoveryEditorPickItem {
    episode: IEpisode
    recentAudiences: IUser[]
    comment: {
        id: string
        type: string
        owner: {
            id: string
            type: string
        }
        author: IUser
        authorAssociation: string
        text: string
        isFriendly: boolean
        level: number
        likeCount: number
        liked: boolean
        collected: false
        createdAt: string
        status: string
        permissions: IPermission[]
        pid: string
        pinned: boolean
        isAuthorMuted: boolean
        ipLoc: string
        replyCount: number
    }
}


export default function DiscoveryEditorPick(props: {data: DiscoveryEditorPickItem[]}) {
    return (
        <>
            <div className="text-2xl ml-4 mt-4" style={{ color: '#25b4e1'}}>
                编辑精选
            </div>
            <div className="mt-2 flex flex-wrap gap-4 justify-start items-center">
                {
                    props.data.map((cell) => {
                        return (
                            <div key={cell.episode.eid} className="max-w-[420px] h-[194px] mx-4 rounded-md border border-neutral-100 shadow-sm">
                                <div className="flex justify-around mx-4 my-2">
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
                                <div className="bg-stone-100 ml-[80px] mr-2 rounded rounded-md p-2"
                                     title={cell.comment.text}>
                                    <div className="line-clamp-3 text-sm">
                                        {cell.comment.author.nickname}: {cell.comment.text}
                                    </div>
                                </div>
                                <div
                                    className="flex w-full pl-[80px] justify-between text-neutral-400 text-xs mt-2 pr-3">
                                    <div className="flex items-center">
                                        <div className="flex">
                                        {cell.recentAudiences.map((item) => {
                                                return (
                                                    <img src={item.avatar.picture.thumbnailUrl} key={item.uid}
                                                         alt="avatar"
                                                         className="w-[16px] h-[16px] mr-[1px] rounded-[8px]"/>
                                                )
                                            })}
                                        </div>
                                        <span className="ml-2">
                                                听过
                                            </span>
                                    </div>
                                    <div className="flex">
                                        <div className="flex items-center">
                                            <Headphones size={12}/>
                                            <span className="ml-1">
                                                {cell.episode.playCount}
                                            </span>
                                        </div>
                                        <div className="ml-4 flex items-center">
                                            <MessageSquareText size={12}/>
                                            <span className="ml-1">
                                                {cell.episode.commentCount}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}
