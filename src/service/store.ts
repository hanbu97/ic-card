// import {create} from 'zustand';

// interface AppState {
//   selectedTab: string;
//   setSelectedTab: (tab: string) => void;
// }

// const useStore = create<AppState>((set) => ({
//   selectedTab: 'Customer',
//   setSelectedTab: (tab: string) => set({ selectedTab: tab }),
// }));

// export default useStore;

import { create } from 'zustand';

interface AppState {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const useStore = create<AppState>((set, get) => ({
//   selectedTab: localStorage.getItem('selectedTab') || 'Customer', // 从本地存储读取或使用默认值
  selectedTab: 'Customer', // 从本地存储读取或使用默认值
  setSelectedTab: (tab: string) => {
    // localStorage.setItem('selectedTab', tab); // 更新本地存储
    set({ selectedTab: tab });
  },
}));

export default useStore;
