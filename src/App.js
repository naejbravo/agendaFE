import { Calendar, momentLocalizer } from "react-big-calendar";
import Modal from "react-modal";
import "react-big-calendar/lib/css/react-big-calendar.css";
import React, { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import moment from "moment";
import "moment/locale/es";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
registerLocale("es", es);

const urlLocal = "http://localhost:8000/agenda";
const urlCloud = "https://agenda-be.vercel.app/agenda";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("body");

const locales = {
  es: es,
};

moment.locale("es");

const localizerMoment = momentLocalizer(moment);

function App() {
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
  const [events, setEvents] = useState();
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [modalIsOpenConfirm, setIsOpenConfirm] = React.useState(false);
  const [dataModal, setDataModal] = React.useState({});

  useEffect(() => {
    getEvents();
  }, []);

  const handleEvent = () => {
    console.log(newEvent);
    setEvents([...events, newEvent]);
    postEvent();
  };

  const postEvent = async () => {
    try {
      const requestOptions = {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newEvent.title,
          startDate: newEvent.start.toISOString(),
          endDate: newEvent.end.toISOString(),
        }),
      };
      const fetchResponse = await fetch(urlLocal, requestOptions);
      const data = await fetchResponse.json();
      getEvents();
    } catch (error) {
      return error;
    }
  };

  const getEvents = async () => {
    try {
      const fetchResponse = await fetch(urlLocal, {
        method: "GET",
        mode: "cors",
      });
      const data = await fetchResponse.json();
      data.map((item) => {
        item["start"] = item["startDate"];
        delete item["startDate"];
        item.start = new Date(item.start);
        item["end"] = item["endDate"];
        delete item["endDate"];
        item.end = new Date(item.end);
      });
      setEvents(data);
    } catch (error) {
      return error;
    }
  };

  const deleteEvent = async () => {
    try {
      console.log(dataModal._id);
      const fetchResponse = await fetch(`${urlLocal}/${dataModal._id}`, {
        method: "DELETE",
        mode: "cors",
      });
      const data = await fetchResponse.json();
      setIsOpenConfirm(false);
      setIsOpen(false);
      getEvents();
    } catch (error) {
      return error;
    }
  };

  const onSelectEvent = async (e) => {
    console.log("seleccionado", e);
    setIsOpen(true);
    // let start = e.start.toDateString();
    // let end = e.end.toDateString();
    // console.log(start);
    setDataModal({
      _id: e._id,
      start: e.start,
      end: e.end,
      title: e.title,
    });
  };

  const onDeleteEvent = async (e) => {
    console.log("seleccionado para borrar", e);
    setIsOpenConfirm(true);
    // setDataModal({

    // });
  };

  const onUpdateEvent = async (e) => {
    try {
      console.log(dataModal._id);
      const fetchResponse = await fetch(`${urlLocal}/${dataModal._id}`, {
        method: "put",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: dataModal.title,
          startDate: dataModal.start.toISOString(),
          endDate: dataModal.end.toISOString(),
        }),
      });
      const data = await fetchResponse.json();
      getEvents();
      setIsOpenConfirm(false);
      setIsOpen(false);
    } catch (error) {
      return error;
    }
  };

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false);
    setIsOpenConfirm(false);
  }

  return (
    <div className="App">
      <h2>Nuevo evento</h2>
      <div className="pick">
        <input
          type="text"
          placeholder="Titulo"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <div>
          <DatePicker
            placeholderText="Fecha de inicio"
            selected={newEvent.start}
            onChange={(start) => setNewEvent({ ...newEvent, start })}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={60}
            timeCaption="hora"
            dateFormat="MMMM d, yyyy h:mm aa"
            locale="es"
          />
        </div>

        <div>
          <DatePicker
            placeholderText="Fecha de fin"
            selected={newEvent.end}
            onChange={(end) => setNewEvent({ ...newEvent, end })}
            showTimeSelect
            timeIntervals={60}
            timeFormat="HH:mm"
            timeCaption="hora"
            dateFormat="MMMM d, yyyy h:mm aa"
            locale="es"
          />
        </div>

        <button onClick={handleEvent}>Agregar evento</button>
      </div>
      <Calendar
        localizer={localizerMoment}
        startAccessor="start"
        endAccessor="end"
        events={events}
        onSelectEvent={onSelectEvent}
        style={{
          height: 500,
          margin: "50px",
        }}
        messages={{
          date: "Fecha",
          time: "Hora",
          event: "Eventos",
          next: ">",
          previous: "<",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
          agenda: "Diario",
          noEventsInRange:
            "No hay eventos para montrar en este rango de fechas.",
        }}
      />
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {dataModal && (
          <div>
            <label>
              Titulo:{" "}
              <input
                type="text"
                value={dataModal.title}
                onChange={(title) =>
                  setDataModal({ ...dataModal, title: title.target.value })
                }
              />
            </label>

            <div>
              <label>
                Fecha inicio:
                <DatePicker
                  placeholderText="Fecha de inicio"
                  selected={dataModal.start}
                  onChange={(start) => setDataModal({ ...dataModal, start })}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={60}
                  timeCaption="hora"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  locale="es"
                />
              </label>
            </div>

            <div>
              <label>
                Fecha fin:
                <DatePicker
                  placeholderText="Fecha de fin"
                  selected={dataModal.end}
                  onChange={(end) => setDataModal({ ...dataModal, end })}
                  showTimeSelect
                  timeIntervals={60}
                  timeFormat="HH:mm"
                  timeCaption="hora"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  locale="es"
                />
              </label>
            </div>
            <button onClick={onUpdateEvent}>Guardar cambios</button>
            <button onClick={onDeleteEvent}>Eliminar evento</button>
            <button onClick={closeModal}>Cerrar</button>
          </div>
        )}
      </Modal>
      <Modal
        isOpen={modalIsOpenConfirm}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {dataModal && (
          <div>
            <p>¿Estas seguro que deseas eliminar este evento?</p>
            <button onClick={deleteEvent}>Eliminar</button>
            <button onClick={closeModal}>Cancelar</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default App;
