import * as React from 'react'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IPodcast } from '@/types/type';
import { api, request } from '@/utils/index'
import CommonSkeleton from '@/components/CommonSkeleton';
import { Button } from '@/components/ui/button';

const PodcastPage: React.FC = () => {

  const { podcastId } = useParams();
  const [podcast, setPodcast] = useState<IPodcast | null>(null);
  const [loading, setLoading] = useState<boolean>(false)

  const queryPodcastDetail = () => {
    if (podcastId) {
      setLoading(true)
      api.apiPodcastDetail({ pid: podcastId}).then((res) => {
        setPodcast(res.data)
      }).catch((e) => {
        if (e.status === 401) {
          request.reCallOn401(queryPodcastDetail);
        }
      }).finally(() => {
        setLoading(false)
      })
    }
  }

  useEffect(() => {
    queryPodcastDetail()
  }, [])


  return (
    <div className='mt-4 w-[480px]'>
      { loading ? <CommonSkeleton  length={3} /> : (
        <div>
          <div className='text-3xl font-bold'>
            {podcast?.title}
          </div>
          <div className="flex mt-4">
            <div className='flex-1 flex flex-col justify-between'>
              <div className='text-neutral-400 line-clamp-3 text-sm' title={podcast?.description}>
                {podcast?.description}
              </div>
              <div className='flex items-center'>
                { podcast?.podcasters.map((cell) => {
                  return (
                    <div className="flex items-center mt-2 mr-4" key={cell.uid}>
                      <img src={cell?.avatar?.picture?.thumbnailUrl} className="w-[24px] h-[24px] rounded" alt="logo"/>
                      <div className='text-neutral-400 text-xs ml-1'>
                        {cell?.nickname}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <img src={podcast?.image?.picUrl} className="w-[96px] h-[96px] rounded ml-2" alt="logo"/>
          </div>
          
          <div className='mt-4 flex justify-between items-center'>
            <div className='flex items-baseline'>
              <span className=''>
                {podcast?.subscriptionCount} 
              </span>
              <span className="text-neutral-400 text-xs ml-2">
                订阅
              </span>
            </div>

            <Button variant="outline" style={{ borderColor: '#ebb434', color: '#ebb434' }}>
              <span style={{ color: '#ebb434' }}>
                { podcast?.subscriptionStatus === 'ON' ? '已订阅' : '未订阅'}
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}



export default PodcastPage