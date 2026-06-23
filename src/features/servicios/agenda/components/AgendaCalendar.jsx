import { forwardRef, useState, useRef } from "react";
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
  // Estado para el tooltip
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: null,
  });
  const calendarRef = useRef(null);
  let timeoutId = null;

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

  // 🔥 Función para formatear hora en AM/PM
  const formatHoraAmPm = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  // Manejar entrada del mouse sobre un evento
  const handleEventMouseEnter = (info) => {
    const props = info.event.extendedProps;
    // Solo mostrar tooltip para citas
    if (props?.tipo !== 'cita') return;

    // Limpiar timeout anterior
    if (timeoutId) clearTimeout(timeoutId);

    // Obtener posición del evento para posicionar el tooltip
    const el = info.el;
    const rect = el.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    // Construir contenido del tooltip
    const content = (
      <div className="agenda-tooltip-content">
        <div className="tooltip-cliente">
          <strong>Cliente:</strong> {props.cliente || 'Sin nombre'}
        </div>
        <div className="tooltip-servicio">
          <strong>Servicio:</strong> {props.servicio || 'Sin servicio'}
        </div>
        <div className="tooltip-estado">
          <strong>Estado:</strong> {props.estado || 'Sin estado'}
        </div>
        <div className="tooltip-empleado">
          <strong>Empleado:</strong> {props.empleado_nombre || 'No asignado'}
        </div>
        <div className="tooltip-hora">
          <strong>Hora:</strong> {info.event.start ? formatHoraAmPm(info.event.start) : ''}
        </div>
      </div>
    );

    // Posicionar el tooltip (encima del evento si es posible)
    const tooltipX = rect.left + scrollX + rect.width / 2;
    const tooltipY = rect.top + scrollY - 10;

    setTooltip({
      visible: true,
      x: tooltipX,
      y: tooltipY,
      content,
    });
  };

  // Manejar salida del mouse del evento
  const handleEventMouseLeave = () => {
    // Esperar 300ms antes de ocultar para evitar parpadeos
    timeoutId = setTimeout(() => {
      setTooltip({ visible: false, x: 0, y: 0, content: null });
    }, 300);
  };

  // Si el usuario entra al tooltip, cancelamos el ocultamiento
  const handleTooltipMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
  };

  const handleTooltipMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, content: null });
  };

  return (
    <>
      <FullCalendar
        ref={ref}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        locale={esLocale}
        initialView={initialView}
        headerToolbar={{
          left: "prev,next",
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
        eventMouseEnter={handleEventMouseEnter}
        eventMouseLeave={handleEventMouseLeave}
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

      {/* Tooltip flotante */}
      {tooltip.visible && (
        <div
          className="agenda-tooltip"
          style={{
            position: 'absolute',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
            zIndex: 9999,
          }}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
        >
          {tooltip.content}
          <div className="tooltip-arrow" />
        </div>
      )}
    </>
  );
});

AgendaCalendar.displayName = 'AgendaCalendar';
export default AgendaCalendar;