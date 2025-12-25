// PracticeScreen.tsx
import React, {useRef, useState, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import {CameraView, CameraType, useCameraPermissions, useMicrophonePermissions} from 'expo-camera';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {PRACTICE_VIDEOS} from '../data/PracticeVideos';

type RootStackParamList = {
    Practice: { id: string };
};

type PracticeRouteProp = RouteProp<RootStackParamList, 'Practice'>;

const PracticeScreen: React.FC = () => {
    const route = useRoute<PracticeRouteProp>();
    const navigation = useNavigation<any>();
    const {id} = route.params;

    const videoItem = PRACTICE_VIDEOS.find((v) => v.id === id);

    const cameraRef = useRef<CameraView>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [micPermission, requestMicPermission] = useMicrophonePermissions();
    const [facing, setFacing] = useState<CameraType>('front');

    useEffect(() => {
        (async () => {
            if (!cameraPermission?.granted) await requestCameraPermission();
            if (!micPermission?.granted) await requestMicPermission();
        })();
    }, []);

    if (!videoItem) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Video not found.</Text>
            </View>
        );
    }

    if (!cameraPermission || !micPermission) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }

    if (!cameraPermission.granted || !micPermission.granted) {
        return (
            <View style={styles.center}>
                <Text style={styles.permissionText}>
                    Camera and microphone permissions are required.
                </Text>
                <TouchableOpacity
                    style={styles.permissionButton}
                    onPress={() => {
                        requestCameraPermission();
                        requestMicPermission();
                    }}
                >
                    <Text style={styles.permissionButtonText}>Grant Permissions</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleStartRecording = async () => {
        if (!cameraRef.current || isRecording) return;
        setIsRecording(true);

        try {
            const video = await cameraRef.current.recordAsync(); 
            console.log('Recorded video URI:', video.uri);
            // navigation.navigate('ReviewAttempt', { videoUri: video.uri, targetText: videoItem.title });
        } catch (e) {
            console.error('Recording error:', e);
        } finally {
            setIsRecording(false);
        }
    };

    const handleStopRecording = () => {
        if (cameraRef.current && isRecording) {
            cameraRef.current.stopRecording();
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing={facing}
                mode="video"
            >
                <View style={styles.promptOverlay}>
                    <Text style={styles.promptText}>{videoItem.title}</Text>
                    <Text style={styles.promptSubtext}>Say this line!</Text>
                </View>
                <View style={styles.controls}>
                    {!isRecording ? (
                        <TouchableOpacity style={styles.recordButton} onPress={handleStartRecording}>
                            <View style={styles.recordButtonInner}/>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.stopButton} onPress={handleStopRecording}>
                            <View style={styles.stopButtonInner}/>
                        </TouchableOpacity>
                    )}
                </View>
            </CameraView>
        </View>
    );
};

export default PracticeScreen;

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#000'},
    center: {flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000'},
    camera: {flex: 1},
    promptOverlay: {
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    promptText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
    },
    promptSubtext: {
        fontSize: 14,
        color: '#ccc',
        marginTop: 4,
    },
    controls: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    recordButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    recordButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#ff4444',
    },
    stopButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stopButtonInner: {
        width: 30,
        height: 30,
        backgroundColor: '#ff4444',
    },
    errorText: {fontSize: 16, color: '#fff'},
    permissionText: {fontSize: 16, color: '#fff', textAlign: 'center', paddingHorizontal: 24},
    permissionButton: {
        marginTop: 16,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#007AFF',
        borderRadius: 8,
    },
    permissionButtonText: {fontSize: 16, color: '#fff', fontWeight: '600'},
});
