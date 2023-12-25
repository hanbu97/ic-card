import React from 'react';
import { useAuthStore } from 'service/auth';
// import { useLogin, useWhoAmI } from 'service/hello'; // 确保路径正确

const AuthSection = () => {
    // const { authClient, handleLogin } = useLogin();
    // const { callWhoAmI, principal, loading, error } = useWhoAmI();

    const { login, whoami, principal, isAuthenticated } = useAuthStore();

    const handleLogin = async () => {
        await login();
    };

    const handleWhoAmI = async () => {
        await whoami();
    };

    // return (
    //     <main>
    //         <button onClick={handleLogin} disabled={loading}>Login!</button>
    //         <br />
    //         <button onClick={callWhoAmI} disabled={!authClient || loading}>Who Am I</button>
    //         {loading && <p>Loading...</p>}
    //         {/* {error && <p>Error: {String(error)}</p>} */}
    //         {principal && <section>Principal: {principal}</section>}
    //     </main>
    // );
    return (
        <main>
            <button onClick={handleLogin} disabled={isAuthenticated}>Login!</button>
            <br />
            <button onClick={handleWhoAmI} disabled={!isAuthenticated}>Who Am I</button>
            {principal && <section>Principal: {principal}</section>}
        </main>
    );
};

export default AuthSection;
