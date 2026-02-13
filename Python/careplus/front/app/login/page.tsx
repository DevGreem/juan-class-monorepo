"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { login, signUp, verifyOtp } from "@/lib/api";
import Image from "next/image";

export default function LoginPage() {
  const { setToken } = useAuth();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 2FA state
  const [needs2FA, setNeeds2FA] = useState(false);
  const [userId, setUserId] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newDigits = [...otpDigits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setOtpDigits(newDigits);
    if (pasted.length > 0) {
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        const result = await signUp(email, password);
        if (result.success && result.requires_verification) {
          setSuccessMsg(result.message || "Cuenta creada. Revisa tu correo para confirmar tu cuenta.");
          setIsSignUp(false);
        } else if (result.success && result.token) {
          setToken(result.token);
          router.push("/");
        }
      } else {
        const result = await login(email, password);
        if (result.success && result.requires_verification && result.user_id) {
          setNeeds2FA(true);
          setUserId(result.user_id);
        } else if (result.success && result.token) {
          setToken(result.token);
          router.push("/");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de autenticación");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const code = otpDigits.join("");
    if (code.length !== 6) {
      setError("Ingresa el código completo de 6 dígitos");
      setLoading(false);
      return;
    }

    try {
      const result = await verifyOtp(userId, code);
      if (result.success && result.token) {
        setToken(result.token);
        router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Código inválido");
      setOtpDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    setNeeds2FA(false);
    setUserId("");
    setOtpDigits(["", "", "", "", "", ""]);
    setError("");
  }

  return (
    <div className="flex min-h-screen items-center justify-center -m-8">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Image src="/favicon.svg" alt="CarePlus" width={40} height={40} />
            <Image src="/logo.svg" alt="CarePlus" width={130} height={40} priority />
          </div>
          <p className="text-muted">Sistema de Seguimiento Médico</p>
        </div>

        {!needs2FA ? (
          <>
            <h2 className="text-xl font-semibold mb-6">
              {isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}
            </h2>

            {error && (
              <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-3 mb-4 text-sm">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="bg-green-50 border border-green-300 text-green-700 rounded-lg p-3 mb-4 text-sm">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Cargando..." : isSignUp ? "Registrarse" : "Ingresar"}
              </button>
            </form>

            <p className="text-center text-sm text-muted mt-6">
              {isSignUp ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary font-medium hover:underline cursor-pointer"
              >
                {isSignUp ? "Inicia Sesión" : "Regístrate"}
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-2">Verificación de Seguridad</h2>
            <p className="text-muted text-sm mb-6">
              Ingresa el código de 6 dígitos enviado a <strong>{email}</strong>
            </p>

            {error && (
              <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-3 mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 text-center text-2xl font-bold rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || otpDigits.join("").length !== 6}
                className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Verificando..." : "Verificar Código"}
              </button>
            </form>

            <div className="text-center mt-4 space-y-2">
              <button
                onClick={handleBack}
                className="text-sm text-muted hover:text-foreground cursor-pointer"
              >
                ← Volver al inicio de sesión
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
