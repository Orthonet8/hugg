import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../context/useAuthStore";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";
const BACKEND_BASE = API_BASE.replace(/\/+$/, "").replace(/\/api$/, "");

export const GoogleAuthCallbackPage = () => {
  const navigate = useNavigate();
  const loginWithToken = useAuthStore((s) => s.loginWithToken);
  const [error, setError] = useState("");
  const hasHandledCallback = useRef(false);

  useEffect(() => {
    if (hasHandledCallback.current) return;
    hasHandledCallback.current = true;

    let cancelled = false;

    const finishAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token") ?? "";
      const callbackError = params.get("error") ?? "";
      const hasCodeFlowParams = params.has("code") || params.has("state") || params.has("scope");

      if (!hasCodeFlowParams && window.location.search !== "") {
        window.history.replaceState(null, "", window.location.pathname);
      }

      if (callbackError !== "") {
        if (!cancelled) setError(callbackError);
        return;
      }

      // If Google redirects to frontend with OAuth code, forward it to backend callback
      // so backend can exchange the code and return here with a token.
      if (token === "" && hasCodeFlowParams) {
        const query = params.toString();
        window.location.href = `${BACKEND_BASE}/auth/google/callback${query ? `?${query}` : ""}`;
        return;
      }

      if (token === "") {
        if (!cancelled) setError("Google sign in failed. Missing token.");
        return;
      }

      try {
        await loginWithToken(token);
        if (!cancelled) {
          const user = useAuthStore.getState().user;
          const needsRegistration = !user?.christianName || !user?.campus;
          navigate(needsRegistration ? "/register/basic-info" : "/news", { replace: true });
        }
      } catch (e) {
        if (!cancelled) {
          const message = e instanceof Error ? e.message : "Failed to complete Google sign in.";
          setError(message);
        }
      }
    };

    void finishAuth();

    return () => {
      cancelled = true;
    };
  }, [loginWithToken, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 text-center shadow-lg">
        {error ? (
          <>
            <h2 className="text-lg font-semibold text-red-700">Google sign in failed</h2>
            <p className="mt-2 text-sm text-[color:var(--text-muted)]">{error}</p>
            <button
              type="button"
              onClick={() => navigate("/login", { replace: true })}
              className="mt-4 rounded-lg bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-[color:var(--on-primary)]"
            >
              Back to login
            </button>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-[color:var(--primary)]" />
            <p className="mt-3 text-sm text-[color:var(--text-muted)]">Signing you in with Google...</p>
          </>
        )}
      </div>
    </div>
  );
};
