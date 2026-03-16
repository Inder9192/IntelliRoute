import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Zap } from "lucide-react";

const floatingDots = [
  { x: "15%", y: "20%", size: 3, duration: 4, delay: 0 },
  { x: "75%", y: "15%", size: 2, duration: 5, delay: 1 },
  { x: "40%", y: "70%", size: 4, duration: 6, delay: 0.5 },
  { x: "85%", y: "60%", size: 2, duration: 4.5, delay: 1.5 },
  { x: "25%", y: "80%", size: 3, duration: 5.5, delay: 2 },
  { x: "60%", y: "40%", size: 2, duration: 4, delay: 0.8 },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [linkHover, setLinkHover] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#0a0a0a",
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* Top-left Logo */}
      <Link
        to="/"
        style={{
          position: "fixed",
          top: "20px",
          left: "24px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          textDecoration: "none",
          zIndex: 50,
        }}
      >
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              backgroundColor: "rgba(0,229,180,0.15)",
              border: "1px solid rgba(0,229,180,0.4)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={15} color="#00e5b4" fill="#00e5b4" />
          </div>
          <span
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              fontFamily: "monospace",
              color: "#ffffff",
              letterSpacing: "-0.01em",
            }}
          >
            IntelliRoute
          </span>
        </motion.div>
      </Link>

      {/* Left Panel — Branding */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 4rem",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#0d0f0e",
        }}
      >
        {/* Animated green radial glow */}
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 70% 60% at 30% 50%, rgba(0,229,180,0.1) 0%, transparent 70%)",
          }}
        />

        {/* Grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Floating teal dots */}
        {floatingDots.map((dot, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -12, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{
              duration: dot.duration,
              repeat: Infinity,
              delay: dot.delay,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              left: dot.x,
              top: dot.y,
              width: dot.size,
              height: dot.size,
              borderRadius: "50%",
              backgroundColor: "#00e5b4",
              pointerEvents: "none",
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{ position: "relative", zIndex: 10, maxWidth: "440px" }}
        >
          {/* Badge with pulsing dot */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "2rem",
              border: "1px solid rgba(0,229,180,0.35)",
              borderRadius: "9999px",
              padding: "6px 14px",
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#00e5b4",
                flexShrink: 0,
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: "11px",
                fontFamily: "monospace",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#00e5b4",
              }}
            >
              AI-Powered Load Balancing
            </span>
          </motion.div>

          {/* Headline — words stagger in */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontSize: "3.5rem",
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#ffffff",
              marginBottom: "1.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            Route{" "}
            <span style={{ color: "#00e5b4" }}>smarter,</span>
            <br />
            not harder.
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "#6b7280",
              maxWidth: "360px",
            }}
          >
            IntelliRoute is an intelligent traffic router that automatically
            directs your requests to the best-performing server in real-time.
            Designed for teams managing multiple servers.
          </motion.p>
        </motion.div>
      </div>

      {/* Vertical Divider */}
      <div
        style={{
          width: "1px",
          alignSelf: "stretch",
          backgroundColor: "rgba(255,255,255,0.07)",
          flexShrink: 0,
        }}
      />

      {/* Right Panel — Form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 2rem",
          backgroundColor: "#111111",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ width: "100%", maxWidth: "360px" }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: "6px",
              letterSpacing: "-0.02em",
            }}
          >
            Welcome back
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "2rem" }}
          >
            Sign in to your dashboard
          </motion.p>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              style={{
                marginBottom: "1.25rem",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontFamily: "monospace",
                border: "1px solid rgba(239,68,68,0.3)",
                backgroundColor: "rgba(239,68,68,0.1)",
                color: "#f87171",
              }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label
                style={{
                  fontSize: "11px",
                  fontFamily: "monospace",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#9ca3af",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@company.com"
                required
                style={{
                  width: "100%",
                  height: "44px",
                  padding: "0 12px",
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  fontFamily: "monospace",
                  outline: "none",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  color: "#ffffff",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#00e5b4";
                  e.target.style.boxShadow = "0 0 0 3px rgba(0,229,180,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#2a2a2a";
                  e.target.style.boxShadow = "none";
                }}
              />
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label
                style={{
                  fontSize: "11px",
                  fontFamily: "monospace",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#9ca3af",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%",
                    height: "44px",
                    padding: "0 40px 0 12px",
                    borderRadius: "9999px",
                    fontSize: "0.875rem",
                    fontFamily: "monospace",
                    outline: "none",
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    color: "#ffffff",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#00e5b4";
                    e.target.style.boxShadow = "0 0 0 3px rgba(0,229,180,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#2a2a2a";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#00e5b4")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#6b7280")}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02, boxShadow: "0 0 20px rgba(0,229,180,0.35)" } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}
                style={{
                  width: "100%",
                  height: "44px",
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  fontFamily: "monospace",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  backgroundColor: btnHover && !loading ? "#00cfaa" : "#00e5b4",
                  color: "#0d0d0d",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  transition: "background-color 0.2s",
                  marginTop: "4px",
                }}
              >
                {loading ? (
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid #0d0d0d",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 0.6s linear infinite",
                    }}
                  />
                ) : (
                  "Login →"
                )}
              </motion.button>
            </motion.div>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            style={{ marginTop: "1.5rem", fontSize: "0.875rem", fontFamily: "monospace", color: "#6b7280" }}
          >
            No account?{" "}
            <Link
              to="/signup"
              onMouseEnter={() => setLinkHover(true)}
              onMouseLeave={() => setLinkHover(false)}
              style={{
                color: linkHover ? "#00cfaa" : "#00e5b4",
                textDecoration: linkHover ? "underline" : "none",
                transition: "color 0.2s, text-decoration 0.2s",
              }}
            >
              Route now →
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
