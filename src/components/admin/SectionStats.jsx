// components/admin/SectionStats.jsx
"use client";

import { motion } from "framer-motion";

const SectionStats = ({ stats }) => {
  const statCards = [
    { label: "Total Sections", value: stats.total || 0, icon: "📦", color: "bg-blue-500" },
    { label: "Active Sections", value: stats.active || 0, icon: "✅", color: "bg-green-500" },
    { label: "Expired", value: stats.expired || 0, icon: "⏰", color: "bg-red-500" }
  ];

  const typeIcons = {
    notification: "🔔",
    hiring: "💼",
    promotion: "🎉",
    dashboard: "📊",
    default: "📄"
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)] mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-[var(--black)]">{stat.value}</p>
              </div>
              <span className="text-4xl">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Type Breakdown */}
      {stats.types && Object.keys(stats.types).length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-[var(--black)] mb-4">Sections by Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(stats.types).map(([type, count]) => (
              <div key={type} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <span className="text-lg">{typeIcons[type] || "📌"}</span>
                <div>
                  <p className="text-xs text-[var(--muted)] capitalize">{type}</p>
                  <p className="text-lg font-semibold">{count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionStats;