
import React, { Component } from 'react';
import { SafeAreaView, View, StyleSheet, LayoutAnimation, KeyboardAvoidingView } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { NavigationScreenProps } from 'react-navigation';
import { Routes } from './Routes';
import { Colors } from './Colors';
import { debounce } from 'lodash';

const VALIDATION = {
    email: {
        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'Invalid email format',
    },
    password: {
        pattern: /^[a-zA-z0-9]{6,}$/,
        message: 'At least 6 characters, letters or numbers',
    },
    name: {
        pattern: /^[a-zA-z]*$/,
        message: 'Only letters allowed'
    }
}


type State = {
    email?: string;
    password?: string;
    name?: string;

    isEmailInvalid?: boolean;
    isPasswordInvalid?: boolean;
    isNameInvalid?: boolean;

    isEmailErrorVisible?: boolean;
    isPasswordErrorVisible?: boolean;
    isNameErrorVisible?: boolean;
}
const TYPING_VALIDATION_TIMEOUT = 500;

export class SignupScene extends Component<NavigationScreenProps, State> {

    state: State = {}

    componentDidUpdate() {
        LayoutAnimation.easeInEaseOut();
    }


    checkEmailError = debounce(() =>
        this.setState(({ isEmailInvalid }) => ({ isEmailErrorVisible: isEmailInvalid })), TYPING_VALIDATION_TIMEOUT)
    checkPasswordError = debounce(() => this.setState(({ isPasswordInvalid }) => ({ isPasswordErrorVisible: isPasswordInvalid })), TYPING_VALIDATION_TIMEOUT);

    checkNameError = debounce(() => this.setState(({ isNameInvalid }) => ({ isNameErrorVisible: isNameInvalid })), TYPING_VALIDATION_TIMEOUT);

    onEmailChange = (email: string) => this.setState({ email, isEmailInvalid: !VALIDATION.email.pattern.test(email), isEmailErrorVisible: false }, this.checkEmailError);

    onPasswordChange = (password: string) => this.setState({ password, isPasswordInvalid: !VALIDATION.password.pattern.test(password), isPasswordErrorVisible: false }, this.checkPasswordError)

    onNameChange = (name: string) => this.setState({ name, isNameInvalid: !VALIDATION.name.pattern.test(name), isNameErrorVisible: false }, this.checkNameError)

    onRegister = () => {
        this.props.navigation.navigate({
            routeName: Routes.Main,
            params: {
                name: this.state.name
            }
        })
    }

    render() {
        const { email,
            password, name,
            isEmailInvalid, isPasswordInvalid, isNameInvalid, isEmailErrorVisible,
            isPasswordErrorVisible, isNameErrorVisible
        } = this.state;
        const emailErrorMsg = isEmailErrorVisible ? VALIDATION.email.message : '';
        const passwordErrorMsg = isPasswordErrorVisible ? VALIDATION.password.message : '';
        const nameErrorMsg = isNameErrorVisible ? VALIDATION.name.message : '';
        const registerDisabled = !email || !name || !password || isEmailInvalid || isNameInvalid || isPasswordInvalid;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView style={styles.body}>
                    <Input
                        label={'Email'}
                        placeholder={'your.email@unicorn.land'}
                        onChangeText={this.onEmailChange}
                        value={email}
                        errorMessage={emailErrorMsg}
                        errorStyle={styles.error}
                        containerStyle={styles.input}
                    />
                    <Input
                        label={'Password'}
                        placeholder={'password'}
                        secureTextEntry={true}
                        value={password}
                        onChangeText={this.onPasswordChange}
                        errorMessage={passwordErrorMsg}
                        errorStyle={styles.error}
                        containerStyle={styles.input}

                    />
                    <Input
                        label={'Name'}
                        placeholder={'Your name'}
                        value={name}
                        onChangeText={this.onNameChange}
                        errorMessage={nameErrorMsg}
                        errorStyle={styles.error}
                        containerStyle={styles.input}
                    />
                    <Button title={'Register'}
                        disabled={registerDisabled}
                        onPress={this.onRegister}
                        containerStyle={styles.buttonArea}
                        buttonStyle={[styles.button, styles.buttonFilled]}
                    />

                    <Button title={'Login'}
                        type="outline"
                        // disabled={registerDisabled} 
                        onPress={this.onRegister}
                        containerStyle={styles.buttonArea}
                        buttonStyle={styles.button}
                        titleStyle={{ color: Colors.unicorn }}
                    />
                </KeyboardAvoidingView>
            </SafeAreaView>)
    }

}

const styles = StyleSheet.create({
    input: {
        marginVertical: 8,
    },
    error: {
        marginHorizontal: 0,
        color: Colors.unicorn
    },
    body: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 32,
    },
    buttonArea: {
        marginVertical: 16,
        marginHorizontal: 4,
    },
    button: {
        borderColor: Colors.unicorn,
        borderRadius: 8,
        height: 48
    },
    buttonFilled: {
        backgroundColor: Colors.unicorn,
    }
});
