import { IUser } from "@/store/modules/auth.store";

class AuthService {
  async signIn(data: Partial<IUser>) {
    const abortController = new AbortController();
    try {
      const signInCall = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: abortController.signal,
      });

      const signInResponse = await signInCall.json();

      if (signInResponse?.user?.id) {
        localStorage.setItem(
          "zitrusArtisan:user",
          JSON.stringify(signInResponse?.user)
        );
        return { data: signInResponse?.user };
      } else {
        throw signInResponse;
      }
    } catch (error) {
      console.error(error);
      return { data: null, error };
    }
  }
  signOut() {
    localStorage.removeItem("zitrusArtisan:user");
  }
  async register(data: Partial<IUser>) {
    const abortController = new AbortController();
    try {
      const signInCall = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: abortController.signal,
      });

      const signInResponse = await signInCall.json();

      if (signInCall.ok) {
        localStorage.setItem(
          "zitrusArtisan:user",
          JSON.stringify(signInResponse)
        );
        return { data: signInResponse };
      } else {
        throw signInResponse;
      }
    } catch (error) {
      console.log(error);
      return { data: null, error };
    }
  }
}

export default new AuthService();
