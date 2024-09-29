import { useState } from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";

import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { updateContact } from "@/app/contactos/actions";
import { Action, State } from "@/reducers/contactReducer";
import { Input } from "./ui/input";
import { MAX_LENGTH_NEW_CONTACT_NAME } from "@/constants/max-length";

interface EditContactProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}
const EditContact = ({ state, dispatch }: EditContactProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>("");

  const handleEditContact = (name: string) => {
    setEditName(name);
    setIsEditing(true);
  };

  const handleUpdateContact = async () => {
    if (!editName.trim()) {
      return toast.error("El nombre no puede estar vacío.");
    }

    try {
      await updateContact(state.selectedContactId!, editName);
      dispatch({ type: "UPDATE_CONTACT", payload: { id: state.selectedContactId!, name: editName } });
      toast.success("Contacto actualizado correctamente.");
      setIsEditing(false);
    } catch (error) {
      console.error("Error actualizando el contacto:", error);
      if (error instanceof Error) {
        toast.error(`Error al actualizar el contacto: ${error.message}`);
      }
    }
  };

  const handleEditName = (name: string) => {
    if (name.trim().length > MAX_LENGTH_NEW_CONTACT_NAME) {
      return toast.error(`El nombre no puede tener más de ${MAX_LENGTH_NEW_CONTACT_NAME} caracteres.`);
    }
    setEditName(name);
  };

  return (
    <>
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="ml-2"
            onClick={() => handleEditContact(state.contacts.find((c) => c.id === state.selectedContactId)?.name || "")}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only sm:hidden">Editar contacto</span>
            <span className="ml-1 hidden sm:block">Editar contacto</span>
          </Button>
        </DialogTrigger>

        {/* Contenido del modal de edición */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Contacto</DialogTitle>
            <DialogDescription>Actualiza el nombre del contacto seleccionado.</DialogDescription>
          </DialogHeader>
          <Input
            type="text"
            className="input input-bordered w-full"
            value={editName}
            onChange={(e) => handleEditName(e.target.value)}
          />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateContact}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditContact;
