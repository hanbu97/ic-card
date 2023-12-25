"use client";

import { makeAutoObservable } from "mobx";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId, createActor } from "declarations/hello";
import { makePersistable } from "mobx-persist-store";
import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE } from "declarations/hello/hello.did";

interface Shop {
  name: string;
}

class AuthStore {
    isAuthenticated = false;
    principal: string | null = null;
    whoamiActor: ActorSubclass<_SERVICE> | null = null;
    shops: Shop[] = [];
    selectedTab: string = 'Customer'; 
    authClient: AuthClient | null = null;

    constructor() {
        makeAutoObservable(this);

        if (typeof window !== 'undefined') {
          makePersistable(this, {
            name: 'AuthStore',
            properties: ['isAuthenticated', 'principal', 'shops', 'whoamiActor', 'selectedTab', 'authClient'], // 持久化的属性
            storage: localStorage, 
            });
        }
      
        this.initAuthClient();
    }

    async initAuthClient() {
      this.authClient = await AuthClient.create();
    }

  login = async () => {
    await new Promise<void>((resolve, reject) => {
      this.authClient!.login({
        identityProvider: process.env.DFX_NETWORK === "ic"
        ? "https://identity.ic0.app"
        : `http://localhost:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai`,
        onSuccess: () => {
          const identity = this.authClient!.getIdentity();
          const principal = identity.getPrincipal().toString();
          const actor: ActorSubclass<_SERVICE> = createActor(canisterId, { agentOptions: { identity } });
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
    if (this.authClient != null) {
      await this.authClient?.logout();
    }
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
    console.log(this.whoamiActor!.whoami);

    if (this.whoamiActor) {
      try {
        const response = await this.whoamiActor!.whoami();
        this.principal = response;
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
