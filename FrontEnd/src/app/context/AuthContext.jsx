import { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        token: null,
        user: null,
        loading: true
    });

    // Initialiser l'état d'auth depuis localStorage
    useEffect(() => {
        const initAuth = () => {
            const token = localStorage.getItem("authToken");
            const userStr = localStorage.getItem("currentUser");

            if (token && token !== "undefined" && token !== "null") {
                try {
                    const user = userStr ? JSON.parse(userStr) : null;
                    setAuthState({
                        isAuthenticated: true,
                        token,
                        user,
                        loading: false
                    });
                } catch {
                    // Si erreur de parsing, nettoyer
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("currentUser");
                    localStorage.removeItem("authTokenTime");
                    setAuthState({
                        isAuthenticated: false,
                        token: null,
                        user: null,
                        loading: false
                    });
                }
            } else {
                setAuthState({
                    isAuthenticated: false,
                    token: null,
                    user: null,
                    loading: false
                });
            }
        };

        initAuth();
    }, []);

    // Fonction pour se connecter
    const login = useCallback((token, user) => {
        localStorage.setItem("authToken", token);
        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("authTokenTime", Date.now().toString());

        setAuthState({
            isAuthenticated: true,
            token,
            user,
            loading: false
        });
    }, []);

    // Fonction pour se déconnecter
    const logout = useCallback(() => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("authTokenTime");

        setAuthState({
            isAuthenticated: false,
            token: null,
            user: null,
            loading: false
        });
    }, []);

    // Fonction pour mettre à jour l'utilisateur
    const updateUser = useCallback((user) => {
        localStorage.setItem("currentUser", JSON.stringify(user));
        setAuthState(prev => ({
            ...prev,
            user
        }));
    }, []);

    const value = {
        ...authState,
        login,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
