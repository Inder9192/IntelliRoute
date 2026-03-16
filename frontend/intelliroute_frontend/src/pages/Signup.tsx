import { useState, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Zap, Shield, Activity, Cpu } from "lucide-react";

const floatingDots = [
  { x: "10%", y: "25%", size: 3, duration: 4, delay: 0 },
  { x: "70%", y: "10%", size: 2, duration: 5, delay: 1 },
  { x: "45%", y: "65%", size: 4, duration: 6, delay: 0.5 },
  { x: "80%", y: "55%", size: 2, duration: 4.5, delay: 1.5 },
  { x: "20%", y: "75%", size: 3, duration: 5.5, delay: 2 },
  { x: "60%", y: "35%", size: 2, duration: 4, delay: 0.8 },
];

const features = [
  { icon: <Zap size={14} color="#00e5b4" />, title: "Lightning-fast routing", desc: "Requests reach the best server in milliseconds" },
  { icon: <Shield size={14} color="#00e5b4" />, title: "Fault tolerance", desc: "Automatically handles and recovers from failures" },
  { icon: <Activity size={14} color="#00e5b4" />, title: "Live monitoring", desc: "See traffic and performance update in real time" },
  { icon: <Cpu size={14} color="#00e5b4" />, title: "AI-powered decisions", desc: "Smart routing that learns and adapts over time" },
];

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [linkHover, setLinkHover] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signup({ name, email, password, company: company || undefined });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (extraPadding?: string): React.CSSProperties => ({
    width: "100%",
    height: "44px",
    padding: extraPadding ? `0 ${extraPadding} 0 12px` : "0 12px",
    borderRadius: "9999px",
    fontSize: "0.875rem",
    fontFamily: "monospace",
    outline: "none",
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    color: "#ffffff",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s, box-shadow 0.2s",
  });

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#00e5b4";
    e.target.style.boxShadow = "0 0 0 3px rgba(0,229,180,0.1)";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#2a2a2a";
    e.target.style.boxShadow = "none";
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

      {/* Left Panel */}
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
            transition={{ duration: dot.duration, repeat: Infinity, delay: dot.delay, ease: "easeInOut" }}
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
          {/* Badge */}
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

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontSize: "3rem",
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#ffffff",
              marginBottom: "1.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            Intelligent{" "}
            <span style={{ color: "#00e5b4" }}>routing</span>
            <br />
            at scale.
          </motion.h1>

          {/* Feature list */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  backgroundColor: "rgba(255,255,255,0.03)",
                }}
              >
                <div style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(0,229,180,0.1)",
                  border: "1px solid rgba(0,229,180,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize: "0.8rem", fontFamily: "monospace", color: "#ffffff", fontWeight: 600 }}>{f.title}</div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
          overflowY: "auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ width: "100%", maxWidth: "360px", paddingTop: "60px", paddingBottom: "40px" }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: "2.2rem",
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: "6px",
              letterSpacing: "-0.02em",
            }}
          >
            Create account
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "2rem" }}
          >
            Deploy your first routing cluster in 60 seconds
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
            {/* Full Name */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label style={{ fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af" }}>
                Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                style={inputStyle()}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label style={{ fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@company.com"
                required
                style={inputStyle()}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </motion.div>

            {/* Company */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label style={{ fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af" }}>
                Company <span style={{ color: "#4b5563" }}>(optional)</span>
              </label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Inc."
                style={inputStyle()}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.55 }}
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label style={{ fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  required
                  minLength={8}
                  style={inputStyle("40px")}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
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
                  "Start Routing →"
                )}
              </motion.button>
            </motion.div>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            style={{ marginTop: "1.5rem", fontSize: "0.875rem", fontFamily: "monospace", color: "#6b7280", textAlign: "center" }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              onMouseEnter={() => setLinkHover(true)}
              onMouseLeave={() => setLinkHover(false)}
              style={{
                color: linkHover ? "#00cfaa" : "#00e5b4",
                textDecoration: linkHover ? "underline" : "none",
                transition: "color 0.2s",
              }}
            >
              Sign in →
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
