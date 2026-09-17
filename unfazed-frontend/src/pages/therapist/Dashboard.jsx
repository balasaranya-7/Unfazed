import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  IndianRupee,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  FileText,
  UserPlus,
  CreditCard,
  Plus,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar
} from 'recharts';
import { useData } from '../../context/DataContext';
import { formatINR, formatTime } from '../../utils/formatters';
import { analyticsData } from '../../data/mockData';
import Topbar from '../../components/common/Topbar';
import AddClientModal from '../../components/crm/AddClientModal';
import NewAppointmentModal from '../../components/scheduling/NewAppointmentModal';
import QuickNoteModal from '../../components/notes/QuickNoteModal';
import RecordPaymentModal from '../../components/payments/RecordPaymentModal';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { therapist, clients, appointments, transactions } = useData();

  // Modal States
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);

  // Computed Metrics
  const activeClients = clients.filter(c => c.status === 'Active');
  const todayDateStr = new Date().toISOString().split('T')[0];
  
  // Today's sessions & upcoming
  const todaySessions = appointments.filter(a => a.date === todayDateStr || a.date === '2026-09-10');
  const upcomingSessions = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Scheduled').slice(0, 4);

  // Revenue calculations
  const totalRevenue = transactions
    .filter(t => t.status === 'Completed')
    .reduce((acc, curr) => acc + (curr.totalAmount || curr.amount), 0);
  
  const pendingRevenue = transactions
    .filter(t => t.status === 'Pending')
    .reduce((acc, curr) => acc + (curr.totalAmount || curr.amount), 0);

  const statCards = [
    {
      title: 'Active Clients',
      value: activeClients.length,
      subtitle: `${clients.length} total enrolled`,
      trend: '+12% this month',
      icon: Users,
      color: 'bg-blush-light text-rosewood border-blush/60',
      action: () => navigate('/therapist/clients')
    },
    {
      title: 'Today\'s Sessions',
      value: todaySessions.length,
      subtitle: `${todaySessions.filter(s => s.status === 'Completed').length} completed`,
      trend: '3 video • 1 clinic',
      icon: Calendar,
      color: 'bg-sage-light text-sage-dark border-sage/40',
      action: () => navigate('/therapist/schedule')
    },
    {
      title: 'Practice Revenue',
      value: formatINR(totalRevenue),
      subtitle: `${formatINR(pendingRevenue)} pending dues`,
      trend: '+18.4% MoM',
      icon: IndianRupee,
      color: 'bg-misty-light text-midnight border-misty/50',
      action: () => navigate('/therapist/payments')
    },
    {
      title: 'No-Show Rate',
      value: '3.8%',
      subtitle: 'Benchmark: 12-15%',
      trend: 'Top 5% adherence',
      icon: Activity,
      color: 'bg-vanilla-dark/60 text-rosewood border-blush/40',
      action: () => navigate('/therapist/analytics')
    }
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-vanilla pb-16">
      {/* Topbar with practice quick actions */}
      <Topbar
        onOpenAddClient={() => setAddClientOpen(true)}
        onOpenSchedule={() => setScheduleOpen(true)}
        onOpenAddNote={() => setAddNoteOpen(true)}
        onOpenRecordPayment={() => setRecordPaymentOpen(true)}
      />

      <main className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Practice Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-3xl bg-midnight text-vanilla p-6 sm:p-8 shadow-xl border border-blush/20"
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rosewood/30 text-blush text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={13} />
                <span>Today's Practice Overview</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
                You have {todaySessions.length} consultations scheduled today
              </h2>
              <p className="text-sm text-misty leading-relaxed">
                Next session is with <strong className="text-vanilla font-semibold">{todaySessions[0]?.clientName || 'Ananya Sen'}</strong> at {formatTime(todaySessions[0]?.startTime || '11:00')}. Telehealth room is prepared.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {todaySessions[0]?.mode === 'Video Meet' && todaySessions[0]?.meetLink && (
                <a
                  href={todaySessions[0].meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-rosewood text-white font-semibold text-sm hover:bg-rosewood-hover transition shadow-md shadow-rosewood/30"
                >
                  <Video size={16} />
                  <span>Start Video Session</span>
                  <ExternalLink size={14} />
                </a>
              )}
              <button
                onClick={() => setScheduleOpen(true)}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-midnight-light hover:bg-midnight-soft text-vanilla text-sm font-medium transition border border-misty/20"
              >
                <Calendar size={16} />
                <span>Open Calendar</span>
              </button>
            </div>
          </div>

          {/* Decorative background glow */}
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-rosewood/15 blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 -bottom-16 w-60 h-60 rounded-full bg-sage/10 blur-3xl pointer-events-none" />
        </motion.div>

        {/* 4 Core Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.06 }}
                onClick={stat.action}
                className="bg-white rounded-3xl p-6 border border-misty/30 card-shadow card-shadow-hover cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-midnight-muted">
                    {stat.title}
                  </span>
                  <div className={`p-2.5 rounded-2xl border ${stat.color} group-hover:scale-110 transition`}>
                    <Icon size={18} />
                  </div>
                </div>

                <div className="my-4">
                  <h3 className="text-3xl font-extrabold font-display text-midnight tracking-tight">
                    {stat.value}
                  </h3>
                  <p className="text-xs text-midnight-muted mt-1">{stat.subtitle}</p>
                </div>

                <div className="pt-3 border-t border-misty/20 flex items-center justify-between text-xs">
                  <span className="font-semibold text-sage-dark flex items-center gap-1">
                    <TrendingUp size={13} />
                    {stat.trend}
                  </span>
                  <ArrowUpRight size={14} className="text-misty group-hover:text-rosewood transition" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 2-Column Section: Today's Schedule + Revenue Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Today's Sessions Interactive Timeline (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-misty/30 card-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-misty/20">
                <div>
                  <h3 className="text-lg font-bold font-display text-midnight">
                    Today's Clinical Schedule
                  </h3>
                  <p className="text-xs text-midnight-muted">
                    {todaySessions.length} appointments booked for today
                  </p>
                </div>
                <button
                  onClick={() => navigate('/therapist/schedule')}
                  className="text-xs font-bold text-rosewood hover:text-rosewood-hover flex items-center gap-1"
                >
                  <span>View All</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Session cards list */}
              <div className="space-y-3.5">
                {todaySessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 rounded-2xl border border-misty/30 bg-vanilla/30 hover:bg-vanilla transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={session.clientAvatar}
                        alt={session.clientName}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-blush/60 flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-midnight">{session.clientName}</h4>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sage-light text-sage-dark border border-sage/30">
                            {session.status}
                          </span>
                        </div>
                        <p className="text-xs text-midnight-muted mt-0.5">{session.serviceTitle}</p>
                        <div className="flex items-center gap-3 text-[11px] text-midnight-soft mt-1">
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-rosewood" />
                            {formatTime(session.startTime)} - {formatTime(session.endTime)} ({session.duration}m)
                          </span>
                          <span className="flex items-center gap-1">
                            {session.mode === 'Video Meet' ? <Video size={12} className="text-sage" /> : <MapPin size={12} className="text-misty" />}
                            {session.mode}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setAddNoteOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-misty/40 text-xs font-semibold text-midnight hover:bg-white transition flex items-center gap-1"
                      >
                        <FileText size={13} className="text-rosewood" />
                        <span>Note</span>
                      </button>
                      {session.mode === 'Video Meet' && session.meetLink && (
                        <a
                          href={session.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-midnight text-white text-xs font-semibold hover:bg-midnight-light transition flex items-center gap-1"
                        >
                          <Video size={13} className="text-blush" />
                          <span>Join</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-misty/20 flex items-center justify-between">
              <span className="text-xs text-midnight-muted">Need to adjust today's buffers?</span>
              <button
                onClick={() => navigate('/therapist/schedule')}
                className="text-xs font-semibold text-rosewood hover:underline"
              >
                Manage Availability Settings →
              </button>
            </div>
          </div>

          {/* Right: Revenue Overview Mini-Chart (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-misty/30 card-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-misty/20">
                <div>
                  <h3 className="text-lg font-bold font-display text-midnight">
                    Practice Revenue Trend
                  </h3>
                  <p className="text-xs text-midnight-muted">
                    Past 6 months growth trajectory
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sage-light text-sage-dark">
                  +18.4%
                </span>
              </div>

              {/* Area Chart with Rosewood Gradient */}
              <div className="h-56 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData.monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="rosewoodGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#B46A72" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#B46A72" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="month"
                      tick={{ fill: '#728294', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#728294', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => `₹${val / 1000}k`}
                    />
                    <Tooltip
                      formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
                      contentStyle={{
                        backgroundColor: '#2D3A47',
                        borderRadius: '12px',
                        border: 'none',
                        color: '#FFF7E6',
                        fontSize: '12px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#B46A72"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#rosewoodGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-misty/20 mt-4 text-xs">
              <div className="p-2.5 rounded-xl bg-vanilla/40 border border-misty/20">
                <span className="text-midnight-muted block">Avg Session Fee</span>
                <span className="font-bold text-midnight text-sm">₹2,200</span>
              </div>
              <div className="p-2.5 rounded-xl bg-vanilla/40 border border-misty/20">
                <span className="text-midnight-muted block">Package Share</span>
                <span className="font-bold text-midnight text-sm">62% of bookings</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Client Growth & Recent Clinical Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Practice Activity (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-misty/30 card-shadow">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-misty/20">
              <div>
                <h3 className="text-lg font-bold font-display text-midnight">
                  Recent Clinical Activity
                </h3>
                <p className="text-xs text-midnight-muted">
                  Notes, payments, and client updates
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5 pb-3.5 border-b border-misty/20">
                <div className="p-2 rounded-xl bg-sage-light text-sage-dark mt-0.5">
                  <CheckCircle2 size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-midnight">
                    <strong>Ananya Sen</strong> completed Session #8. Shared reflections and homework published to her portal.
                  </p>
                  <span className="text-[11px] text-midnight-muted">Today at 12:45 PM</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pb-3.5 border-b border-misty/20">
                <div className="p-2 rounded-xl bg-blush-light text-rosewood mt-0.5">
                  <CreditCard size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-midnight">
                    Payment of <strong>₹13,452 (incl. GST)</strong> received from <strong>Ananya Sen</strong> for 6-Session Deep-Dive Pack.
                  </p>
                  <span className="text-[11px] text-midnight-muted">Yesterday at 4:30 PM</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-misty-light text-midnight mt-0.5">
                  <UserPlus size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-midnight">
                    New client lead <strong>Tanya Joshi</strong> submitted digital intake form through your branded link.
                  </p>
                  <span className="text-[11px] text-midnight-muted">Sep 8 at 7:20 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Practice Shortcuts (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-vanilla-light to-blush-light/40 rounded-3xl p-6 sm:p-7 border border-blush/40 card-shadow flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rosewood">Quick Shortcuts</span>
              <h3 className="text-xl font-bold font-display text-midnight mt-1 mb-4">
                Practice Management Hub
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setAddClientOpen(true)}
                  className="p-3.5 rounded-2xl bg-white border border-blush/40 text-left hover:border-rosewood transition shadow-sm group"
                >
                  <UserPlus size={18} className="text-rosewood group-hover:scale-110 transition mb-2" />
                  <p className="text-xs font-bold text-midnight">New Client</p>
                  <p className="text-[10px] text-midnight-muted">Add to CRM</p>
                </button>

                <button
                  onClick={() => setScheduleOpen(true)}
                  className="p-3.5 rounded-2xl bg-white border border-blush/40 text-left hover:border-rosewood transition shadow-sm group"
                >
                  <Calendar size={18} className="text-sage-dark group-hover:scale-110 transition mb-2" />
                  <p className="text-xs font-bold text-midnight">Book Slot</p>
                  <p className="text-[10px] text-midnight-muted">Schedule session</p>
                </button>

                <button
                  onClick={() => setAddNoteOpen(true)}
                  className="p-3.5 rounded-2xl bg-white border border-blush/40 text-left hover:border-rosewood transition shadow-sm group"
                >
                  <FileText size={18} className="text-midnight group-hover:scale-110 transition mb-2" />
                  <p className="text-xs font-bold text-midnight">Write Note</p>
                  <p className="text-[10px] text-midnight-muted">SOAP / DAP</p>
                </button>

                <button
                  onClick={() => setRecordPaymentOpen(true)}
                  className="p-3.5 rounded-2xl bg-white border border-blush/40 text-left hover:border-rosewood transition shadow-sm group"
                >
                  <CreditCard size={18} className="text-rosewood group-hover:scale-110 transition mb-2" />
                  <p className="text-xs font-bold text-midnight">Log Payment</p>
                  <p className="text-[10px] text-midnight-muted">GST Invoicing</p>
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-white/80 border border-misty/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-midnight block">Your Branded Client Portal</span>
                <span className="text-[11px] text-midnight-muted">unfazed.in/{therapist.slug}</span>
              </div>
              <button
                onClick={() => navigate(`/therapist/${therapist.slug}`)}
                className="p-2 rounded-xl bg-midnight text-vanilla hover:bg-midnight-light transition"
                title="Preview public profile"
              >
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Reusable Modals */}
      <AddClientModal isOpen={addClientOpen} onClose={() => setAddClientOpen(false)} />
      <NewAppointmentModal isOpen={scheduleOpen} onClose={() => setScheduleOpen(false)} />
      <QuickNoteModal isOpen={addNoteOpen} onClose={() => setAddNoteOpen(false)} />
      <RecordPaymentModal isOpen={recordPaymentOpen} onClose={() => setRecordPaymentOpen(false)} />
    </div>
  );
};

export default Dashboard;
