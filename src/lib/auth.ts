import Cookies from 'js-cookie';
import { MerchantInfo } from '@/types';

const TOKEN_KEY = 'fusionxpay_admin_token';
const USER_KEY = 'fusionxpay_admin_user';

export const auth = {
  setToken(token: string) {
    Cookies.set(TOKEN_KEY, token, { expires: 1 }); // Expires in 1 day
  },

  getToken(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    return Cookies.get(TOKEN_KEY);
  },

  removeToken() {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USER_KEY);
  },

  setUser(user: MerchantInfo) {
    Cookies.set(USER_KEY, JSON.stringify(user));
  },

  getUser(): MerchantInfo | null {
    if (typeof window === 'undefined') return null;
    const user = Cookies.get(USER_KEY);
    if (!user) return null;
    try {
      return JSON.parse(user) as MerchantInfo;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};
