"use client";

import { makeAutoObservable } from "mobx";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId, createActor } from "declarations/hello";
import { makePersistable } from "mobx-persist-store";

interface Shop {
  name: string;
}

class AuthStore {
    isAuthenticated = false;
    principal: string | null = null;
    whoamiActor: any = null; // 替换为具体的 Actor 类型
    shops: Shop[] = [];
    selectedTab: string = 'Customer'; 

    constructor() {
        makeAutoObservable(this);
        makePersistable(this, {
        name: 'AuthStore',
        properties: ['isAuthenticated', 'principal', 'shops', 'whoamiActor', 'selectedTab'], // 持久化的属性
        storage: localStorage, // 使用 localStorage 进行持久化
        });
    }

  login = async () => {
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
          this.isAuthenticated = true;
          this.principal = principal;
          this.whoamiActor = actor;
          resolve();
        },
        onError: (err) => {
          console.error('Login failed:', err);
          reject(err);
        }
      });
    });
  };

  logout = async () => {
    const client = await AuthClient.create();
    await client.logout();
    this.isAuthenticated = false;
    this.principal = null;
    this.whoamiActor = null;
  };

  handleCreateShop = async (shopName: string) => {
    if (this.whoamiActor && this.isAuthenticated) {
      try {
        await this.whoamiActor.create_shop(shopName);
        // 假设 create_shop 方法成功执行后会返回更新的商店列表
        const updatedShops = await this.whoamiActor.get_shops();
        this.shops = updatedShops;
      } catch (error) {
        console.error("Error creating shop:", error);
        // 在此处理错误
      }
    } else {
      console.error("Not authenticated or actor not initialized");
    }
  };
  

  whoami = async () => {
    if (this.whoamiActor) {
      try {
        const response = await this.whoamiActor.whoami();
        this.principal = response.principal;
      } catch (error) {
        console.error("Error calling whoami:", error);
        // 在此处理错误
      }
    } else {
      console.error("Actor not initialized");
    }
  };
  

  getShops = async () => {
    if (this.whoamiActor) {
      try {
        const shops = await this.whoamiActor.get_shops();
        this.shops = shops;
      } catch (error) {
        console.error("Error calling get_shops:", error);
        // 在此处理错误
      }
    } else {
      console.error("Actor not initialized");
    }
  };

  setSelectedTab = (tab: string) => {
    this.selectedTab = tab; // 直接更新状态
  };
}

export const authStore = new AuthStore();
