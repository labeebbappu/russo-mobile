export type PracticeVideo = {
    id: string;
    title: string;
    description: string;
    level: 'A1' | 'A2' | 'B1' | 'B2';
    source: { type: 'asset'; asset: number };
    thumbnailUri?: string;
};

export const PRACTICE_VIDEOS: PracticeVideo[] = [
    {
        id: 'trip-1',
        title: 'Trip – Information',
        description: 'Friend talking about his trip',
        level: 'A2',
        source: {type: 'asset', asset: require('../../assets/videos/BicycleTrip.mp4')},
    },
    {
        id: 'motivation-1',
        title: 'Motivation',
        description: 'Telling someone about life',
        level: 'B1',
        source: {type: 'asset', asset: require('../../assets/videos/motivation.mp4')},
    },
    {
        id: 'friends-1',
        title: "Friends Series",
        description: 'Friends series short',
        level: 'B2',
        source: {type: 'asset', asset: require('../../assets/videos/friends_1.mp4')},
    },
    {
        id: 'quote-1',
        title: "Quote",
        description: "Quote about love",
        level: 'B2',
        source: {type: 'asset', asset: require('../../assets/videos/quote_1.mp4')},
    }
]