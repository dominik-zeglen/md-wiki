import { Auth } from "@aws-amplify/auth";
import { useCallback, useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";
import { config } from "../../awsConfig";

Auth.configure({
  mandatorySignIn: true,
  region: config.cognito.REGION,
  userPoolId: config.cognito.USER_POOL_ID,
  identityPoolId: config.cognito.IDENTITY_POOL_ID,
  userPoolWebClientId: config.cognito.APP_CLIENT_ID,
});

const userAtom = atom<Record<"email" | "sub", string> | null>({
  default: undefined,
  key: "user",
  dangerouslyAllowMutability: true,
});
const useUserAtom = () => useRecoilState(userAtom);

export function useCognito() {
  const [user, setUser] = useUserAtom();
  const [loading, setLoading] = useState(!user);

  const refetch = useCallback(async () => {
    setLoading(true);

    try {
      const result = await Auth.currentAuthenticatedUser();

      setUser(result.attributes);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);

    const result = await Auth.signIn(email, password);

    setLoading(false);
    setUser(result.attributes);
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);

    await Auth.signOut();

    setLoading(false);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!user) {
      refetch();
    }
  }, []);

  return {
    loading,
    user,
    login,
    logout,
    refetch,
  };
}
