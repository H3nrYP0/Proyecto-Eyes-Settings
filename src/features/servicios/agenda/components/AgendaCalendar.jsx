import { forwardRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import '@shared/styles/features/agenda-calendar.css';

const AgendaCalendar = forwardRef(({
  events = [],
  onEventClick,
  height = "100%",
  initialView = "timeGridWeek",
  selectable = true,
}, ref) => {
  const buttonText = {
    today: "Hoy",
    month: "Mes",
    week: "Semana",
    day: "Día",
  };

  const timeFormat = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return (
    <FullCalendar
      ref={ref}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      locale={esLocale}
      initialView={initialView}
      headerToolbar={{
        left: "prev,next",
        center: "title",
        right: "timeGridDay,timeGridWeek,dayGridMonth",  // botones Día, Semana, Mes
      }}
      buttonText={buttonText}
      allDaySlot={false}
      slotMinTime="08:00:00"
      slotMaxTime="20:00:00"
      slotDuration="00:20:00"
      slotLabelInterval="01:00:00"
      slotLabelFormat={timeFormat}
      eventTimeFormat={timeFormat}
      expandRows={true}
      height={height}
      events={events}
      eventClick={onEventClick}
      selectable={selectable}
      selectMirror={true}
      dayMaxEvents={true}
      weekends={true}
      nowIndicator={true}
      nowIndicatorClassNames="fc-now-indicator-custom"
      eventDisplay="block"
      eventBackgroundColor="transparent"
      eventBorderColor="transparent"
      eventTextColor="#fff"
      eventOverlap={false}
      slotEventOverlap={false}
      displayEventTime={true}
      displayEventEnd={true}
      windowResizeDelay={200}
      handleWindowResize={true}
      showNonCurrentDates={false}
      fixedWeekCount={false}
    />
  );
});

AgendaCalendar.displayName = 'AgendaCalendar';
export default AgendaCalendar;