import { useCallback, useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import { AppRouterInputs, AppRouterOutputs } from "@api";
import { trpc } from "./api/trpc";

export const userAtom = atom<AppRouterOutputs["auth"]["token"]["user"] | null>({
  default: undefined,
  key: "user",
  dangerouslyAllowMutability: true,
});
export const useUserAtom = () => useRecoilState(userAtom);

export const authAtom = atom<string | null>({
  default: localStorage.getItem("token"),
  key: "token",
  dangerouslyAllowMutability: true,
});
export const useAuthAtom = () => useRecoilState(authAtom);

export function useAuth() {
  const [user, setUserInAtom] = useUserAtom();
  const [token, setTokenInAtom] = useAuthAtom();

  const setUser = useCallback(
    (userResponse: AppRouterOutputs["auth"]["token"]) => {
      setTokenInAtom(userResponse.token);
      setUserInAtom(userResponse.user);
      localStorage.setItem("token", userResponse.token);
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setTokenInAtom(null);
    setUserInAtom(null);
  }, []);

  const { mutateAsync, isLoading: isLoadingToken } =
    trpc.auth.token.useMutation();
  const { refetch: fetchMe, isFetching: isLoadingMe } = trpc.auth.me.useQuery(
    null,
    {
      refetchOnMount: false,
      enabled: false,
      onError: (err) => {
        if (err.data?.code === "UNAUTHORIZED") {
          logout();
        }
      },
      onSuccess: (me) => {
        setUser({
          token: token!,
          user: me,
        });
      },
    }
  );

  const login = useCallback(
    (variables: AppRouterInputs["auth"]["token"]) =>
      mutateAsync(variables).then(setUser),
    []
  );

  useEffect(() => {
    if (token && !user) {
      fetchMe();
    }
  }, []);

  return {
    loading: isLoadingToken || isLoadingMe,
    user,
    login,
    logout,
    refetch: fetchMe,
  };
}
