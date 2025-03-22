import {Skeleton} from "@/components/ui/skeleton"


interface PropsType {
    length: number
    cellLength?: number
}


export default function CommonSkeleton({length, cellLength=3}: PropsType) {
    return (
        <>
            { new Array(length).fill(1).map((_, index) => <SkeletonCell key={index} length={cellLength!}/>) }
        </>
    )
}


function SkeletonCell(props: {length: number}) {
    return (
        <div className="flex items-center w-full justify-around pt-2">
            {
                new Array(props.length).fill(1).map((_, index) => {
                    return (
                        <div key={index} className="flex flex-col space-y-3 w-[24%]">
                            <Skeleton className="h-[125px] w-full rounded-xl"/>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full"/>
                                <Skeleton className="h-4 w-full"/>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}