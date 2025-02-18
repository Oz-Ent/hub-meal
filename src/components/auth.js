import { auth } from "./firebase";

import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, updatePassword } from "firebase/auth";
//create user with email and password
export const doCreateUserWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
}
//sign in with email and password
export const doSignInWithEmailAndPassword = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
}
//sign out
export const doSignOut = () => {
    return auth.signOut();
}
//password reset
export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
}
//password update
export const doPasswordChange = (password) => {
    return updatePassword(auth.currentUser, password);
}