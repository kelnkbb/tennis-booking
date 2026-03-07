import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { MapPin, Mail, Lock, User } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const { signIn, signUp, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();

  const handleResendVerification = async () => {
    if (!email.trim()) return;
    setResendLoading(true);
    setError("");
    const { error } = await resendVerificationEmail(email.trim());
    if (error) setError(error);
    else setSuccess("验证邮件已重新发送，请查收邮箱。");
    setResendLoading(false);
  };

  const isEmailNotConfirmedError = (msg: string) =>
    /confirm|验证|verified|unconfirmed/i.test(msg);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) setError(error);
      else navigate("/");
    } else {
      if (!username.trim()) {
        setError("请输入用户名");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, username.trim());
      if (error) setError(error);
      else setSuccess("注册成功！请查收邮件验证后登录。");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg mb-4">
            <MapPin className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">网球场馆预订</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLogin ? "登录账户以预订场地" : "创建新账户"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-md p-6 space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary text-foreground text-sm border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary text-foreground text-sm border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary text-foreground text-sm border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
            />
          </div>

          {error && (
            <div className="space-y-1.5">
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
              {isLogin && isEmailNotConfirmedError(error) && (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendLoading || !email.trim()}
                  className="text-sm text-primary font-medium hover:underline disabled:opacity-50"
                >
                  {resendLoading ? "发送中…" : "未收到验证邮件？点击重新发送"}
                </button>
              )}
            </div>
          )}
          {success && (
            <div className="space-y-1.5">
              <p className="text-sm text-accent bg-accent/10 rounded-lg px-3 py-2">{success}</p>
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendLoading || !email.trim()}
                className="text-sm text-primary font-medium hover:underline disabled:opacity-50"
              >
                {resendLoading ? "发送中…" : "未收到邮件？重新发送验证邮件"}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "处理中..." : isLogin ? "登 录" : "注 册"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "没有账户？" : "已有账户？"}
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }}
              className="text-primary font-medium ml-1 hover:underline"
            >
              {isLogin ? "立即注册" : "去登录"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
