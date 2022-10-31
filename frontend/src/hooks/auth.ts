import { Auth, CognitoUser } from "@aws-amplify/auth";
import { useCallback, useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";

const config = {
  apiGateway: {
    REGION: process.env.REACT_APP_REGION,
    URL: process.env.REACT_APP_API_URL,
  },
  cognito: {
    REGION: process.env.REACT_APP_REGION,
    USER_POOL_ID: process.env.REACT_APP_USER_POOL_ID,
    APP_CLIENT_ID: process.env.REACT_APP_USER_POOL_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.REACT_APP_IDENTITY_POOL_ID,
  },
};
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
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useUserAtom();

  const refetch = useCallback(async () => {
    setLoading(true);

    const result = await Auth.currentUserInfo();

    setLoading(false);
    setUser(result.attributes);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);

    const result = await Auth.signIn(email, password);

    setLoading(false);
    setUser(result.attributes);
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);

    const result = await Auth.signOut();

    setLoading(false);
    setUser(null);
  }, []);

  useEffect(() => {
    refetch();
  }, []);

  return {
    loading,
    user,
    login,
    logout,
    refetch,
  };
}
