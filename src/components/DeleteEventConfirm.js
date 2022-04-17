import React from "react";

export default function DeleteEventConfirm(props) {
  return (
    <>
      <p className="confirmLabel">
        ¿Estas seguro que deseas eliminar este evento?
      </p>
      <div className="deleteBtns">
        <button onClick={props.deleteEvent}>Eliminar</button>
        <button onClick={props.closeModal}>Cancelar</button>
      </div>
    </>
  );
}
