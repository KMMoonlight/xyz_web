import {IImage} from "@/types/type"
import * as React from 'react'

interface DiscoverHeaderItem {
    id: string
    url: string
    leftImage: {
        images: IImage[]
        style: string
    }
    rightContent: {
        type: string
        text?: string
        image?: IImage
    }
    color: {
        light: string
        dark: string
    }
    backgroundImage?: IImage
}


 const DiscoveryHeader: React.FC<{data: DiscoverHeaderItem[]}> = (props: {data: DiscoverHeaderItem[]}) => {
    return (
        <>
            <div className="flex items-center mt-4 ml-4">
                {
                    props.data.map((cell) => HeaderItem(cell))
                }
            </div>
        </>
    )
}

function HeaderItem(item: DiscoverHeaderItem) {

    const color = item?.color?.dark ? item.color.dark === '#00000000' ? '#25b4e1' : item.color.dark : '#25b4e1'
    const colorWith30Opacity = hexToRgba(color, 0.3)
    const colorWith20Opacity = hexToRgba(color, 0.2)
    const colorWith10Opacity = hexToRgba(color, 0.1)

    return (
        <div key={item.id} style={{color, background: `linear-gradient(${colorWith30Opacity} 2%, ${colorWith20Opacity} 20%, ${colorWith10Opacity} 30%, #FFF 65%)` }} className="h-[30px] flex items-center border border-neutral-200 mr-2 px-2 rounded-sm cursor-pointer">
            {
                item.leftImage.images.map((cell) => {
                    return <img src={cell.thumbnailUrl} className="w-[12px] h-[12px] rounded mr-1" key={cell.thumbnailUrl} alt="logo"/>
                })
            }
            { item.rightContent.type === 'TEXT' ?  item.rightContent.text : '播客寻宝'}
        </div>
    )
}


function hexToRgba(hex: string, opacity: number) {
    // 移除 # 号并处理缩写格式
    let formattedHex = hex.replace(/^#/, '');
    if (formattedHex.length === 3) {
        formattedHex = formattedHex.split('').map(c => c + c).join('');
    }

    // 解析颜色通道
    const r = parseInt(formattedHex.substring(0, 2), 16);
    const g = parseInt(formattedHex.substring(2, 4), 16);
    const b = parseInt(formattedHex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`
}


export default DiscoveryHeader
