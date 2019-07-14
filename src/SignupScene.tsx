
import React, { Component } from 'react';
import { SafeAreaView, Text, StyleSheet, LayoutAnimation, KeyboardAvoidingView } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { NavigationScreenProps, NavigationActions } from 'react-navigation';
import { Routes } from './Routes';
import { Colors } from './Colors';
import { debounce } from 'lodash';
import { registerUser, loginUser } from './AuthService';

const VALIDATION = {
    email: {
        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'Invalid email format',
    },
    password: {
        pattern: /^[a-zA-z0-9]{6,}$/,
        message: 'At least 6 characters of letters or numbers',
    },
    name: {
        pattern: /^[a-zA-z]*$/,
        message: 'Only letters are allowed'
    }
}
const TYPING_VALIDATION_TIMEOUT = 800;

enum Mode {
    LOGIN,
    REGISTER
}

type State = {

    mode: Mode;
    email?: string;
    password?: string;
    name?: string;

    isEmailFormatInvalid?: boolean;
    isPasswordFormatInvalid?: boolean;
    isNameFormatInvalid?: boolean;

    isEmailErrorVisible?: boolean;
    isPasswordErrorVisible?: boolean;
    isNameErrorVisible?: boolean;

    authError?: string;

}

export class SignupScene extends Component<NavigationScreenProps, State> {

    state: State = { mode: Mode.REGISTER }

    componentDidUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    checkEmailError = debounce(() =>
        this.setState(({ isEmailFormatInvalid }) => ({ isEmailErrorVisible: isEmailFormatInvalid })), TYPING_VALIDATION_TIMEOUT);

    checkPasswordError = debounce(() => this.setState(({ isPasswordFormatInvalid, mode }) => ({
        isPasswordErrorVisible: mode === Mode.REGISTER && isPasswordFormatInvalid
    })), TYPING_VALIDATION_TIMEOUT);

    checkNameError = debounce(() => this.setState(({ isNameFormatInvalid }) => ({
        isNameErrorVisible: isNameFormatInvalid
    })), TYPING_VALIDATION_TIMEOUT);

    onEmailChange = (email: string) => this.setState({
        email,
        isEmailFormatInvalid: !VALIDATION.email.pattern.test(email),
        isEmailErrorVisible: false,
        authError: undefined
    }, this.checkEmailError);

    onPasswordChange = (password: string) => this.setState({
        password,
        isPasswordFormatInvalid: !VALIDATION.password.pattern.test(password),
        isPasswordErrorVisible: false,
        authError: undefined
    }, this.checkPasswordError)

    onNameChange = (name: string) => this.setState({
        name,
        isNameFormatInvalid: !VALIDATION.name.pattern.test(name),
        isNameErrorVisible: false
    }, this.checkNameError)

    onRegisterRequested = () => {
        registerUser(this.state.name!, this.state.email!, this.state.password!)
            .then(() =>
                this.props.navigation.reset([NavigationActions.navigate({
                    routeName: Routes.Main,
                    params: {
                        name: this.state.name
                    }
                })], 0)).catch((authError: string) => { this.setState({ authError }) })
    }

    onLoginRequested = () => {
        loginUser(this.state.email!, this.state.password!)
            .then((name) =>
                this.props.navigation.reset([NavigationActions.navigate({
                    routeName: Routes.Main,
                    params: { name }
                })], 0)).catch((authError: string) => { this.setState({ authError }) })
    }

    onLoginModeSelected = () =>
        this.setState({ mode: Mode.LOGIN });

    onRegisterModeSelected = () =>
        this.setState({ mode: Mode.REGISTER });

    render() {
        const {
            email,
            password,
            name,
            isEmailFormatInvalid,
            isPasswordFormatInvalid,
            isNameFormatInvalid,
            isEmailErrorVisible,
            isPasswordErrorVisible,
            isNameErrorVisible,
            mode,
        } = this.state;
        const emailErrorMsg = isEmailErrorVisible ? VALIDATION.email.message : '';
        const passwordErrorMsg = isPasswordErrorVisible ? VALIDATION.password.message : '';
        const nameErrorMsg = isNameErrorVisible ? VALIDATION.name.message : '';
        const registerDisabled = !email || !name || !password || isEmailFormatInvalid || isNameFormatInvalid || isPasswordFormatInvalid;
        const loginDisabled = !email || !password || isEmailFormatInvalid;

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView style={styles.body}>
                    <Input
                        label={'Email'}
                        autoCompleteType={'email'}
                        labelStyle={styles.label}
                        placeholder={'your.email@parad.ise'}
                        onChangeText={this.onEmailChange}
                        value={email}
                        inputStyle={styles.input}
                        errorMessage={emailErrorMsg}
                        errorStyle={styles.error}
                        containerStyle={styles.inputContainer}
                    />
                    <Input
                        labelStyle={styles.label}
                        label={'Password'}
                        placeholder={'Your password'}
                        secureTextEntry={true}
                        value={password}
                        inputStyle={styles.input}
                        onChangeText={this.onPasswordChange}
                        errorMessage={passwordErrorMsg}
                        errorStyle={styles.error}
                        containerStyle={styles.inputContainer}

                    />
                    {this.state.authError && <Text
                        style={[styles.error, { marginHorizontal: 4 }]}>
                        {this.state.authError}
                    </Text>}
                    {mode === Mode.REGISTER &&
                        <>
                            <Input
                                label={'Name'}
                                labelStyle={styles.label}
                                placeholder={'Your name'}
                                value={name}
                                inputStyle={styles.input}
                                onChangeText={this.onNameChange}
                                errorMessage={nameErrorMsg}
                                errorStyle={styles.error}
                                containerStyle={styles.inputContainer}
                            />
                            <Button title={'Register'}
                                disabled={registerDisabled}
                                onPress={this.onRegisterRequested}
                                containerStyle={styles.buttonArea}
                                buttonStyle={[styles.button, styles.buttonFilled]}
                            />
                            <Button title={'Login'}
                                type="outline"
                                onPress={this.onLoginModeSelected}
                                containerStyle={styles.buttonArea}
                                buttonStyle={styles.button}
                                titleStyle={{ color: Colors.unicorn }}
                            />
                        </>
                    }
                    {mode === Mode.LOGIN &&
                        <>
                            <Button
                                title={'Login'}
                                disabled={loginDisabled}
                                onPress={this.onLoginRequested}
                                containerStyle={styles.buttonArea}
                                buttonStyle={[styles.button, styles.buttonFilled]}
                            />
                            <Button
                                title={'I don\'t have an account'}
                                type="outline"
                                onPress={this.onRegisterModeSelected}
                                containerStyle={styles.buttonArea}
                                buttonStyle={styles.button}
                                titleStyle={{ color: Colors.unicorn }}
                            />
                        </>
                    }
                </KeyboardAvoidingView>
            </SafeAreaView>)
    }
}

const styles = StyleSheet.create({
    inputContainer: {
        marginVertical: 8,
    },
    input: {
        fontSize: 13
    },
    error: {
        marginHorizontal: 0,
        color: 'tomato'
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
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.unicorn,

    }
});
