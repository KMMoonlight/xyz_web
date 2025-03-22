import DiscoveryPage from "@/pages/discovery/index"
import Search from '@/pages/search/index'
import RankPage from '@/pages/rank/index'

export default function HomePage() {
    return (
        <>
            <Search />
            <DiscoveryPage />
            <RankPage/>
        </>
    )
}
