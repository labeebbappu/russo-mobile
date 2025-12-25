import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {PRACTICE_VIDEOS, PracticeVideo} from "../data/PracticeVideos";
import BottomNavigation from "../components/BottomNavigation";
import {useEffect, useState} from "react";
import * as VideoThumbnails from 'expo-video-thumbnails';
import {Asset} from 'expo-asset';

const PracticeLibraryScreen = ({navigation}) => {
    type VideoWithThumb = PracticeVideo & { thumbnailUri?: string };
    const [videos, setVideos] = useState<VideoWithThumb[]>([]);

    const handlePressItem = (item: VideoWithThumb) => {
        navigation.navigate('MovieClip', {
            id: item.id,
            title: item.title,
            source: item.source,
        });
    };
    useEffect(() => {
        const loadThumbnails = async () => {
            const updated: VideoWithThumb[] = [];

            for (const item of PRACTICE_VIDEOS) {
                try {
                    const asset = Asset.fromModule(item.source.asset); // require(...) [web:85]
                    await asset.downloadAsync(); // ensures localUri is available
                    const sourceUri = asset.localUri ?? asset.uri;

                    const {uri} = await VideoThumbnails.getThumbnailAsync(sourceUri, {
                        time: 1500,
                    }); // [web:98]

                    updated.push({...item, thumbnailUri: uri});
                } catch (e) {
                    console.warn('Thumbnail error for', item.id, e);
                    updated.push(item);
                }
            }

            setVideos(updated);
        };

        loadThumbnails();
    }, []);

    const renderItem = ({item}: { item: PracticeVideo }) => (
        <TouchableOpacity style={styles.card} onPress={() => handlePressItem(item)}>
            {item.thumbnailUri ? (
                <Image source={{uri: item.thumbnailUri}} style={styles.thumbnail}/>
            ) : (
                <View style={styles.thumbnail}/>
            )}
            <View style={styles.cardContent}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description} numberOfLines={2}>
                    {item.description}
                </Text>
            </View>
        </TouchableOpacity>
    );
    return (<><View style={styles.container}>
        <FlatList
            data={videos}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
        />
    </View>
        <BottomNavigation/>
    </>)
}

export default PracticeLibraryScreen;

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#fff', paddingVertical: 10},
    header: {
        fontSize: 22,
        fontWeight: '600',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    card: {
        flexDirection: 'row',
        borderRadius: 8,
        backgroundColor: '#f7f7f7',
        marginBottom: 12,
        overflow: 'hidden',
    },
    thumbnail: {
        width: 100,
        height: 70,
        backgroundColor: '#ddd',
    },
    cardContent: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    description: {
        fontSize: 13,
        color: '#555',
        marginTop: 2,
    },
    level: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },
});