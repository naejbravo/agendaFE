import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import moment from "moment";
import es from "date-fns/locale/es";

registerLocale("es", es);
moment.locale("es");

export default function UpdateEvent(props) {
  function updateTitle(e) {
    const value = e.target.value;
    props.updateTitle(value);
  }
  function updateStartDate(e) {
    props.updateStartDate(e);
  }
  function updateEndDate(e) {
    props.updateEndDate(e);
  }

  return (
    <>
      <label>
        Titulo:{" "}
        <input
          type="text"
          value={props.dataModal.title}
          name="title"
          onChange={(e) => updateTitle(e)}
        />
      </label>

      <div>
        <label>
          Fecha inicio:
          <DatePicker
            placeholderText="Fecha de inicio"
            selected={props.dataModal.start}
            onChange={(e) => updateStartDate(e)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={60}
            timeCaption="hora"
            dateFormat="MMMM d, yyyy HH:mm:ss aa"
            locale="es"
          />
        </label>
      </div>

      <div>
        <label>
          Fecha fin:
          <DatePicker
            placeholderText="Fecha de fin"
            selected={props.dataModal.end}
            onChange={(e) => updateEndDate(e)}
            showTimeSelect
            timeIntervals={60}
            timeFormat="HH:mm"
            timeCaption="hora"
            dateFormat="MMMM d, yyyy HH:mm:ss aa"
            locale="es"
          />
        </label>
      </div>
      <button onClick={props.onUpdateEvent}>Guardar cambios</button>
      <button onClick={props.onDeleteEvent}>Eliminar evento</button>
      <button onClick={props.onCloseModal}>Cerrar</button>
    </>
  );
}
