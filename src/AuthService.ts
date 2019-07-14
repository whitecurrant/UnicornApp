import * as Keychain from 'react-native-keychain';

const AuthError = {
    credentials: 'Wrong credentials',
    userExists: 'Such user already exists, please log in instead',
    userNotFound: 'User not found',
    unknown: 'Unkown error'
}

export const registerUser = (name: string, email: string, password: string) =>  new Promise(async (resolve, reject) => {
  try {
    const existingCredentials = await Keychain.getGenericPassword({service: email});
    if (existingCredentials){
        return reject(AuthError.userExists);
    }
    await Keychain.setGenericPassword(name, password, {service: email});
    resolve();
  } catch (error) {
    reject(AuthError.unknown);
  }
});

export const loginUser = (email: string, password: string) =>  new Promise(async (resolve, reject) => {
  try {
    const existingCredentials = await Keychain.getGenericPassword({service: email});
    if (!existingCredentials){
       return reject(AuthError.userNotFound);
    }
    if (password == (existingCredentials as any).password){
        resolve((existingCredentials as any).username);
    } else {
        reject(AuthError.credentials);
    }
  } catch (error) {
    reject(AuthError.unknown);
  }
});
