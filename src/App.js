import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import "moment/locale/es";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Modal from "react-modal";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import "./App.scss";

import NewEvent from "./components/NewEvent";
import UpdateEvent from "./components/UpdateEvent";
import DeleteEventConfirm from "./components/DeleteEventConfirm";

const urlLocal = "http://localhost:8000/agenda";
const urlCloud = "https://agenda-be.vercel.app/agenda";

const expresiones = {
  usuario: /^[a-zA-Z0-9_-]{4,16}$/, // Letras, numeros, guion y guion_bajo
  nombre: /^[a-zA-ZÀ-ÿ0-9\s]{3,40}$/, // Letras y espacios, pueden llevar acentos.
  password: /^.{4,12}$/, // 4 a 12 digitos.
  correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  telefono: /^\d{7,14}$/, // 7 a 14 numeros.
};

const customStyles = {
  content: {
    backgroundColor: "#f0efed",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("body");

moment.locale("es");

const localizerMoment = momentLocalizer(moment);

function App() {
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
  });
  const [showMsg, setShowMsg] = useState(null);
  const [events, setEvents] = useState();
  const [deleted, setDeleted] = useState(false);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [modalIsOpenConfirm, setIsOpenConfirm] = React.useState(false);
  const [dataModal, setDataModal] = React.useState({});
  const [validate, setValidate] = useState({
    title: { campo: "", valido: null },
    start: { campo: "", valido: null },
    end: { campo: "", valido: null },
  });

  useEffect(() => {
    getEvents();
  }, []);

  const handleEvent = () => {
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
      await fetch(urlCloud, requestOptions);
      getEvents();
    } catch (error) {
      return error;
    }
  };

  const getEvents = async () => {
    try {
      const fetchResponse = await fetch(urlCloud, {
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
      const fetchResponse = await fetch(`${urlCloud}/${dataModal._id}`, {
        method: "DELETE",
        mode: "cors",
      });
      await fetchResponse.json();
      setIsOpenConfirm(false);
      setIsOpen(false);
      setDeleted(true);
      setShowMsg(false);
      getEvents();
    } catch (error) {
      return error;
    }
  };

  const onSelectEvent = async (e) => {
    setShowMsg(null);
    setIsOpen(true);
    setDataModal({
      _id: e._id,
      start: e.start,
      end: e.end,
      title: e.title,
    });
    setValidate({
      title: { campo: e.title, valido: "true" },
      start: { campo: e.start, valido: "true" },
      end: { campo: e.end, valido: "true" },
    });
  };

  const onDeleteEvent = async (e) => {
    setIsOpenConfirm(true);
  };

  const updateEvent = async (e) => {
    try {
      const fetchResponse = await fetch(`${urlCloud}/${dataModal._id}`, {
        method: "PATCH",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: dataModal.title,
          startDate: dataModal.start,
          endDate: dataModal.end,
        }),
      });
      await fetchResponse.json();
      getEvents();
      setIsOpenConfirm(false);
      // setIsOpen(false);
    } catch (error) {
      return error;
    }
  };

  function closeModal() {
    setIsOpen(false);
    setIsOpenConfirm(false);
    setValidate({
      title: { campo: "", valido: null },
      start: { campo: "", valido: null },
      end: { campo: "", valido: null },
    });
  }

  function handleNewEventTitle(value) {
    setNewEvent({ ...newEvent, title: value });
  }

  function handleNewEventStartDate(value) {
    setNewEvent({ ...newEvent, start: value });
  }

  function handleNewEventEndDate(value) {
    setNewEvent({ ...newEvent, end: value });
  }

  function handleUpdateEventTitle(value) {
    setDataModal({ ...dataModal, title: value });
  }

  function handleUpdateEventStartDate(value) {
    setDataModal({ ...dataModal, start: value });
  }

  function handleUpdateEventEndDate(value) {
    setDataModal({ ...dataModal, end: value });
  }

  return (
    <div className="App">
      <NewEvent
        showMsg={setShowMsg}
        setShowMsg={setShowMsg}
        deleted={deleted}
        validate={validate}
        setValidate={setValidate}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        handleEvent={handleEvent}
        changeTitle={handleNewEventTitle}
        changeStartDate={handleNewEventStartDate}
        changeEndDate={handleNewEventEndDate}
        expresiones={expresiones.nombre}
      />
      {showMsg === true && (
        <p className="formDone">Evento creado exitosamente!</p>
      )}
      {showMsg === false && (
        <p className="formDone">Evento eliminado exitosamente!</p>
      )}
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
          allDay: "Todo el dia",
          noEventsInRange:
            "No hay eventos para montrar en este rango de fechas.",
        }}
      />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {dataModal && (
          <UpdateEvent
            updateEvent={updateEvent}
            validate={validate}
            setValidate={setValidate}
            dataModal={dataModal}
            updateTitle={handleUpdateEventTitle}
            updateStartDate={handleUpdateEventStartDate}
            updateEndDate={handleUpdateEventEndDate}
            onCloseModal={closeModal}
            onDeleteEvent={onDeleteEvent}
            onUpdateEvent={updateEvent}
            expresiones={expresiones.nombre}
          />
        )}
      </Modal>
      <Modal
        isOpen={modalIsOpenConfirm}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {dataModal && (
          <div>
            <DeleteEventConfirm
              deleteEvent={deleteEvent}
              closeModal={closeModal}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
export default App;
