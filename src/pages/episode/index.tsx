import * as React from 'react'
import {useParams} from "react-router-dom";


const EpisodePage: React.FC = () => {

    const params = useParams()

    return (
        <>
            {params.episodeId}
        </>
    )
}


export default  EpisodePage
