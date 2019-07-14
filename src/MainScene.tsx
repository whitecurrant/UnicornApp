import { NativeModules } from 'react-native';
import React, { Component } from 'react';
import { Animated, Dimensions, Easing, SafeAreaView, StyleSheet, Text, View, Platform } from 'react-native';
import { Button, colors, Icon } from 'react-native-elements';
import { NavigationActions, NavigationScreenProps, StackActions } from 'react-navigation';
const Alert = NativeModules.NativeAlert;

import {
    MediaStates,
    Player,
    Recorder
} from '@react-native-community/audio-toolkit';
import { Colors } from './Colors';
import { Routes } from './Routes';


const WINDOW_WIDTH = Dimensions.get('window').width;
const UNICORNS_ANIM_WIDTH = 200;
const UNICORNS_ANIM_PASS_DURATION = 7000;

type Props = NavigationScreenProps<{ name: string }>

enum PlaybackState {
    PLAYING,
    PAUSED,
    STOPPED
}

type State = {
    playback: PlaybackState,
}

export class MainScene extends Component<Props, State> {

    state = { playback: PlaybackState.STOPPED }
    player = new Player('https://www.dropbox.com/s/zrl1jsdk29qdv5r/Pink%20Fluffy%20Unicorns%20Dancing%20on%20Rainbows%20-%20Fluffle%20Puff%20.mp3?dl=1', { autoDestroy: false })

    unicornAnimation = new Animated.Value(0);
    animationValue = 0;

    componentDidMount() {
        this.player.looping = Platform.select({
            ios: true,
            android: false
        })
        this.player.prepare();
        this.unicornAnimation.addListener(({ value }) => this.animationValue = value)
    }

    componentWillUnmount() {
        this.player.destroy();
    }

    togglePlay = () => {
        console.log('isplaying', this.player.isPlaying)

        this.player.playPause((error, paused) => {
            if (error) {
                console.log('error', error)
                // report playback error
                return this.onStopped();
            }
            if (paused) {
                console.log('stop animation');
                this.unicornAnimation.stopAnimation();
            } else {
                if (this.state.playback === PlaybackState.STOPPED) {
                    console.log('restart animation');
                    this.restartAnimation();
                } else {
                    console.log('resume animation');
                    this.resumeAnimation()
                }
            }
            this.setState({ playback: paused ? PlaybackState.PAUSED : PlaybackState.PLAYING })

        }).on('ended', this.onStopped);
    }

    onStopped = () => {
        this.unicornAnimation.stopAnimation();
        this.unicornAnimation.setValue(0);
        this.setState({ playback: PlaybackState.STOPPED })
    }

    stop = () => this.player.stop(this.onStopped);

    logout = () => {
        this.stop();
        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: Routes.Signup })]
        }))
        Alert.show('You have been logged out');
    }


    resumeAnimation = () => {
        const remaindingTime = UNICORNS_ANIM_PASS_DURATION - this.animationValue * UNICORNS_ANIM_PASS_DURATION;
        Animated.timing(this.unicornAnimation, {
            duration: remaindingTime,
            toValue: 1,
            useNativeDriver: true,
            easing: Easing.linear,
        }).start(({ finished }) => finished && this.restartAnimation());
    }

    restartAnimation = () => {
        this.unicornAnimation.setValue(0);
        Animated.loop(Animated.timing(this.unicornAnimation, {
            duration: UNICORNS_ANIM_PASS_DURATION,
            toValue: 1,
            useNativeDriver: true,
            easing: Easing.linear,
        })).start()
    }

    renderUnicorns = () => {
        const translateX = this.unicornAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [WINDOW_WIDTH, - UNICORNS_ANIM_WIDTH]
        })
        return (
            <Animated.Text style={[styles.unicorns, { transform: [{ translateX }] }]}>
                🦄 🦄 🦄
        </Animated.Text>)
    }

    render() {
        const name = this.props.navigation.getParam('name');
        const toggleIcon = this.state.playback !== PlaybackState.PLAYING ? <Icon name={'play-circle-filled'} size={64} iconStyle={{ color: Colors.unicorn }} />
            : <Icon name={'pause-circle-filled'} size={64} iconStyle={{ color: Colors.unicorn }} />
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Text style={styles.header}>{`Welcome ${name} to ​🦄 paradise`}</Text>
                    <View style={styles.buttonArea}>
                        <Button
                            buttonStyle={styles.controlButton}
                            onPress={this.togglePlay}
                            icon={toggleIcon} />
                        <Button
                            buttonStyle={[styles.controlButton, styles.stopButton]}
                            disabled={this.state.playback === PlaybackState.STOPPED}
                            disabledStyle={{ opacity: 0.5 }}
                            onPress={this.stop}
                            icon={<Icon name={'stop'} size={36} iconStyle={{ color: 'white' }} />
                            } />

                    </View>
                    {this.renderUnicorns()}
                </View>
                <Button title={'Logout'}
                    type='outline'
                    // disabled={registerDisabled} 
                    onPress={this.logout}
                    containerStyle={{
                        marginHorizontal: 32,
                    }}
                    buttonStyle={{ borderColor: Colors.unicorn }}
                    titleStyle={{ color: Colors.unicorn }}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0.6,
        justifyContent: 'space-around'
    },
    buttonArea: {
        marginHorizontal: 32,
        marginVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    controlButton: {
        backgroundColor: 'transparent'
    },
    header: {
        fontSize: 26,
        fontWeight: '700',
        textAlign: 'center',
        margin: 16,
        marginVertical: 36,
        color: Colors.unicorn,
    },
    unicorns: {
        marginVertical: 16,
        fontSize: 40, width: UNICORNS_ANIM_WIDTH,
    },
    stopButton: {
        borderRadius: 48,
        backgroundColor: 'violet'
    }
})
