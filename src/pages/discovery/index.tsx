import { api, request } from '@/utils/index'
import {useEffect, useMemo, useState} from "react"
import CommonSkeleton from '@/components/CommonSkeleton'
import DiscoveryEditorPick from "./components/DiscoveryEditorPick"
import DiscoveryHeader from "./components/DiscoveryHeader"
import DiscoveryEpisodeRecommend from "./components/DiscoveryEpisodeRecommend";
import * as React from 'react'

const DiscoveryPage: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const [discoveryData, setDiscoveryData] = useState<any>({})


    const queryDiscoveryData = () => {
        setLoading(true)
        api.apiDiscoveryFeedList().then((res) => {
            setDiscoveryData(res)
        }).catch((e) => {
            if (e.status === 401) {
              request.reCallOn401(queryDiscoveryData)
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        queryDiscoveryData()
    }, [])

    const editorPickData = useMemo(() => {
        const result = discoveryData?.data?.find((cell: any) => cell.type === 'EDITOR_PICK')
        return result ? result.data.picks : []
    }, [discoveryData])

    const headerData = useMemo(() => {
        const result = discoveryData?.data?.find((cell: any) => cell.type === 'DISCOVERY_HEADER')
        return result ? result.data : []
    }, [discoveryData])

    const recommendData = useMemo(() => {
        const result = discoveryData?.data?.find((cell: any) => cell.type === 'DISCOVERY_EPISODE_RECOMMEND')
        return result ? result.data : {target: []}
    }, [discoveryData])


    return (
        <>
            <div className="w-full flex flex-col items-center">
                { loading ? <div className="mt-4"><CommonSkeleton length={3}/></div> : (
                    <>
                        <DiscoveryHeader data={headerData}/>
                        <DiscoveryEpisodeRecommend data={recommendData}/>
                        <DiscoveryEditorPick data={editorPickData}/>
                    </>
                )}
            </div>
        </>
    )
}


export default  DiscoveryPage




