import React, { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/es";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Modal from "react-modal";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

import NewEvent from "./components/NewEvent";
import UpdateEvent from "./components/UpdateEvent";
import DeleteEventConfirm from "./components/DeleteEventConfirm";

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
      console.log(data);
    } catch (error) {
      return error;
    }
  };

  const deleteEvent = async () => {
    try {
      console.log(dataModal._id);
      const fetchResponse = await fetch(`${urlCloud}/${dataModal._id}`, {
        method: "DELETE",
        mode: "cors",
      });
      await fetchResponse.json();
      setIsOpenConfirm(false);
      setIsOpen(false);
      getEvents();
    } catch (error) {
      return error;
    }
  };

  const onSelectEvent = async (e) => {
    setIsOpen(true);
    setDataModal({
      _id: e._id,
      start: e.start,
      end: e.end,
      title: e.title,
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
      setIsOpen(false);
    } catch (error) {
      return error;
    }
  };

  function closeModal() {
    setIsOpen(false);
    setIsOpenConfirm(false);
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
        newEvent={newEvent}
        handleEvent={handleEvent}
        changeTitle={handleNewEventTitle}
        changeStartDate={handleNewEventStartDate}
        changeEndDate={handleNewEventEndDate}
      />
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
          <div>
            <UpdateEvent
              dataModal={dataModal}
              updateTitle={handleUpdateEventTitle}
              updateStartDate={handleUpdateEventStartDate}
              updateEndDate={handleUpdateEventEndDate}
              onCloseModal={closeModal}
              onDeleteEvent={onDeleteEvent}
              onUpdateEvent={updateEvent}
            />
          </div>
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
