import { AuthProvider } from "@refinedev/core";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const authProvider: AuthProvider = {
    check: async () => {
        const token = localStorage.getItem("my_access_token");

        return { authenticated: Boolean(token) }
    },
    login: async ({ email, password }): Promise<{ success: boolean, user?: any }> => {
        const auth = getAuth()
        console.log(email, password, 'EVO')
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        if (userCredential) {
            const user = userCredential.user
            const token = await user.getIdToken();
            localStorage.setItem("my_access_token", token);
            return { success: true, user }
        }
        return { success: false }
    },
    logout: async () => {
        localStorage.removeItem("my_access_token");
        return { success: true };
    },
    onError: async (error) => { throw new Error("Not implemented"); },
};