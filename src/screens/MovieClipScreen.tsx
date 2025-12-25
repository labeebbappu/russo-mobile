import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import BottomNavigation from "../components/BottomNavigation";
import {RouteProp, useRoute} from "@react-navigation/native";
import {useVideoPlayer, VideoView} from 'expo-video';
import {PRACTICE_VIDEOS} from "../data/PracticeVideos";
import Colors from "../theme/colors";

type RootStackParamList = {
    MovieClip: { id: string; title?: string };
};

type MovieClipRouteProp = RouteProp<RootStackParamList, 'MovieClip'>;

const MovieClipScreen = ({navigation}) => {
    const route = useRoute<MovieClipRouteProp>();
    const {id, title} = route.params;

    const videoItem = PRACTICE_VIDEOS.find(v => v.id === id);
    if (!videoItem) {
        return (
            <View style={styles.center}>
                <Text>Video not found.</Text>
            </View>
        );
    }

    const player = useVideoPlayer(videoItem.source.asset, (playerInstance) => {
        playerInstance.loop = false;
        playerInstance.play();
    });


    return (<>
            <View style={styles.container}>
                <Text style={styles.header}>{title ?? videoItem.title}</Text>
                <VideoView
                    style={styles.video}
                    player={player}
                    fullscreenOptions={
                        {
                            enable: true,
                        }
                    }
                    allowsPictureInPicture
                    nativeControls
                    contentFit="contain"
                />
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Practice', {
                    id: id
                })}>
                    <Text style={styles.primaryButtonText}>Practice</Text>
                </TouchableOpacity>
            </View>
            <BottomNavigation/>
        </>
    )
}

export default MovieClipScreen;


const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.offWhite, marginBottom: 100},
    header: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.charcoal,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    video: {
        backgroundColor: '#000',
        height: 600,
        width: '100%',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        borderRadius: 8,
        backgroundColor: Colors.russoGreen,
        marginTop: 8,
        paddingVertical: 12,
        width: '90%',
        alignSelf: 'center',
    },
    primaryButtonText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: 500,
        color: "white",
    },
});