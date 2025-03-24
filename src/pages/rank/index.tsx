import {useEffect, useMemo, useState} from "react"
import CommonSkeleton from "@/components/CommonSkeleton"
import {api, request} from "@/utils/index"
import {IEpisode, IRankListItem} from "@/types/type"
import RankList from './components/RankList'
import * as React from 'react'

enum TOP_CATEGORY {
    HOT_EPISODES_IN_24_HOURS = 'HOT_EPISODES_IN_24_HOURS',
    SKYROCKET_EPISODES = 'SKYROCKET_EPISODES',
    NEW_STAR_EPISODES = 'NEW_STAR_EPISODES'
}

type ITabDataList = { type: TOP_CATEGORY, data: IRankListItem}[]

const RankPage: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false)

    const [currentTab, setCurrentTab] = useState<TOP_CATEGORY>(TOP_CATEGORY.HOT_EPISODES_IN_24_HOURS)

    const [tabDataList, setTabDataList] = useState<ITabDataList>([])

    const queryTopListData = (tab: TOP_CATEGORY) => {
        setLoading(true)
        api.apiGetRankList({category: tab}).then((res) => {
            setTabDataList((val) => {
                return val.concat({
                    type: tab,
                    data: res.data
                })
            })
        }).catch((e) => {
            if (e.status === 401) {
                request.reCallOn401(queryTopListData, tab)
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    const changeTab = (tab: TOP_CATEGORY) => {
      setCurrentTab(tab)
    }

    useEffect(() => {
        queryTopListData(TOP_CATEGORY.HOT_EPISODES_IN_24_HOURS)
        queryTopListData(TOP_CATEGORY.SKYROCKET_EPISODES)
        queryTopListData(TOP_CATEGORY.NEW_STAR_EPISODES)
    }, [])


    const tabData = useMemo(() => {
        return tabDataList.find((cell) => cell.type == currentTab)?.data || null
    }, [currentTab, tabDataList])


    const headerBg = useMemo(() => {
        return tabData?.background ? {
            backgroundImage: `url(${tabData.background})`,
            backgroundSize: 'contain'
        } : {}
    }, [tabData])


    return (
        <div className="w-full flex flex-col items-center mt-10">
            <div className="flex items-center justify-around w-[600px] h-[140px] pt-[70px]" style={headerBg}>
                <div className="flex flex-col justify-center cursor-pointer" onClick={() => changeTab(TOP_CATEGORY.HOT_EPISODES_IN_24_HOURS)}>
                    <span className="text-2xl" style={{color: '#25b4e188'}}>
                        小宇宙
                    </span>
                    <span className="text-2xl" style={{color: '#25b4e1'}}>
                        最热榜
                    </span>
                </div>
                <div className="flex flex-col justify-center cursor-pointer" onClick={() => changeTab(TOP_CATEGORY.SKYROCKET_EPISODES)}>
                    <span className="text-2xl" style={{color: '#25b4e188'}}>
                        小宇宙
                    </span>
                    <span className="text-2xl" style={{color: '#25b4e1'}}>
                        锋芒榜
                    </span>
                </div>
                <div className="flex flex-col justify-center cursor-pointer" onClick={() => changeTab(TOP_CATEGORY.NEW_STAR_EPISODES)}>
                    <span className="text-2xl" style={{color: '#25b4e188'}}>
                        小宇宙
                    </span>
                    <span className="text-2xl" style={{color: '#25b4e1'}}>
                        新星榜
                    </span>
                </div>
            </div>
            <div className="flex items-center justify-between w-[600px] mt-2">
                <div className="h-[4px] w-[190px] rounded" style={{backgroundColor: `${currentTab === TOP_CATEGORY.HOT_EPISODES_IN_24_HOURS ? '#25b4e1' : '#e8eced'}`}}/>
                <div className="h-[4px] w-[190px] rounded" style={{backgroundColor: `${currentTab === TOP_CATEGORY.SKYROCKET_EPISODES ? '#25b4e1' : '#e8eced'}`}}/>
                <div className="h-[4px] w-[190px] rounded" style={{backgroundColor: `${currentTab === TOP_CATEGORY.NEW_STAR_EPISODES ? '#25b4e1' : '#e8eced'}`}}/>
            </div>
            <RankListWrapper loading={loading} data={{data: tabData?.items || [], publishDate: tabData?.publishDate || ''}}/>
        </div>
    )
}

interface RankListWrapperProps {
    loading: boolean
    data: {
        data: {
            item: IEpisode
        }[]
        publishDate: string
    }
}

const RankListWrapper: React.FC<RankListWrapperProps> = (props: RankListWrapperProps) => {
    const pubDateObj = props.data.publishDate ? new Date(props.data.publishDate) : null
    let pubDateStr = ''

    if (pubDateObj) {
        const year = pubDateObj.getFullYear()
        const month = pubDateObj.getMonth() + 1 < 10 ? `0${pubDateObj.getMonth() + 1}` : pubDateObj.getMonth() + 1
        const day = pubDateObj.getDate() < 10 ? `0${pubDateObj.getDate()}` : pubDateObj.getDate()
        pubDateStr = `${year}/${month}/${day}`
    }

    return (
        <>
            {props.loading ? <CommonSkeleton length={3} cellLength={1}/> : (
                <>
                    <span className="text-sm text-neutral-400 mt-2">最近更新: {pubDateStr}</span>
                    <RankList data={props.data.data}/>
                </>
            )}
        </>
    )
}

export default RankPage
