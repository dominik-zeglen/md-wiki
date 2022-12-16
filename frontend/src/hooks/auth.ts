import { useCallback } from "react";
import { atom, useRecoilState } from "recoil";
import { AppRouterOutputs } from "../../../backend/api";
import { trpc } from "./api/trpc";

export const userAtom = atom<AppRouterOutputs["auth"]["token"] | null>({
  default: undefined,
  key: "user",
  dangerouslyAllowMutability: true,
});
export const useAuthAtom = () => useRecoilState(userAtom);

export function useAuth() {
  const [user, setUser] = useAuthAtom();
  const { mutateAsync, isLoading } = trpc.auth.token.useMutation();

  const login = useCallback(
    ({ email, password }) => mutateAsync({ email, password }).then(setUser),
    []
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return {
    loading: isLoading,
    user,
    login,
    logout,
  };
}
