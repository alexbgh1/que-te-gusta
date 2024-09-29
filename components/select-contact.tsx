import React from "react";
import { Trash } from "lucide-react"; // Icono para el botón de eliminar
import { toast } from "sonner"; // Librería para las notificaciones
import { State, Action } from "@/reducers/contactReducer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "@/components/ui/button"; // Importa el componente de botón de tu proyecto
import { deleteContact } from "@/app/contactos/actions"; // Importa la función de eliminación

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
        <Button variant="destructive" className="ml-2" onClick={() => handleDeleteContact(state.selectedContactId!)}>
          <Trash className="h-4 w-4" />
          <span className="sr-only sm:hidden">Eliminar contacto</span>
          <span className="hidden sm:block">Eliminar contacto</span>
        </Button>
      )}
    </div>
  );
};

export default SelectContact;
