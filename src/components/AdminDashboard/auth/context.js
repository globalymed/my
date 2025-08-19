import React, { createContext, useContext, useEffect, useState } from 'react';

import { onAuthStateChange, signOut as firebaseSignOut } from '../../../firebase.js';


// Define the shape of our AuthContext
const AuthContext = createContext({
    user: null, // Stores the authenticated user object (Firebase User + admin data)
    loading: true, // Indicates if authentication state is still being determined
    signOut: async () => { }, // Function to sign out the user
});

/**
 * Custom hook to consume the AuthContext.
 * Throws an error if used outside of an AuthProvider.
 * @returns {{user: Object|null, loading: boolean, signOut: () => Promise<void>}}
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

/**
 * Provides the authentication context to its children.
 * Initializes Firebase authentication state listener.
 * @param {Object} { children } - React children to be rendered within the provider.
 */
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Subscribe to Firebase auth state changes
        const unsubscribe = onAuthStateChange((currentUser) => {
            setUser(currentUser);
            setLoading(false); // Authentication state has been determined
        });

        // Cleanup the subscription on component unmount
        return unsubscribe;
    }, []); // Empty dependency array ensures this runs once on mount

    // Memoized signOut function to prevent unnecessary re-renders
    const signOut = async () => {
        await firebaseSignOut();
    };

    const value = {
        user,
        loading,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;