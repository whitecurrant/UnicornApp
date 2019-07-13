import { View, Text, Animated, Dimensions, Easing, StyleSheet, SafeAreaView } from "react-native";
import React, { Component } from 'react';
import { transform } from "@babel/core";
import { Icon, colors } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";

type State = {

}

const WINDOW_WIDTH = Dimensions.get('window').width;
const UNICORNS_ANIM_WIDTH = 200;

type Props = NavigationScreenProps<{ name: string }>

export class MainScene extends Component<Props, State> {

    unicornAnimation = new Animated.Value(WINDOW_WIDTH);

    startAnimation = () => {
        Animated.loop(Animated.timing(this.unicornAnimation, {
            duration: 7000,
            toValue: -UNICORNS_ANIM_WIDTH,
            useNativeDriver: true,
            easing: Easing.linear,
        })).start()
    }

    componentDidMount() {
        this.startAnimation()
    }

    renderUnicorns = () => {
        return <Animated.Text style={[styles.unicorns, { transform: [{ translateX: this.unicornAnimation }] }]}>
            🦄 🦄 🦄
        </Animated.Text >
    }

    render() {
        const name = this.props.navigation.getParam('name');
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Text style={styles.header}>{`Welcome ${name} to ​🦄 paradise`}</Text>
                    <View style={styles.buttonArea}>
                        <Icon name={'play-circle-filled'} size={64} iconStyle={{ color: 'pink' }} />
                        <Icon name={'pause-circle-filled'} size={64} iconStyle={{ color: 'violet' }} />
                    </View>
                    {this.renderUnicorns()}
                </View>
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
    },
    button: {
        margin: 64,
    },
    header: {
        fontSize: 26,
        fontWeight: '700',
        textAlign: 'center',
        margin: 16,
        marginVertical: 36,
        color: 'rgb(255,0,160)',
    },
    unicorns: {
        marginVertical: 16,
        fontSize: 40, width: UNICORNS_ANIM_WIDTH,
    }
})
