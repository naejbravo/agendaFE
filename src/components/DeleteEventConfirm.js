import React from "react";

export default function DeleteEventConfirm(props) {
  return (
    <>
      <p>¿Estas seguro que deseas eliminar este evento?</p>
      <button onClick={props.deleteEvent}>Eliminar</button>
      <button onClick={props.closeModal}>Cancelar</button>
    </>
  );
}
