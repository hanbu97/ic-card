"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'

import { AuthClient } from "@dfinity/auth-client";
import { canisterId, createActor } from "declarations/hello";

interface AuthState {
  isAuthenticated: boolean;
  principal: string | null;
  whoamiActor: any; // 替换为具体的 Actor 类型
  shops: Shop[]; // 商店列表
  login: () => Promise<void>;
  logout: () => Promise<void>;
  handleCreateShop: (shopName: string) => Promise<void>;
  whoami: () => Promise<void>;
  getShops: () => Promise<void>;
}

interface Shop {
    name: string;
    // 添加更多商店属性
  }

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  principal: null,
  whoamiActor: null,
  shops: [],
  login: async () => {
    const client = await AuthClient.create();
    await new Promise<void>((resolve, reject) => {
      client.login({
        identityProvider: process.env.DFX_NETWORK === "ic"
            ? "https://identity.ic0.app"
            : `http://localhost:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai`,
        onSuccess: () => {
          const identity = client.getIdentity();
          const principal = identity.getPrincipal().toString();
          const actor = createActor(canisterId, { agentOptions: { identity } });
          set({ isAuthenticated: true, principal, whoamiActor: actor });
          resolve();
        },
        onError: (err) => {
          console.error('Login failed:', err);
          reject(err);
        }
      });
    });
  },
  logout: async () => {
    const client = await AuthClient.create();
    await client.logout();
    set({ isAuthenticated: false, principal: null, whoamiActor: null });
  },
  handleCreateShop: async (shopName: string) => {
    const { whoamiActor } = get();
    if (whoamiActor && get().isAuthenticated) {
      // 假设 create_shop 是合约中的方法
      await whoamiActor.create_shop(shopName);
      // 可以在这里处理响应，例如更新状态或通知用户
    } else {
      console.error("Not authenticated or actor not initialized");
    }
  },
  whoami: async () => {
    const { whoamiActor } = get();
    if (whoamiActor) {
      try {
        const response = await whoamiActor.whoami();
        // 假设 response 是一个包含用户信息的对象
        set({ principal: response.principal });
      } catch (error) {
        console.error("Error calling whoami:", error);
        // 可以在这里处理错误，例如设置错误状态
      }
    } else {
      console.error("Actor not initialized");
    }
  },
  getShops: async () => {
    const { whoamiActor } = get();
    if (whoamiActor) {
      try {
        const shops = await whoamiActor.get_shops();
        set({ shops });
      } catch (error) {
        console.error("Error calling get_shops:", error);
        // 可以在这里处理错误，例如设置错误状态
      }
    } else {
      console.error("Actor not initialized");
    }
  },
}));
