import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import moment from "moment";
import es from "date-fns/locale/es";
import { isValid } from "date-fns";

registerLocale("es", es);
moment.locale("es");

export default function NewEvent(props) {
  const [formularioValido, setFormularioValido] = useState(null);
  function changeEventInputTitle(e) {
    const value = e.target.value;
    props.changeTitle(value);
    props.setValidate({
      ...props.validate,
      title: { ...props.validate.title, campo: value },
    });
  }
  function changeEventInputStartDate(e) {
    props.changeStartDate(e);
    props.setValidate({
      ...props.validate,
      start: { ...props.validate.start, campo: e },
    });
  }
  function changeEventInputEndDate(e) {
    props.changeEndDate(e);
    props.setValidate({
      ...props.validate,
      end: { ...props.validate.end, campo: e },
    });
  }

  const validates = () => {
    setFormularioValido(null);
    props.setShowMsg(null);
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
    setFormularioValido(null);
    props.setShowMsg(null);
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
    setFormularioValido(null);
    props.setShowMsg(null);
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
      props.handleEvent();
      setFormularioValido(true);
      props.setShowMsg(true);
      props.setNewEvent({
        title: "",
        start: "",
        end: "",
      });
      props.setValidate({
        title: { campo: "", valido: null },
        start: { campo: "", valido: null },
        end: { campo: "", valido: null },
      });
    } else {
      setFormularioValido(false);
      props.setShowMsg(null);
    }
  };

  return (
    <>
      <h2>Nuevo evento</h2>
      <form className="pick" onSubmit={onSubmit} autoComplete="off">
        <div className="span2">
          <label className="label" htmlFor="">
            Titulo
          </label>
          <div>
            <div>
              <input
                type="text"
                placeholder="Titulo"
                name="title"
                value={props.newEvent.title}
                onChange={(e) => changeEventInputTitle(e)}
                className="input"
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
          <label className="label" htmlFor="">
            Fecha de inicio
          </label>
          <DatePicker
            title="Fecha de inicio"
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
            className="input"
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
          <label className="label" htmlFor="">
            Fecha de fin
          </label>
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
            className="input"
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
        <div className="submit">
          <button type="submit">Agregar evento</button>
          {/* {formularioValido === true && (
            <p className="formDone">Evento creado!</p>
          )} */}

          {formularioValido === false && (
            <p className="error">
              Existe un error en el formulario compruebalo nuevamente!
            </p>
          )}
        </div>
      </form>
    </>
  );
}
