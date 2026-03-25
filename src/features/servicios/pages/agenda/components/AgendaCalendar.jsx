import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

export default function AgendaCalendar({ events, onEventClick, height = "100%" }) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      locale={esLocale}
      initialView="timeGridWeek"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridDay,timeGridWeek,dayGridMonth'
      }}
      buttonText={{ today: 'Hoy', month: 'Mes', week: 'Semana', day: 'Día' }}
      allDaySlot={false}
      slotMinTime="08:00:00"
      slotMaxTime="20:00:00"
      slotDuration="00:30:00"
      expandRows={true}
      height={height}
      events={events}
      eventClick={onEventClick}
      selectable={true}
      selectMirror={true}
      dayMaxEvents={true}
      weekends={true}
      eventTimeFormat={{ hour: '2-digit', minute: '2-digit' }}
    />
  );
}