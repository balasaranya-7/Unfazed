import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Filter,
  DollarSign,
  Users,
  Activity,
  Award,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { analyticsData } from '../../data/mockData';
import { formatINR } from '../../utils/formatters';
import { useEntitlement } from '../../hooks/useEntitlement';
import UpgradeModal from '../../components/common/UpgradeModal';

export const Analytics = () => {
  const { canAccess, requireAccess, upgradeModal, closeUpgradeModal } = useEntitlement();
  const [timeRange, setTimeRange] = useState('monthly'); // weekly, monthly, yearly

  const handleTimeRangeClick = (range) => {
    if (range === 'yearly' && !canAccess('deep_analytics')) {
      requireAccess('deep_analytics', 'Multi-Year Clinical Analytics & Cohort Retention');
      return;
    }
    setTimeRange(range);
  };

  const COLORS = ['#B46A72', '#A8B58A', '#A9B7C6', '#F7C8D3'];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-vanilla pb-16">
      {/* Top Header */}
      <div className="bg-white border-b border-misty/30 px-6 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rosewood">Clinical Practice Intelligence</span>
              <span className="w-1.5 h-1.5 rounded-full bg-sage" />
              <span className="text-xs font-semibold text-midnight-muted">Aggregated Practice Metrics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-midnight tracking-tight mt-1">
              Practice Analytics & Outcomes
            </h1>
          </div>

          {/* Time Range Filter Switcher */}
          <div className="bg-vanilla/60 p-1 rounded-2xl border border-misty/30 flex items-center self-start sm:self-auto">
            {['weekly', 'monthly', 'yearly'].map((range) => (
              <button
                key={range}
                onClick={() => handleTimeRangeClick(range)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition flex items-center gap-1 ${
                  timeRange === range
                    ? 'bg-midnight text-vanilla shadow-sm'
                    : 'text-midnight-muted hover:text-midnight'
                }`}
              >
                <span>{range}</span>
                {range === 'yearly' && !canAccess('deep_analytics') && (
                  <span className="text-[10px] text-blush">🔒</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* KPI Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-3xl bg-white border border-misty/30 card-shadow">
            <span className="text-xs font-bold uppercase tracking-wider text-midnight-muted block mb-1">
              Monthly Revenue Rate
            </span>
            <h3 className="text-3xl font-extrabold font-display text-midnight">
              {formatINR(analyticsData.kpis.totalRevenueMonthly)}
            </h3>
            <span className="text-xs text-sage-dark font-semibold mt-1 inline-flex items-center gap-1">
              <TrendingUp size={13} /> +18.4% vs last month
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-misty/30 card-shadow">
            <span className="text-xs font-bold uppercase tracking-wider text-midnight-muted block mb-1">
              Active Client Roster
            </span>
            <h3 className="text-3xl font-extrabold font-display text-midnight">
              {analyticsData.kpis.activeClients} Clients
            </h3>
            <span className="text-xs text-sage-dark font-semibold mt-1 inline-flex items-center gap-1">
              <TrendingUp size={13} /> 8 new leads enrolled
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-misty/30 card-shadow">
            <span className="text-xs font-bold uppercase tracking-wider text-midnight-muted block mb-1">
              Booking Conversion Rate
            </span>
            <h3 className="text-3xl font-extrabold font-display text-rosewood">
              {analyticsData.kpis.bookingConversion}
            </h3>
            <span className="text-xs text-midnight-muted mt-1 block">
              From public profile visit to booked slot
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-misty/30 card-shadow">
            <span className="text-xs font-bold uppercase tracking-wider text-midnight-muted block mb-1">
              No-Show / Late Cancel Rate
            </span>
            <h3 className="text-3xl font-extrabold font-display text-sage-dark">
              {analyticsData.kpis.noShowRate}
            </h3>
            <span className="text-xs text-midnight-muted mt-1 block">
              Industry average is ~14%
            </span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Revenue Trajectory (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-misty/30 card-shadow space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-misty/20">
              <div>
                <h3 className="text-lg font-bold font-display text-midnight">Revenue Trajectory (INR)</h3>
                <p className="text-xs text-midnight-muted">Monthly practice gross revenue progression</p>
              </div>
              <span className="text-xs font-bold text-rosewood bg-rosewood-light px-2.5 py-1 rounded-xl">
                Steady Growth
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.monthlyRevenue} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="analyticsRosewood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B46A72" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#B46A72" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fill: '#728294', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#728294', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip
                    formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Gross Revenue']}
                    contentStyle={{ backgroundColor: '#2D3A47', borderRadius: '12px', border: 'none', color: '#FFF7E6', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#B46A72" strokeWidth={3} fillOpacity={1} fill="url(#analyticsRosewood)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Session Service Breakdown (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-misty/30 card-shadow space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-misty/20">
                <div>
                  <h3 className="text-lg font-bold font-display text-midnight">Session Modality Share</h3>
                  <p className="text-xs text-midnight-muted">Breakdown by therapy offering</p>
                </div>
              </div>

              <div className="h-56 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.sessionTypeBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analyticsData.sessionTypeBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [`${val}%`, 'Share']}
                      contentStyle={{ backgroundColor: '#2D3A47', borderRadius: '12px', border: 'none', color: '#FFF7E6', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-misty/20 text-xs">
              {analyticsData.sessionTypeBreakdown.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-midnight font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-midnight">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Growth & Retention Bar Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-misty/30 card-shadow space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-misty/20">
            <div>
              <h3 className="text-lg font-bold font-display text-midnight">
                Client Acquisition & Roster Volume
              </h3>
              <p className="text-xs text-midnight-muted">
                New clients joined vs active ongoing therapy cases
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-rosewood" />
                <span className="text-midnight-muted font-medium">New Enrolled</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-sage" />
                <span className="text-midnight-muted font-medium">Active Roster</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.clientGrowth} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fill: '#728294', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#728294', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#2D3A47', borderRadius: '12px', border: 'none', color: '#FFF7E6', fontSize: '12px' }}
                />
                <Bar dataKey="newClients" fill="#B46A72" radius={[6, 6, 0, 0]} name="New Clients" />
                <Bar dataKey="activeClients" fill="#A8B58A" radius={[6, 6, 0, 0]} name="Active Roster" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>

      {/* Upgrade Modal for Gated Analytics */}
      <UpgradeModal
        isOpen={upgradeModal.isOpen}
        onClose={closeUpgradeModal}
        featureTitle={upgradeModal.title}
        featureDescription={upgradeModal.description}
      />
    </div>
  );
};

export default Analytics;
