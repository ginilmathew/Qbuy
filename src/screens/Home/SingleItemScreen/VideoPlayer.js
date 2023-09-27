import { StyleSheet, Text, View, Button, useWindowDimensions, Platform } from 'react-native'
import React, { memo, useState, useCallback, useRef, useEffect } from 'react'
import YoutubePlayer from "react-native-youtube-iframe";
import reactotron from 'reactotron-react-native';

const VideoPlayer = ({videoId, selected, index}) => {


    const { width } = useWindowDimensions()

    const videoRef = useRef(null)

    
    useEffect(() => {
        if(selected !== index){
            setPlaying((prev) => !prev);
        }
    }, [selected])
    
    

    const [playing, setPlaying] = useState(false);

    const onStateChange = useCallback((state) => {
        if (state === "ended") {
            videoRef?.current?.seekTo(0)
            setTimeout(() => {
                setPlaying(false);
            }, 500);
        }
        else if(state === "playing"){
            setPlaying((prev) => !prev);
        }
    }, []);

    const togglePlaying = useCallback(() => {
        setPlaying((prev) => !prev);
    }, []);


    return (
        <View style={{ height: 500, width: width, padding: 0  }}>
            <YoutubePlayer
                ref={videoRef}
                height={400}
                webViewStyle={{opacity: 0.99}}
                webViewProps={{
                    renderToHardwareTextureAndroid: true,
                    androidLayerType: Platform.OS === 'android' && Platform.Version <= 22 ? 'hardware' : 'none',
                }}
                play={playing}
                videoId={videoId}
                onChangeState={onStateChange}
                initialPlayerParams={{
                    loop: false,
                    preventFullScreen: true,
                    controls: false,
                    showClosedCaptions: false
                }}
            />
            {/* <Button title={playing ? "pause" : "play"} onPress={togglePlaying} /> */}
        </View>
    )
}

export default memo(VideoPlayer)

const styles = StyleSheet.create({})