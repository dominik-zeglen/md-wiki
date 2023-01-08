import { atom, useRecoilState } from "recoil";

const layout = atom({
  default: {
    loading: false,
  },
  key: "layout",
});
export const useLayout = () => useRecoilState(layout);

export * from "./Panel";
export * from "./Site";
