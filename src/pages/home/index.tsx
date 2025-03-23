import DiscoveryPage from "@/pages/discovery/index"
import Search from '@/pages/search/index'
import RankPage from '@/pages/rank/index'
import * as React from 'react'

 const HomePage: React.FC = () => {
    return (
        <>
            <Search />
            <DiscoveryPage />
            <RankPage/>
        </>
    )
}


export default HomePage