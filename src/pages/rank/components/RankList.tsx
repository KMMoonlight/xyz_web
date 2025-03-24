import {IEpisode} from "@/types/type"
import {CirclePlay} from "lucide-react"
import * as React from 'react'

const RankList: React.FC<{data: {item: IEpisode}[]}> = (props: {data: {item: IEpisode}[]}) => {
    return (
        <div className="w-[600px]">
            {
                props.data.map((item, index) => {
                    const cell = item.item
                    return (
                        <div key={cell.eid} className="flex items-center mt-4 h-[70px]">
                            <div className="flex justify-center w-[50px] ml-2 text-neutral-600">
                                {index + 1}
                            </div>
                            <div className="flex flex-1 items-center ml-4 mr-4 h-full">
                                <img src={cell?.image?.thumbnailUrl || cell.podcast.image.thumbnailUrl} className="w-[64px] h-[64px] rounded" alt="logo"/>
                                <div className="flex flex-col ml-4 justify-between h-full">
                                    <div className="line-clamp-2 cursor-pointer" title={cell.title}>
                                        {cell.title}
                                    </div>
                                    <div className="text-sm text-neutral-400 mb-[1px]">
                                        {cell.podcast.title}
                                    </div>
                                </div>
                            </div>
                            <div className="w-[50px] mr-2">
                                <CirclePlay color="#25b4e1" size={32} className="cursor-pointer"/>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}


export default RankList
