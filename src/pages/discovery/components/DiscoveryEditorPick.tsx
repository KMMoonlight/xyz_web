
interface DiscoveryEditorPickItem {
    episode: {
        type: string
        eid: string
        pid: string
        shownotes: string
        description: string
        image: {
            picUrl: string
            largePicUrl: string
            middlePicUrl: string
            smallPicUrl: string
            thumbnailUrl: string
        }
        enclosure: {
            url: string
        }
        isPrivateMedia: boolean
        mediaKey: string
        media: {
            id: string
            size: number
            mimeType: string
            source: {
                mode: string
                url: string
            }
        }
        clapCount: number
        commentCount: number
        pubDate: string
        status: string
        duration: number
        podcast: {
            type: string
            pid: string
            title: string
            author: string
            brief: string
            description: string
            subscriptionCount: number
            image: {
                picUrl: string
                width: number
                height: number
                format: string
                thumbnailUrl: string
                smallPicUrl: string
                middlePicUrl: string
                largePicUrl: string
            }
            color: {
                original: string
                light: string
                dark: string
            }
            hasTopic: boolean
            topicLabels: string[]
            syncMode: string
            episodeCount: number
            latestEpisodePubDate: string
            subscriptionPush: boolean
            subscriptionPushPriority: string
            subscriptionStar: boolean
            status: string
            permissions: {
                name: string
                status: string
            }[]
            payType: string
            payEpisodeCount: number
            podcasters: {
                type: string
                uid: string
                avatar: {
                    picture: {
                        picUrl: string
                        largePicUrl: string
                        middlePicUrl: string
                        smallPicUrl: string
                        thumbnailUrl: string
                        format: string
                        width: number
                        height: number
                    }
                }
                nickname: string
                isNicknameSet: boolean
                bio: string
                gender: string
                isCancelled: boolean
                ipLoc: string
                relation: string
                isBlockedByViewer: boolean
            }[]
            hasPopularEpisodes: boolean
            contacts: {
                type: string
                name: string
                url?: string
                note?: string
            }[]
            isCustomized: boolean
            showZhuiguangIcon: boolean
        }
        isPlayed: boolean
        isFinished: boolean
        isPicked: boolean
        isFavorited: boolean
    }
}








export default function DiscoveryEditorPick() {




}
