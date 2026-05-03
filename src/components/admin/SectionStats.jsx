// components/admin/SectionStats.jsx
"use client";

import { motion } from "framer-motion";
import { 
  LayoutGrid, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Bell,
  Briefcase,
  PartyPopper,
  LayoutDashboard,
  FileText
} from "lucide-react";

const SectionStats = ({ stats }) => {
  const activePercentage = stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(0) : 0;
  
  const statCards = [
    { 
      label: "Total Sections", 
      value: stats.total || 0, 
      icon: LayoutGrid, 
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
      borderColor: "border-blue-100"
    },
    { 
      label: "Active Sections", 
      value: stats.active || 0, 
      icon: CheckCircle, 
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-500",
      borderColor: "border-emerald-100",
      percentage: `${activePercentage}%`,
      trend: activePercentage > 50 ? "up" : "down"
    },
    { 
      label: "Expired", 
      value: stats.expired || 0, 
      icon: Clock, 
      bgColor: "bg-red-50",
      iconColor: "text-red-500",
      borderColor: "border-red-100"
    }
  ];

  const typeConfig = {
    notification: { icon: Bell, label: "Notifications", color: "blue" },
    hiring: { icon: Briefcase, label: "Hiring", color: "emerald" },
    promotion: { icon: PartyPopper, label: "Promotions", color: "purple" },
    dashboard: { icon: LayoutDashboard, label: "Dashboard", color: "orange" },
    default: { icon: FileText, label: "Default", color: "gray" }
  };

  if (!stats.total || stats.total === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)] mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-[var(--black)]">0</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border ${stat.borderColor || 'border-gray-100'}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--muted)] mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-[var(--black)]">{stat.value}</p>
                  {stat.percentage && (
                    <span className="text-sm font-medium text-[var(--accent)]">{stat.percentage}</span>
                  )}
                </div>
                
                {/* Mini progress bar for active sections */}
                {stat.label === "Active Sections" && stats.total > 0 && (
                  <div className="mt-3">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${activePercentage}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
            
            {/* Trend indicator for active sections */}
            {stat.trend && (
              <div className="flex items-center gap-1 mt-3">
                {stat.trend === "up" ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                )}
                <span className="text-xs text-[var(--muted)]">
                  {stat.trend === "up" ? `${activePercentage}% active rate` : 'Low active rate'}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Sections by Type */}
      {stats.types && Object.keys(stats.types).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-[var(--accent)] rounded-full"></div>
              <h3 className="text-sm font-semibold text-[var(--black)]">Distribution by Type</h3>
            </div>
            <div className="text-xs text-[var(--muted)]">{Object.keys(stats.types).length} categories</div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {Object.entries(stats.types).map(([type, count], idx) => {
              const config = typeConfig[type] || typeConfig.default;
              const Icon = config.icon;
              const percentage = ((count / stats.total) * 100).toFixed(0);
              
              return (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="group p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg bg-${config.color}-100 flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 text-${config.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <p className="text-lg font-semibold text-[var(--black)]">{count}</p>
                        <span className="text-xs font-medium text-[var(--accent)]">{percentage}%</span>
                      </div>
                      <p className="text-xs text-[var(--muted)] capitalize">{config.label}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SectionStats;