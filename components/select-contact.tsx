import React, { useState } from "react";

import { toast } from "sonner";
import { State, Action } from "@/reducers/contactReducer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { deleteContact, updateContact } from "@/app/contactos/actions";
import RemoveContact from "./remove-contact";
import EditContact from "./edit-contact";

interface SelectContactProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const SelectContact = ({ state, dispatch }: SelectContactProps) => {
  const handleDeleteContact = async (contactId: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este contacto? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      await deleteContact(contactId);
      toast.success("Contacto eliminado correctamente.");
    } catch (error) {
      console.error("Error eliminando el contacto:", error);
      if (error instanceof Error) {
        toast.error(`Error al eliminar el contacto: ${error.message}`);
      }
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Select
        value={state.selectedContactId?.toString() || ""}
        onValueChange={(value) => dispatch({ type: "SELECT_CONTACT", payload: Number(value) })}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Selecciona un contacto" />
        </SelectTrigger>
        <SelectContent>
          {state.contacts.map((contact) => (
            <SelectItem key={contact.id} value={contact.id.toString()}>
              {contact.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {state.selectedContactId && (
        <>
          <EditContact state={state} dispatch={dispatch} />
          <RemoveContact handleDeleteContact={() => handleDeleteContact(state.selectedContactId!)} />
        </>
      )}
    </div>
  );
};

export default SelectContact;
