import { motion } from "framer-motion";

const pulse = {
  animate: { opacity: [0.4, 0.7, 0.4] },
  transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
};

const block = (w: string | number, h: number, radius = 8): React.CSSProperties => ({
  width: w,
  height: `${h}px`,
  background: "rgba(255,255,255,0.07)",
  borderRadius: `${radius}px`,
});

const card: React.CSSProperties = {
  background: "#161616",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "12px",
  padding: "20px 24px",
};

/** A single animated shimmer block */
export const Bone = ({ width, height, radius }: { width: string | number; height: number; radius?: number }) => (
  <motion.div {...pulse} style={block(width, height, radius)} />
);

/** Overview page skeleton */
export const OverviewSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
    {/* Header */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Bone width={160} height={22} />
        <Bone width={200} height={13} />
      </div>
      <Bone width={80} height={22} radius={999} />
    </div>
    {/* 4 stat cards */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div key={i} {...pulse} style={card}>
          <Bone width={32} height={32} radius={8} />
          <div style={{ marginTop: "14px" }}><Bone width="60%" height={28} /></div>
          <div style={{ marginTop: "8px" }}><Bone width="80%" height={12} /></div>
        </motion.div>
      ))}
    </div>
    {/* Chart */}
    <motion.div {...pulse} style={{ ...card, padding: "24px" }}>
      <Bone width={160} height={16} />
      <div style={{ marginTop: "20px" }}><Bone width="100%" height={140} radius={6} /></div>
    </motion.div>
    {/* Table */}
    <motion.div {...pulse} style={{ ...card, padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Bone width={120} height={16} />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} style={{ padding: "14px 24px", display: "flex", alignItems: "center", gap: "14px", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
          <Bone width={8} height={8} radius={999} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
            <Bone width="40%" height={13} />
            <Bone width="60%" height={10} />
          </div>
          <Bone width={50} height={13} />
          <Bone width={50} height={22} radius={999} />
        </div>
      ))}
    </motion.div>
  </div>
);

/** Backends page skeleton */
export const BackendsSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Bone width={120} height={22} />
        <Bone width={200} height={13} />
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <Bone width={36} height={36} radius={8} />
        <Bone width={120} height={36} radius={999} />
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div key={i} {...pulse} style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Bone width={40} height={40} radius={10} />
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <Bone width={120} height={15} />
                <Bone width={180} height={11} />
              </div>
            </div>
            <Bone width={32} height={32} radius={8} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginTop: "20px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <Bone width="60%" height={10} />
                <Bone width="80%" height={15} />
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

/** Metrics page skeleton */
export const MetricsSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Bone width={100} height={22} />
        <Bone width={220} height={13} />
      </div>
      <Bone width={240} height={38} radius={8} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div key={i} {...pulse} style={card}>
          <Bone width={24} height={24} radius={6} />
          <div style={{ marginTop: "12px" }}><Bone width="55%" height={28} /></div>
          <div style={{ marginTop: "8px" }}><Bone width="70%" height={11} /></div>
        </motion.div>
      ))}
    </div>
    <motion.div {...pulse} style={{ ...card, padding: "24px" }}>
      <Bone width={140} height={16} />
      <div style={{ marginTop: "20px" }}><Bone width="100%" height={180} radius={6} /></div>
    </motion.div>
    <motion.div {...pulse} style={{ ...card, padding: "24px" }}>
      <Bone width={160} height={16} />
      <div style={{ marginTop: "20px" }}><Bone width="100%" height={100} radius={6} /></div>
    </motion.div>
  </div>
);

/** Routing page skeleton */
export const RoutingSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Bone width={190} height={22} />
        <Bone width={210} height={13} />
      </div>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <Bone width={60} height={16} radius={999} />
        <Bone width={110} height={36} radius={999} />
      </div>
    </div>
    {Array.from({ length: 4 }).map((_, i) => (
      <motion.div key={i} {...pulse} style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Bone width={70} height={12} />
            <Bone width={120} height={12} />
          </div>
          <Bone width={100} height={14} />
        </div>
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          {Array.from({ length: 4 }).map((_, j) => (
            <Bone key={j} width="25%" height={60} radius={8} />
          ))}
        </div>
        <Bone width="70%" height={11} />
      </motion.div>
    ))}
  </div>
);

/** Settings page skeleton */
export const SettingsSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "28px", maxWidth: "640px" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <Bone width={100} height={22} />
      <Bone width={220} height={13} />
    </div>
    {Array.from({ length: 3 }).map((_, i) => (
      <motion.div key={i} {...pulse} style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
          <Bone width={14} height={14} radius={4} />
          <Bone width={80} height={12} radius={4} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Bone width={60} height={10} />
            <Bone width="100%" height={40} radius={8} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Bone width={60} height={10} />
            <Bone width="100%" height={40} radius={8} />
          </div>
        </div>
      </motion.div>
    ))}
    <Bone width={160} height={44} radius={999} />
  </div>
);
