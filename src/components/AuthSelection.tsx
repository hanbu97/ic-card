import React, { useState, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
import { useActorMethod, initialize } from "../service/hello"; // 引入 initialize 函数
import { createActor, hello } from "declarations/hello";

const AuthSection = () => {
    const [authClient, setAuthClient] = useState<AuthClient | null>(null);
    const { call: whoAmI, data: principal, loading, error } = useActorMethod("whoami");

    useEffect(() => {
        const initAuthClient = async () => {
            const newAuthClient = await AuthClient.create();
            setAuthClient(newAuthClient);
        };

        initAuthClient();
    }, []);

    const handleLogin = async () => {
        if (authClient) {
            await new Promise<void>((resolve) => {
                authClient.login({
                    identityProvider: process.env.DFX_NETWORK === "ic"
                        ? "https://identity.ic0.app"
                        : `http://localhost:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai`,
                    onSuccess: () => resolve(),
                });
            });

            const identity = authClient.getIdentity();
            initialize(identity); // 使用新的身份初始化

            // 重新初始化全局 actor 实例
            const agent = new HttpAgent({ identity });
            const canisterId = process.env.CANISTER_ID_HELLO;

            if (!canisterId) {
                throw new Error("CANISTER_ID_HELLO environment variable is not defined.");
            }

            const newActor = createActor(canisterId, { agent });
            // 这里可能不需要显式设置 actor，因为 initialize 应该已经更新了全局状态
        }
    };

    return (
        <main>
            <button onClick={handleLogin} disabled={loading}>Login!</button>
            <br />
            <button onClick={() => whoAmI()} disabled={!authClient || loading}>Who Am I</button>
            {loading && <p>Loading...</p>}
            {/* {error && <p>Error: {String(error)}</p>} */}
            {principal && <section>Principal: {principal}</section>}
        </main>
    );
};

export default AuthSection;
