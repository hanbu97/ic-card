// "use client";

// import createReActor from "@re-actor/core"
// import { canisterId, createActor } from "declarations/hello"
// import { AuthClient } from "@dfinity/auth-client";
// import { HttpAgent } from "@dfinity/agent";
// import { useEffect, useState } from "react";

// const { 
//   ReActorProvider, 
//   callActor, 
//   initialize, 
//   useReActor, 
//   useActorState, 
//   useActorMethod 
// } = createReActor(
//   agent => createActor(canisterId, { agent }),
//   { host: process.env.NEXT_PUBLIC_IC_HOST }
// );

// // 创建自定义钩子
// // const useCreateShop = () => useActorMethod("create_shop");
// // const useWhoAmI = () => useActorMethod("whoami");
// const useWhoAmI = () => {
//   const { call, data, loading, error } = useActorMethod("whoami");

//   return { callWhoAmI: call, principal: data, loading, error };
// };

// const useGetShops = () => {
//   const { call, data, loading, error } = useActorMethod("get_shops");

//   return { callGetShops: call, shops: data, loading, error };
// };

// const useCreateShop = () => {
//   const { call, loading, error } = useActorMethod("create_shop");

//   return { callCreateShop: call, loading, error };
// };

// // 创建自定义钩子处理登录
// const useLogin = () => {
//   const [authClient, setAuthClient] = useState<AuthClient | null>(null);

//   useEffect(() => {
//     const initAuthClient = async () => {
//       const newAuthClient = await AuthClient.create();
//       setAuthClient(newAuthClient);
//     };

//     initAuthClient();
//   }, []);

//   const handleLogin = async () => {
//     if (authClient) {
//       await new Promise<void>((resolve) => {
//         authClient.login({
//           identityProvider: process.env.DFX_NETWORK === "ic"
//               ? "https://identity.ic0.app"
//               : `http://localhost:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai`,
//           onSuccess: () => resolve(),
//         });
//       });

//       const identity = authClient.getIdentity();
//       initialize(identity); // 使用新的身份初始化
//     }
//   };

//   return { authClient, handleLogin };
// };


// export {
//   ReActorProvider,
//   callActor,
//   initialize,
//   useReActor,
//   useActorState,
//   useWhoAmI,
//   useGetShops,
//   useLogin,
//   useCreateShop
// };

