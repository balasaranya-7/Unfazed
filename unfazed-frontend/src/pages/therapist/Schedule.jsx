import React, {
  useMemo,
  useState
} from 'react';

import {
  motion
} from 'framer-motion';

import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  Plus,
  ChevronLeft,
  ChevronRight,
  Globe,
  Sliders,
  Trash2
} from 'lucide-react';

import {
  useData
} from '../../context/DataContext';

import {
  formatTime,
  getStatusBadgeColor
} from '../../utils/formatters';

import NewAppointmentModal
  from '../../components/scheduling/NewAppointmentModal';

import Modal
  from '../../components/common/Modal';


// ==================================================
// DATE HELPERS
// ==================================================

const pad = (number) =>
  String(number).padStart(2, '0');


const dateToString = (date) => {

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(
    date.getDate()
  )}`;
};


const parseDate = (dateString) => {

  const [
    year,
    month,
    day
  ] = dateString.split('-').map(Number);

  return new Date(
    year,
    month - 1,
    day
  );
};


const monthLabel = (date) => {

  return date.toLocaleDateString(
    'en-IN',
    {
      month: 'long',
      year: 'numeric'
    }
  );
};


const getMonthStart = (date) => {

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  );
};


const getMonthEnd = (date) => {

  return new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  );
};


// ==================================================
// RECURRING DEMO APPOINTMENTS
//
// IMPORTANT:
// We generate sessions ONLY for clients that
// currently exist.
//
// Therefore deleted Rohan can NEVER come back.
// ==================================================

const createRecurringDemoAppointments = (
  clients,
  appointments,
  selectedMonth
) => {

  const generated = [];

  const year =
    selectedMonth.getFullYear();

  const month =
    selectedMonth.getMonth();


  /*
   * Existing appointment client IDs.
   * We use these to avoid unnecessary duplicates.
   */
  const existingAppointmentKeys =
    new Set(
      appointments.map(
        (appointment) =>
          `${appointment.clientId}-${appointment.date}-${appointment.startTime}`
      )
    );


  /*
   * Each default client gets a monthly
   * demonstration session.
   *
   * These are generated ONLY while the client
   * exists in the Clients list.
   */
  const demoTimes = [
    '11:00',
    '16:00',
    '17:30',
    '14:00',
    '15:00',
    '11:30',
    '16:30',
    '15:30'
  ];


  clients.forEach(
    (client, index) => {

      /*
       * Don't generate sessions for Lead/Completed
       * clients that don't need a recurring session.
       */
      if (
        client.status === 'Completed'
      ) {
        return;
      }


      /*
       * Spread clients across the month.
       */
      const daysInMonth =
        new Date(
          year,
          month + 1,
          0
        ).getDate();


      let day =
        5 + ((index * 5) % 20);


      if (day > daysInMonth) {
        day = daysInMonth;
      }


      const date =
        `${year}-${pad(month + 1)}-${pad(day)}`;


      const startTime =
        demoTimes[
          index % demoTimes.length
        ];


      const key =
        `${client.id}-${date}-${startTime}`;


      /*
       * If a real appointment already exists
       * at exactly this time, don't duplicate it.
       */
      if (
        existingAppointmentKeys.has(key)
      ) {
        return;
      }


      generated.push({

        id:
          `demo-${client.id}-${year}-${month + 1}`,

        clientId:
          client.id,

        clientName:
          client.name,

        date,

        startTime,

        duration:
          index === 2 ? 75 : 50,

        serviceTitle:
          client.occupation ||
          'Individual Psychotherapy Session',

        mode:
          index % 3 === 1
            ? 'In-Person'
            : 'Video Meet',

        status:
          'Scheduled',

        paymentStatus:
          'Paid',

        notesRecorded:
          false,

        meetLink:
          index % 3 === 1
            ? null
            : 'https://meet.google.com/demo-unfazed'

      });
    }
  );


  return generated;
};


// ==================================================
// COMPONENT
// ==================================================

export const Schedule = () => {

  const {
    appointments,
    clients,
    therapist,
    updateTherapist,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
    showToast
  } = useData();


  // ------------------------------------------------
  // TODAY
  // ------------------------------------------------

  const today = useMemo(
    () => new Date(),
    []
  );


  const todayString =
    dateToString(today);


  // ------------------------------------------------
  // CALENDAR STATE
  // ------------------------------------------------

  const [
    selectedMonth,
    setSelectedMonth
  ] = useState(
    getMonthStart(today)
  );


  const [
    calendarView,
    setCalendarView
  ] = useState('week');


  const [
    activeTab,
    setActiveTab
  ] = useState('calendar');


  // ------------------------------------------------
  // SELECTED DAY
  // ------------------------------------------------

  const [
    selectedDate,
    setSelectedDate
  ] = useState(todayString);


  // ------------------------------------------------
  // MODALS
  // ------------------------------------------------

  const [
    newAppointmentOpen,
    setNewAppointmentOpen
  ] = useState(false);


  const [
    selectedAppointment,
    setSelectedAppointment
  ] = useState(null);


  const [
    detailsModalOpen,
    setDetailsModalOpen
  ] = useState(false);


  // ------------------------------------------------
  // AVAILABILITY
  // ------------------------------------------------

  const [
    weeklySchedule,
    setWeeklySchedule
  ] = useState(
    therapist?.availability?.weeklySchedule || {}
  );


  const [
    bufferTime,
    setBufferTime
  ] = useState(
    therapist?.availability?.bufferTime || 15
  );


  const [
    blockedDateInput,
    setBlockedDateInput
  ] = useState('');


  const [
    blockedDates,
    setBlockedDates
  ] = useState(
    therapist?.availability?.blockedDates || []
  );


  // ==================================================
  // MONTH NAVIGATION
  // ==================================================

  const goToPreviousMonth = () => {

    const newMonth =
      new Date(
        selectedMonth.getFullYear(),
        selectedMonth.getMonth() - 1,
        1
      );

    setSelectedMonth(newMonth);

    /*
     * Keep selected day inside the new month.
     */
    const firstDay =
      dateToString(newMonth);

    setSelectedDate(firstDay);
  };


  const goToNextMonth = () => {

    const newMonth =
      new Date(
        selectedMonth.getFullYear(),
        selectedMonth.getMonth() + 1,
        1
      );

    setSelectedMonth(newMonth);

    const firstDay =
      dateToString(newMonth);

    setSelectedDate(firstDay);
  };


  // ==================================================
  // CURRENT MONTH / APPOINTMENTS
  // ==================================================

  const monthAppointments = useMemo(() => {

    /*
     * VERY IMPORTANT:
     *
     * First filter real appointments against
     * currently existing clients.
     *
     * If Rohan is deleted, his old appointment
     * is removed here as an extra safety layer.
     */

    const existingClientIds =
      new Set(
        clients.map(
          (client) => client.id
        )
      );


    const validAppointments =
      appointments.filter(
        (appointment) => {

          if (!appointment.clientId) {
            return true;
          }

          return existingClientIds.has(
            appointment.clientId
          );
        }
      );


    /*
     * Generate monthly demo sessions only from
     * CURRENT clients.
     */
    const recurringAppointments =
      createRecurringDemoAppointments(
        clients,
        validAppointments,
        selectedMonth
      );


    return [
      ...validAppointments,
      ...recurringAppointments
    ];

  }, [
    appointments,
    clients,
    selectedMonth
  ]);


  // ==================================================
  // WEEK DAYS
  // ==================================================

  const weekDays = useMemo(() => {

    const baseDate =
      parseDate(selectedDate);


    /*
     * Monday = 0
     */
    const jsDay =
      baseDate.getDay();


    const mondayOffset =
      jsDay === 0
        ? -6
        : 1 - jsDay;


    const monday =
      new Date(baseDate);


    monday.setDate(
      baseDate.getDate() +
      mondayOffset
    );


    return Array.from(
      { length: 7 },
      (_, index) => {

        const date =
          new Date(monday);


        date.setDate(
          monday.getDate() +
          index
        );


        return {
          day:
            date.toLocaleDateString(
              'en-IN',
              {
                weekday: 'short'
              }
            ),

          date:
            dateToString(date),

          fullDate:
            date
        };
      }
    );

  }, [
    selectedDate
  ]);


  // ==================================================
  // OPEN APPOINTMENT
  // ==================================================

  const handleOpenAppointmentDetails = (
    appointment
  ) => {

    setSelectedAppointment(
      appointment
    );

    setDetailsModalOpen(true);
  };


  // ==================================================
  // COMPLETE
  // ==================================================

  const handleMarkCompleted = () => {

    if (!selectedAppointment) {
      return;
    }


    updateAppointment(
      selectedAppointment.id,
      {
        status: 'Completed',
        notesRecorded: true
      }
    );


    setDetailsModalOpen(false);


    showToast(
      `Session with ${selectedAppointment.clientName} marked completed`
    );
  };


  // ==================================================
  // CANCEL
  // ==================================================

  const handleCancelSession = () => {

    if (!selectedAppointment) {
      return;
    }


    cancelAppointment(
      selectedAppointment.id
    );


    setDetailsModalOpen(false);
  };


  // ==================================================
  // DELETE
  // ==================================================

  const handleDeleteAppointment = () => {

    if (!selectedAppointment) {
      return;
    }


    const confirmed =
      window.confirm(
        `Delete this session with ${selectedAppointment.clientName}? This cannot be undone.`
      );


    if (!confirmed) {
      return;
    }


    deleteAppointment(
      selectedAppointment.id
    );


    setDetailsModalOpen(false);
  };


  // ==================================================
  // AVAILABILITY
  // ==================================================

  const handleSaveAvailability = (
    event
  ) => {

    event.preventDefault();


    updateTherapist({
      availability: {
        ...therapist.availability,

        weeklySchedule,

        bufferTime,

        blockedDates
      }
    });


    showToast(
      'Availability schedule updated successfully'
    );
  };


  const handleAddBlockedDate = () => {

    if (
      !blockedDateInput ||
      blockedDates.includes(
        blockedDateInput
      )
    ) {
      return;
    }


    setBlockedDates([
      ...blockedDates,
      blockedDateInput
    ]);


    setBlockedDateInput('');
  };


  const handleRemoveBlockedDate = (
    dateToRemove
  ) => {

    setBlockedDates(
      blockedDates.filter(
        (date) =>
          date !== dateToRemove
      )
    );
  };


  // ==================================================
  // SELECTED DAY APPOINTMENTS
  // ==================================================

  const selectedDayAppointments =
    monthAppointments.filter(
      (appointment) =>
        appointment.date === selectedDate
    );


  // ==================================================
  // RENDER
  // ==================================================

  return (

    <div className="flex-1 flex flex-col min-w-0 bg-vanilla pb-16">


      {/* ==============================================
          HEADER
      ============================================== */}

      <div className="bg-white border-b border-misty/30 px-6 sm:px-8 py-6">

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>

            <div className="flex items-center gap-2">

              <span className="text-xs font-bold uppercase tracking-wider text-rosewood">
                Calendar & Availability
              </span>

              <span className="w-1.5 h-1.5 rounded-full bg-sage" />

              <span className="text-xs font-semibold text-midnight-muted">
                Timezone: Asia/Kolkata (IST)
              </span>

            </div>


            <h1 className="text-2xl sm:text-3xl font-bold font-display text-midnight tracking-tight mt-1">
              Practice Scheduling
            </h1>

          </div>


          <div className="flex items-center gap-3">

            <div className="bg-vanilla/60 p-1 rounded-2xl border border-misty/30 flex items-center">

              <button
                onClick={() =>
                  setActiveTab('calendar')
                }
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'calendar'
                    ? 'bg-midnight text-vanilla shadow-sm'
                    : 'text-midnight-muted hover:text-midnight'
                }`}
              >
                Calendar View
              </button>


              <button
                onClick={() =>
                  setActiveTab('availability')
                }
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'availability'
                    ? 'bg-midnight text-vanilla shadow-sm'
                    : 'text-midnight-muted hover:text-midnight'
                }`}
              >

                <Sliders size={13} />

                <span>
                  Manage Availability
                </span>

              </button>

            </div>


            <button
              onClick={() =>
                setNewAppointmentOpen(true)
              }
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-rosewood text-white text-xs font-semibold hover:bg-rosewood-hover transition shadow-md shadow-rosewood/20"
            >

              <Plus size={15} />

              <span>
                New Appointment
              </span>

            </button>

          </div>

        </div>

      </div>


      {/* ==============================================
          MAIN
      ============================================== */}

      <main className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-6">


        {activeTab === 'calendar' ? (

          <>


            {/* ==========================================
                CALENDAR CONTROLS
            ========================================== */}

            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-misty/30 card-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">

              <div className="flex items-center gap-3">

                <h3 className="text-base font-bold font-display text-midnight">
                  {monthLabel(selectedMonth)}
                </h3>


                <div className="flex items-center gap-1">

                  <button
                    onClick={
                      goToPreviousMonth
                    }
                    className="p-1.5 rounded-xl border border-misty/30 text-midnight-muted hover:text-midnight hover:bg-vanilla transition"
                    title="Previous month"
                  >
                    <ChevronLeft size={16} />
                  </button>


                  <button
                    onClick={
                      goToNextMonth
                    }
                    className="p-1.5 rounded-xl border border-misty/30 text-midnight-muted hover:text-midnight hover:bg-vanilla transition"
                    title="Next month"
                  >
                    <ChevronRight size={16} />
                  </button>

                </div>

              </div>


              <div className="flex items-center gap-1 bg-vanilla/40 p-1 rounded-2xl border border-misty/30 self-start sm:self-auto">

                {[
                  'month',
                  'week',
                  'day'
                ].map(
                  (view) => (

                    <button
                      key={view}
                      onClick={() =>
                        setCalendarView(
                          view
                        )
                      }
                      className={`px-3.5 py-1 rounded-xl text-xs font-bold capitalize transition ${
                        calendarView === view
                          ? 'bg-white text-midnight shadow-sm border border-misty/20'
                          : 'text-midnight-muted hover:text-midnight'
                      }`}
                    >
                      {view} View
                    </button>

                  )
                )}

              </div>

            </div>


            {/* ==========================================
                WEEK VIEW
            ========================================== */}

            {calendarView === 'week' && (

              <div className="bg-white rounded-3xl border border-misty/30 card-shadow overflow-hidden">


                <div className="grid grid-cols-7 border-b border-misty/20 bg-vanilla/40 text-center">

                  {weekDays.map(
                    (day) => {

                      const isToday =
                        day.date ===
                        todayString;


                      const isSelected =
                        day.date ===
                        selectedDate;


                      return (

                        <button
                          key={day.date}
                          onClick={() =>
                            setSelectedDate(
                              day.date
                            )
                          }
                          className={`py-4 px-2 border-r last:border-r-0 border-misty/20 transition ${
                            isToday
                              ? 'bg-blush-light/50'
                              : ''
                          } ${
                            isSelected
                              ? 'ring-inset ring-2 ring-rosewood/20'
                              : ''
                          }`}
                        >

                          <span className="text-[11px] font-bold uppercase tracking-wider text-midnight-muted block">
                            {day.day}
                          </span>


                          <span
                            className={`text-base font-extrabold inline-block mt-1 w-8 h-8 rounded-full leading-8 ${
                              isToday
                                ? 'bg-rosewood text-white shadow-sm'
                                : 'text-midnight'
                            }`}
                          >
                            {day.fullDate.getDate()}
                          </span>

                        </button>

                      );
                    }
                  )}

                </div>


                <div className="grid grid-cols-7 min-h-[500px] divide-x divide-misty/20">

                  {weekDays.map(
                    (day) => {

                      const dayAppointments =
                        monthAppointments.filter(
                          (appointment) =>
                            appointment.date ===
                            day.date
                        );


                      const isToday =
                        day.date ===
                        todayString;


                      return (

                        <div
                          key={day.date}
                          className={`p-2.5 space-y-2.5 flex flex-col ${
                            isToday
                              ? 'bg-blush-light/10'
                              : ''
                          }`}
                        >

                          {dayAppointments.length === 0 ? (

                            <div className="flex-1 flex items-center justify-center">

                              <span className="text-[11px] text-midnight-muted/40 font-medium italic">
                                No sessions
                              </span>

                            </div>

                          ) : (

                            dayAppointments.map(
                              (appointment) => (

                                <div
                                  key={
                                    appointment.id
                                  }
                                  onClick={() =>
                                    handleOpenAppointmentDetails(
                                      appointment
                                    )
                                  }
                                  className="p-3 rounded-2xl bg-vanilla/50 hover:bg-vanilla border border-misty/30 hover:border-rosewood/40 transition cursor-pointer group shadow-sm text-left"
                                >

                                  <div className="flex items-center justify-between mb-1">

                                    <span className="text-[10px] font-bold text-rosewood flex items-center gap-1">

                                      <Clock size={10} />

                                      {formatTime(
                                        appointment.startTime
                                      )}

                                    </span>


                                    <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-semibold border ${getStatusBadgeColor(appointment.status)}`}>
                                      {appointment.status}
                                    </span>

                                  </div>


                                  <h5 className="text-xs font-bold text-midnight group-hover:text-rosewood transition truncate">
                                    {appointment.clientName}
                                  </h5>


                                  <p className="text-[10px] text-midnight-muted truncate">
                                    {appointment.serviceTitle}
                                  </p>


                                  <div className="flex items-center gap-1 mt-2 text-[10px] text-midnight-muted">

                                    {appointment.mode ===
                                    'Video Meet' ? (

                                      <Video
                                        size={11}
                                        className="text-sage"
                                      />

                                    ) : (

                                      <MapPin
                                        size={11}
                                        className="text-misty"
                                      />

                                    )}

                                    <span>
                                      {appointment.duration}m
                                    </span>

                                  </div>

                                </div>

                              )
                            )

                          )}

                        </div>

                      );

                    }
                  )}

                </div>

              </div>

            )}


            {/* ==========================================
                MONTH VIEW
            ========================================== */}

            {calendarView === 'month' && (

              <div className="bg-white rounded-3xl p-6 border border-misty/30 card-shadow">

                <div className="grid grid-cols-7 gap-2">

                  {[
                    'Mon',
                    'Tue',
                    'Wed',
                    'Thu',
                    'Fri',
                    'Sat',
                    'Sun'
                  ].map(
                    (day) => (

                      <div
                        key={day}
                        className="text-xs font-bold uppercase text-midnight-muted py-2 text-center"
                      >
                        {day}
                      </div>

                    )
                  )}


                  {(() => {

                    const firstDay =
                      getMonthStart(
                        selectedMonth
                      );


                    const lastDay =
                      getMonthEnd(
                        selectedMonth
                      );


                    const firstWeekday =
                      firstDay.getDay() === 0
                        ? 6
                        : firstDay.getDay() - 1;


                    const days = [];


                    for (
                      let i = 0;
                      i < firstWeekday;
                      i++
                    ) {

                      days.push(
                        <div
                          key={`empty-${i}`}
                          className="min-h-24"
                        />
                      );
                    }


                    for (
                      let day = 1;
                      day <=
                      lastDay.getDate();
                      day++
                    ) {

                      const date =
                        new Date(
                          selectedMonth.getFullYear(),
                          selectedMonth.getMonth(),
                          day
                        );


                      const dateString =
                        dateToString(
                          date
                        );


                      const count =
                        monthAppointments.filter(
                          (appointment) =>
                            appointment.date ===
                            dateString
                        ).length;


                      const isToday =
                        dateString ===
                        todayString;


                      const isSelected =
                        dateString ===
                        selectedDate;


                      days.push(

                        <button
                          key={
                            dateString
                          }
                          onClick={() => {

                            setSelectedDate(
                              dateString
                            );

                            setCalendarView(
                              'day'
                            );

                          }}
                          className={`min-h-24 p-2 rounded-2xl border text-left flex flex-col justify-between transition ${
                            isToday
                              ? 'border-rosewood bg-blush-light/30'
                              : 'border-misty/20 hover:bg-vanilla/30'
                          } ${
                            isSelected
                              ? 'ring-2 ring-rosewood/20'
                              : ''
                          }`}
                        >

                          <span
                            className={`text-xs font-bold ${
                              isToday
                                ? 'text-rosewood'
                                : 'text-midnight'
                            }`}
                          >
                            {day}
                          </span>


                          {count > 0 && (

                            <span className="inline-block px-2 py-0.5 rounded-lg bg-rosewood text-white text-[10px] font-bold self-start">
                              {count}{' '}
                              {count === 1
                                ? 'session'
                                : 'sessions'}
                            </span>

                          )}

                        </button>

                      );
                    }


                    return days;

                  })()}

                </div>

              </div>

            )}


            {/* ==========================================
                DAY VIEW
            ========================================== */}

            {calendarView === 'day' && (

              <div className="bg-white rounded-3xl p-6 border border-misty/30 card-shadow space-y-4">

                <div className="flex items-center justify-between gap-3">

                  <div>

                    <h4 className="text-base font-bold font-display text-midnight">

                      {parseDate(
                        selectedDate
                      ).toLocaleDateString(
                        'en-IN',
                        {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        }
                      )}

                    </h4>


                    {selectedDate ===
                      todayString && (

                      <span className="text-xs text-rosewood font-semibold">
                        Today
                      </span>

                    )}

                  </div>


                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(event) =>
                      setSelectedDate(
                        event.target.value
                      )
                    }
                    className="px-3 py-2 rounded-xl border border-misty/40 text-xs text-midnight focus:outline-none focus:border-rosewood"
                  />

                </div>


                <div className="space-y-3">

                  {selectedDayAppointments.length ===
                  0 ? (

                    <div className="py-12 text-center">

                      <CalendarIcon
                        size={34}
                        className="mx-auto text-midnight-muted opacity-40 mb-3"
                      />

                      <p className="text-sm font-semibold text-midnight">
                        No sessions scheduled
                      </p>

                      <p className="text-xs text-midnight-muted mt-1">
                        Create a new appointment for this date.
                      </p>

                    </div>

                  ) : (

                    selectedDayAppointments.map(
                      (appointment) => (

                        <div
                          key={
                            appointment.id
                          }
                          onClick={() =>
                            handleOpenAppointmentDetails(
                              appointment
                            )
                          }
                          className="p-4 rounded-2xl bg-vanilla/40 border border-misty/30 flex items-center justify-between cursor-pointer hover:bg-vanilla transition"
                        >

                          <div className="flex items-center gap-4">

                            <span className="font-mono font-bold text-sm text-rosewood">
                              {formatTime(
                                appointment.startTime
                              )}
                            </span>


                            <div>

                              <h5 className="text-sm font-bold text-midnight">
                                {appointment.clientName}
                              </h5>

                              <p className="text-xs text-midnight-muted">
                                {appointment.serviceTitle}
                                {' • '}
                                {appointment.duration}
                                {' mins • '}
                                {appointment.mode}
                              </p>

                            </div>

                          </div>


                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(appointment.status)}`}>
                            {appointment.status}
                          </span>

                        </div>

                      )
                    )

                  )}

                </div>

              </div>

            )}

          </>

        ) : (

          /* ==========================================
             AVAILABILITY
          ========================================== */

          <form
            onSubmit={
              handleSaveAvailability
            }
            className="bg-white rounded-3xl p-6 sm:p-8 border border-misty/30 card-shadow space-y-8"
          >

            <div>

              <span className="text-xs font-bold uppercase tracking-wider text-rosewood">
                Client Booking Rules
              </span>

              <h3 className="text-xl font-bold font-display text-midnight mt-1">
                Therapist Availability & Buffer Configuration
              </h3>

              <p className="text-xs text-midnight-muted mt-1 leading-relaxed max-w-2xl">
                Define the recurring weekly slots when clients can book through your public link. Unfazed ensures slots auto-block once booked to prevent double-booking.
              </p>

            </div>


            {/* BUFFER */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-2xl bg-vanilla/50 border border-misty/30">

              <div>

                <label className="block text-xs font-bold text-midnight mb-1">
                  Buffer Time Between Sessions (Minutes)
                </label>

                <p className="text-[11px] text-midnight-muted mb-2">
                  Essential rest and note-taking buffer for therapist wellbeing.
                </p>

                <select
                  value={bufferTime}
                  onChange={(event) =>
                    setBufferTime(
                      Number(
                        event.target.value
                      )
                    )
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood bg-white"
                >

                  <option value={0}>
                    0 minutes (Back to back)
                  </option>

                  <option value={10}>
                    10 minutes
                  </option>

                  <option value={15}>
                    15 minutes (Recommended)
                  </option>

                  <option value={20}>
                    20 minutes
                  </option>

                  <option value={30}>
                    30 minutes
                  </option>

                </select>

              </div>


              <div>

                <label className="block text-xs font-bold text-midnight mb-1">
                  Practice Timezone
                </label>

                <p className="text-[11px] text-midnight-muted mb-2">
                  Client booking calendar auto-translates to client's local zone.
                </p>

                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm bg-white text-midnight">

                  <Globe
                    size={16}
                    className="text-rosewood"
                  />

                  <span>
                    Asia/Kolkata (Indian Standard Time, GMT+5:30)
                  </span>

                </div>

              </div>

            </div>


            {/* WEEKLY SCHEDULE */}

            <div className="space-y-3">

              <h4 className="text-sm font-bold text-midnight">
                Weekly Recurring Availability
              </h4>


              <div className="space-y-2.5">

                {Object.entries(
                  weeklySchedule
                ).map(
                  ([
                    dayKey,
                    dayData
                  ]) => (

                    <div
                      key={dayKey}
                      className="p-3.5 rounded-2xl bg-white border border-misty/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >

                      <div className="flex items-center gap-3">

                        <input
                          type="checkbox"
                          checked={
                            dayData.active
                          }
                          onChange={(event) => {

                            setWeeklySchedule(
                              {
                                ...weeklySchedule,

                                [dayKey]: {
                                  ...dayData,
                                  active:
                                    event.target.checked
                                }
                              }
                            );

                          }}
                          className="w-4 h-4 rounded text-rosewood focus:ring-rosewood"
                        />

                        <span className="text-xs font-bold uppercase tracking-wider text-midnight capitalize w-24">
                          {dayKey}
                        </span>

                      </div>


                      {dayData.active ? (

                        <div className="flex items-center gap-2 text-xs">

                          <span className="text-midnight-muted">
                            From
                          </span>

                          <input
                            type="time"
                            value={
                              dayData.start
                            }
                            onChange={(event) => {

                              setWeeklySchedule(
                                {
                                  ...weeklySchedule,

                                  [dayKey]: {
                                    ...dayData,
                                    start:
                                      event.target.value
                                  }
                                }
                              );

                            }}
                            className="px-2.5 py-1.5 rounded-xl border border-misty/40 text-xs focus:outline-none focus:border-rosewood"
                          />


                          <span className="text-midnight-muted">
                            to
                          </span>

                          <input
                            type="time"
                            value={
                              dayData.end
                            }
                            onChange={(event) => {

                              setWeeklySchedule(
                                {
                                  ...weeklySchedule,

                                  [dayKey]: {
                                    ...dayData,
                                    end:
                                      event.target.value
                                  }
                                }
                              );

                            }}
                            className="px-2.5 py-1.5 rounded-xl border border-misty/40 text-xs focus:outline-none focus:border-rosewood"
                          />

                        </div>

                      ) : (

                        <span className="text-xs text-midnight-muted italic">
                          Unavailable (Closed)
                        </span>

                      )}

                    </div>

                  )
                )}

              </div>

            </div>


            {/* BLOCKED DATES */}

            <div className="space-y-3 pt-4 border-t border-misty/20">

              <h4 className="text-sm font-bold text-midnight">
                Blocked Dates & Holidays
              </h4>

              <p className="text-xs text-midnight-muted">
                Clients will not be able to book sessions on these specific dates.
              </p>


              <div className="flex items-center gap-3">

                <input
                  type="date"
                  value={
                    blockedDateInput
                  }
                  onChange={(event) =>
                    setBlockedDateInput(
                      event.target.value
                    )
                  }
                  className="px-3 py-2 rounded-xl border border-misty/50 text-xs focus:outline-none focus:border-rosewood"
                />


                <button
                  type="button"
                  onClick={
                    handleAddBlockedDate
                  }
                  className="px-4 py-2 rounded-xl bg-midnight text-vanilla text-xs font-semibold hover:bg-midnight-light transition"
                >
                  Block Date
                </button>

              </div>


              <div className="flex flex-wrap gap-2 pt-1">

                {blockedDates.map(
                  (date) => (

                    <span
                      key={date}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rosewood-light text-rosewood text-xs font-medium border border-rosewood/30"
                    >

                      <span>
                        {date}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveBlockedDate(
                            date
                          )
                        }
                        className="hover:text-midnight font-bold"
                      >
                        ×
                      </button>

                    </span>

                  )
                )}

              </div>

            </div>


            {/* SAVE */}

            <div className="flex justify-end pt-4 border-t border-misty/20">

              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-rosewood text-white font-semibold text-sm hover:bg-rosewood-hover transition shadow-md shadow-rosewood/20"
              >
                Save Availability Settings
              </button>

            </div>

          </form>

        )}

      </main>


      {/* ==============================================
          NEW APPOINTMENT
      ============================================== */}

      <NewAppointmentModal
        isOpen={
          newAppointmentOpen
        }
        onClose={() =>
          setNewAppointmentOpen(false)
        }
      />


      {/* ==============================================
          APPOINTMENT DETAILS
      ============================================== */}

      {selectedAppointment && (

        <Modal
          isOpen={
            detailsModalOpen
          }
          onClose={() =>
            setDetailsModalOpen(false)
          }
          title="Appointment Details"
          subtitle={`${selectedAppointment.serviceTitle} with ${selectedAppointment.clientName}`}
          maxWidth="max-w-md"
        >

          <div className="space-y-4 text-xs">

            <div className="p-4 rounded-2xl bg-vanilla/40 border border-misty/30 space-y-2">

              <div className="flex justify-between">

                <span className="text-midnight-muted">
                  Client:
                </span>

                <span className="font-bold text-midnight">
                  {selectedAppointment.clientName}
                </span>

              </div>


              <div className="flex justify-between">

                <span className="text-midnight-muted">
                  Date & Time:
                </span>

                <span className="font-bold text-midnight">
                  {selectedAppointment.date}
                  {' at '}
                  {formatTime(
                    selectedAppointment.startTime
                  )}
                </span>

              </div>


              <div className="flex justify-between">

                <span className="text-midnight-muted">
                  Modality:
                </span>

                <span className="font-bold text-midnight">
                  {selectedAppointment.mode}
                </span>

              </div>


              <div className="flex justify-between">

                <span className="text-midnight-muted">
                  Status:
                </span>

                <span className={`px-2 py-0.5 rounded-full font-semibold border ${getStatusBadgeColor(selectedAppointment.status)}`}>
                  {selectedAppointment.status}
                </span>

              </div>

            </div>


            {selectedAppointment.mode ===
              'Video Meet' &&
              selectedAppointment.meetLink && (

              <a
                href={
                  selectedAppointment.meetLink
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-midnight text-vanilla font-semibold flex items-center justify-center gap-2 hover:bg-midnight-light transition"
              >

                <Video
                  size={14}
                  className="text-blush"
                />

                <span>
                  Join Video Meeting Room
                </span>

              </a>

            )}


            <div className="flex items-center gap-2 pt-2">

              <button
                onClick={
                  handleMarkCompleted
                }
                className="flex-1 py-2.5 rounded-xl bg-sage text-white font-semibold hover:bg-sage-dark transition"
              >
                Mark Completed
              </button>


              <button
                onClick={
                  handleCancelSession
                }
                className="py-2.5 px-4 rounded-xl bg-rosewood-light text-rosewood font-semibold hover:bg-rosewood hover:text-white transition"
              >
                Cancel Session
              </button>


              <button
                onClick={
                  handleDeleteAppointment
                }
                className="p-2.5 rounded-xl border border-misty/40 text-rosewood hover:bg-blush-light transition"
                title="Delete appointment"
              >

                <Trash2 size={16} />

              </button>

            </div>

          </div>

        </Modal>

      )}

    </div>
  );
};


export default Schedule;