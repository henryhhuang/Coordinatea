import { useCookies } from 'react-cookie';

export const useAuthToken = () => {
    const [cookies, setCookie, removeCookie] = useCookies(["authToken"]);

    const setAuthToken = (authToken) => setCookie("authToken", authToken);

    const removeAuthToken = () => removeCookie("authToken");

    return [cookies["authToken"], setAuthToken, removeAuthToken];
};
