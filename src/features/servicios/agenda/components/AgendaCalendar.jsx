import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import '../../../../shared/styles/features/agenda-calendar.css';

/**
 * Componente de calendario para la agenda
 * @param {Array} events - Lista de eventos (citas y horarios)
 * @param {Function} onEventClick - Manejador al hacer clic en un evento
 * @param {string} height - Altura del calendario (por defecto "100%")
 * @param {string} initialView - Vista inicial (timeGridWeek, timeGridDay, dayGridMonth)
 * @param {boolean} selectable - Permitir selección de fechas/horas
 */
export default function AgendaCalendar({
  events = [],
  onEventClick,
  height = "100%",
  initialView = "timeGridWeek",
  selectable = true,
}) {
  // Configuración de botones según idioma
  const buttonText = {
    today: "Hoy",
    month: "Mes",
    week: "Semana",
    day: "Día",
  };

  // Formato de hora para slots y eventos (12h AM/PM)
  const timeFormat = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      locale={esLocale}
      initialView={initialView}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "timeGridDay,timeGridWeek,dayGridMonth",
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
      // Nuevas propiedades para la vista de mes:
      showNonCurrentDates={false}      // Oculta días de meses anteriores/siguientes
      fixedWeekCount={false}           // No fuerza 6 semanas; se ajusta al contenido real
    />
  );
}