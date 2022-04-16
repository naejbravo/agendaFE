import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import moment from "moment";
import es from "date-fns/locale/es";

registerLocale("es", es);
moment.locale("es");

export default function NewEvent(props) {
  function changeEventInputTitle(e) {
    console.log(e);
    const value = e.target.value;
    props.changeTitle(value);
  }
  function changeEventInputStartDate(e) {
    console.log(e);
    props.changeStartDate(e);
  }
  function changeEventInputEndDate(e) {
    console.log(e);
    props.changeEndDate(e);
  }
  return (
    <>
      <h2>Nuevo evento</h2>
      <div className="pick">
        <input
          type="text"
          placeholder="Titulo"
          name="title"
          value={props.newEvent.title}
          onChange={(e) => changeEventInputTitle(e)}
        />
        <div>
          <DatePicker
            name="start"
            placeholderText="Fecha de inicio"
            selected={props.newEvent.start}
            onChange={(e) => changeEventInputStartDate(e)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={60}
            timeCaption="hora"
            dateFormat="MMMM d, yyyy HH:mm:ss"
            locale="es"
          />
        </div>

        <div>
          <DatePicker
            name="end"
            placeholderText="Fecha de fin"
            selected={props.newEvent.end}
            onChange={(e) => changeEventInputEndDate(e)}
            showTimeSelect
            timeIntervals={60}
            timeFormat="HH:mm"
            timeCaption="hora"
            dateFormat="MMMM d, yyyy HH:mm:ss"
            locale="es"
          />
        </div>

        <button onClick={props.handleEvent}>Agregar evento</button>
      </div>
    </>
  );
}
