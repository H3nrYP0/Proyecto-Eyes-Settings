import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { getAllAgenda } from "../../../../lib/data/agendaData";
import "../../../../shared/styles/features/agenda-calendar.css";

export default function Agenda() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    cargarHorarios();
  }, []);

  const cargarHorarios = async () => {
    const data = await getAllAgenda();

    const mappedEvents = data.map((h) => ({
      id: h.id,
      title: "Disponible",
      daysOfWeek: [h.dia],
      startTime: h.hora_inicio,
      endTime: h.hora_final,
      display: "background",
      backgroundColor: "#4CAF50",
    }));

    setEvents(mappedEvents);
  };

  return (
  <div className="agenda-container">
    <div className="agenda-header">
      <h1>Agenda</h1>
      <button
        className="agenda-btn"
        onClick={() => navigate("crear")}
      >
        Crear Horario
      </button>
    </div>

    <div className="agenda-calendar-wrapper">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        locale={esLocale}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
        buttonText={{
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día"
        }}
        allDaySlot={false}
        slotMinTime="06:00:00"
        slotMaxTime="20:00:00"
        slotDuration="00:30:00"
        expandRows={true}
        height="100%"
        events={events}
      />
    </div>
  </div>
);
}
