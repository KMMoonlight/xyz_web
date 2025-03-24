import * as React from 'react'
import {Link, Outlet} from "react-router-dom"
import {useEffect, useMemo, useState} from "react"
import cosmos from '@/assets/cosmos.svg'
import {Layers, User} from "lucide-react"
import {storage} from "@/utils"
import {useNavigate} from "react-router"


const pageTitleMap: Record<string, string> = {
    home: '发现',
    subscription: '订阅',
    user: '个人'
}


const BuildIconWithTitle: React.FC<{title: string, alias: string, navigate?: boolean}> = React.memo(({title, alias , navigate = false}) => {
    const useClass = navigate ? 'text-sm flex items-center' : 'text-3xl flex items-center'

    const iconSize = navigate ? 16 : 32

    const icon = title === 'home' ? <img src={cosmos as string} style={{ width: iconSize, height: iconSize}} alt="cosmos"/> : title === 'subscription' ? <Layers color="#25b4e1" size={iconSize}/> : <User color="#25b4e1" size={iconSize}/>

    return (
        <div className={useClass}>
            { icon }
            <span className="ml-2">
               { alias }
            </span>
        </div>
    )
})


const NavigatorBar: React.FC<{changeCurrentTab: (cell: string) => void}> = React.memo(({changeCurrentTab}) => {
    return (
        <>
            { Object.keys(pageTitleMap).map((cell)=> {
                return (
                    <Link key={cell} to={`/overview/${cell}`} onClick={() => changeCurrentTab(cell)} className="mr-4 text-sm">
                        <div className="flex">
                            <BuildIconWithTitle title={cell} alias={pageTitleMap[cell]} navigate={true}/>
                        </div>
                    </Link>
                )
            })}
        </>
    )
})





const OverviewPage: React.FC = () => {
    const [currentTab, setCurrentTab] = useState<string>('home')
    const navigate = useNavigate()

    const nowTitle = useMemo(() => {
        return pageTitleMap[currentTab]
    }, [currentTab])

    const changeCurrentTab = (tab: string) => {
        setCurrentTab(tab)
    }


    const checkPermission = () => {
        const access = storage.getStorageItem('XJikeAccessToken') && storage.getStorageItem('XJikeRefreshToken')
        if (!access) {
            navigate('/login', {replace: true})
        }
    }

    useEffect(() => {
        checkPermission()
    }, []);


    return (
        <>
            <div className="w-full flex flex-col items-center justify-center relative">
                <div className="w-full pl-[25%] pr-[25%] h-[70px] flex items-center justify-between sticky top-0 bg-white z-[9999] border-b shadow-sm">
                    <BuildIconWithTitle title={currentTab} alias={nowTitle}/>
                    <div className="flex">
                        <NavigatorBar changeCurrentTab={changeCurrentTab}/>
                    </div>
                </div>
                <Outlet/>
            </div>

        </>
    )
}


export default OverviewPage
