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

    constructor() {
        makeAutoObservable(this);
        makePersistable(this, {
        name: 'AuthStore',
        properties: ['isAuthenticated', 'principal', 'shops', 'whoamiActor'], // 持久化的属性
        storage: localStorage, // 使用 localStorage 进行持久化
        });
    }

//   constructor() {
//     makeAutoObservable(this);
//   }

  login = async () => {
    const client = await AuthClient.create();
    await new Promise<void>((resolve, reject) => {
      client.login({
        // 登录逻辑
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
  
}

export const authStore = new AuthStore();
