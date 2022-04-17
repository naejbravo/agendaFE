import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import moment from "moment";
import es from "date-fns/locale/es";
import { isValid } from "date-fns";

registerLocale("es", es);
moment.locale("es");

export default function UpdateEvent(props) {
  const [formularioValido, setFormularioValido] = useState(null);
  function updateTitle(e) {
    const value = e.target.value;
    props.updateTitle(value);
    props.setValidate({
      ...props.validate,
      title: { ...props.validate.title, campo: value },
    });
  }
  function updateStartDate(e) {
    props.updateStartDate(e);
    props.setValidate({
      ...props.validate,
      start: { ...props.validate.start, campo: e },
    });
  }
  function updateEndDate(e) {
    props.updateEndDate(e);
    props.setValidate({
      ...props.validate,
      end: { ...props.validate.end, campo: e },
    });
  }

  const validates = () => {
    setFormularioValido(null);
    if (props.expresiones) {
      if (props.expresiones.test(props.validate.title.campo)) {
        props.setValidate({
          ...props.validate,
          title: { ...props.validate.title, valido: "true" },
        });
      } else {
        props.setValidate({
          ...props.validate,
          title: { ...props.validate.title, valido: "false" },
        });
      }
    }
  };

  const validateDateStart = () => {
    if (isValid(props.validate.start.campo)) {
      props.setValidate({
        ...props.validate,
        start: { ...props.validate.start, valido: "true" },
      });
    } else {
      props.setValidate({
        ...props.validate,
        start: { ...props.validate.start, valido: "false" },
      });
    }
  };

  const validateDateEnd = () => {
    if (isValid(props.validate.end.campo)) {
      props.setValidate({
        ...props.validate,
        end: { ...props.validate.end, valido: "true" },
      });
    } else {
      props.setValidate({
        ...props.validate,
        end: { ...props.validate.end, valido: "false" },
      });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (
      props.validate.title.valido === "true" &&
      props.validate.start.valido === "true" &&
      props.validate.end.valido === "true"
    ) {
      props.updateEvent();
      setFormularioValido(true);
      // props.setNewEvent({
      //   title: "",
      //   start: "",
      //   end: "",
      // });
      props.setValidate({
        title: { campo: "", valido: null },
        start: { campo: "", valido: null },
        end: { campo: "", valido: null },
      });
    } else {
      setFormularioValido(false);
    }
  };

  const deleteEvent = (e) => {
    e.preventDefault();
    props.onDeleteEvent();
    props.setValidate({
      title: { campo: "", valido: null },
      start: { campo: "", valido: null },
      end: { campo: "", valido: null },
    });
    setFormularioValido(false);
  };

  return (
    <form className="pick" onSubmit={onSubmit}>
      <div className="span2">
        <label className="label">Titulo:</label>
        <div>
          <div>
            <input
              type="text"
              value={props.dataModal.title}
              name="title"
              onChange={(e) => updateTitle(e)}
              onKeyUp={validates}
              onBlur={validates}
            />
          </div>
        </div>
        {props.validate.title.valido === "false" && (
          <p className="error">
            El titulo debe tener como minimo 3 caracteres para ser valido,
            tampoco debe contener simbolos
          </p>
        )}
      </div>

      <div>
        <label className="label">Fecha inicio:</label>
        <DatePicker
          placeholderText="Fecha de inicio"
          selected={props.dataModal.start}
          onChange={(e) => updateStartDate(e)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={60}
          timeCaption="hora"
          dateFormat="MMMM d, yyyy HH:mm:ss"
          locale="es"
          onSelect={validateDateStart}
          onChangeRaw={validateDateStart}
          onBlur={validateDateStart}
          onCalendarClose={validateDateStart}
          onCalendarOpen={validateDateStart}
        />
        {props.validate.start.valido === "false" && (
          <p className="error">Debes seleccionar una fecha de inicio</p>
        )}
      </div>

      <div>
        <label className="label">Fecha fin:</label>
        <DatePicker
          placeholderText="Fecha de fin"
          selected={props.dataModal.end}
          onChange={(e) => updateEndDate(e)}
          showTimeSelect
          timeIntervals={60}
          timeFormat="HH:mm"
          timeCaption="hora"
          dateFormat="MMMM d, yyyy HH:mm:ss"
          locale="es"
          onSelect={validateDateEnd}
          onChangeRaw={validateDateEnd}
          onBlur={validateDateEnd}
          onCalendarClose={validateDateEnd}
          onCalendarOpen={validateDateEnd}
        />
        {props.validate.end.valido === "false" && (
          <p className="error">Debes seleccionar una fecha de fin</p>
        )}
      </div>
      <div className="controlBtns">
        <button type="submit">Guardar</button>
        <button type="button" onClick={deleteEvent}>
          Eliminar
        </button>
        <button type="button" onClick={props.onCloseModal}>
          Cerrar
        </button>
        {formularioValido === true && (
          <p className="formDone">Evento actualizado correctamente!</p>
        )}

        {formularioValido === false && (
          <p className="error">
            Existe un error en el formulario compruebalo nuevamente!
          </p>
        )}
      </div>
    </form>
  );
}
