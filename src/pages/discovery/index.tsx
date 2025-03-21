import { api, request } from '@/utils/index'
import {useEffect, useState} from "react"
import { Skeleton } from "@/components/ui/skeleton"


export default function DiscoveryPage() {

    const [loading, setLoading] = useState<boolean>(false)

    const queryDiscoveryData = () => {
        setLoading(true)
        api.apiDiscoveryFeedList().then((res) => {
            console.log('res', res)
        }).catch((e) => {
            if (e.status === 401) {
              request.reCallOn401(queryDiscoveryData)
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        //queryDiscoveryData()
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])

    return (
        <>
            <div className="w-full h-full">
                { loading ? <DiscoverySkeleton/> : 'Discovery'}
            </div>
        </>
    )
}



function DiscoverySkeleton() {
    return (
        <>
            { new Array(5).fill(1).map((_, index) => <SkeletonCell key={index}/>) }
        </>
    )
}


function SkeletonCell() {
    return (
        <div className="flex items-center w-full justify-around pt-2">
            <div className="flex flex-col space-y-3 w-[24%]">
                <Skeleton className="h-[125px] w-full rounded-xl"/>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-full"/>
                </div>
            </div>

            <div className="flex flex-col space-y-3 w-[24%]">
                <Skeleton className="h-[125px] w-full rounded-xl"/>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-full"/>
                </div>
            </div>

            <div className="flex flex-col space-y-3 w-[24%]">
                <Skeleton className="h-[125px] w-full rounded-xl"/>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-full"/>
                </div>
            </div>

            <div className="flex flex-col space-y-3 w-[24%]">
                <Skeleton className="h-[125px] w-full rounded-xl"/>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-full"/>
                </div>
            </div>
        </div>
    )
}
