import { jwtDecode } from "jwt-decode";
import { disconnectSocket } from "../../utils/socket";


class TokenService {
  static setToken(token: string, persist: boolean = true): void {
    // Always set in sessionStorage for the current session/tab
    sessionStorage.setItem("token", token);
    
    // Only set in localStorage if persistence is requested (standard login)
    if (persist) {
      localStorage.setItem("token", token);
    }
    
    window.dispatchEvent(new Event("token-change"));
  }

  static getToken(): string | null {
    // Prioritize sessionStorage (impersonated or temporary session)
    // Fallback to localStorage (persisted admin/user session)
    return sessionStorage.getItem("token") || localStorage.getItem("token");
  }

  static decodeToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<any>(token);

      return decoded;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  }

  static getRole(): string | null {
    return this.decodeToken()?.role || null;
  }

  static getMemberId(): string | null {
    const decoded: any = this.decodeToken();
    return decoded?.Member_id || decoded?.memberId || decoded?.id || null;
  }

  static getUserId(): string | null {
    const decoded: any = this.decodeToken();
    return decoded?.id || decoded?.Member_id || decoded?.memberId || null;
  }

  static removeToken(): void {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    disconnectSocket();
    window.dispatchEvent(new Event("token-change"));
  }
}

export default TokenService;
