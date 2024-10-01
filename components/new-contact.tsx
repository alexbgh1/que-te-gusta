import { Action, State } from "@/reducers/contactReducer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { addContact } from "@/app/contactos/actions";
import { toast } from "sonner";
import { MAX_LENGTH_NEW_CONTACT_NAME } from "@/constants/max-length";

interface NewContactProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}
const NewContact = ({ state, dispatch }: NewContactProps) => {
  const addNewContact = async () => {
    if (!state.newContactName) return toast.error("Completa el nombre del contacto");
    try {
      const newContact = await addContact(state.newContactName);
      dispatch({ type: "ADD_CONTACT", payload: { id: newContact.id, name: newContact.name, preferences: [] } });
      toast.success(`Contacto ${newContact.name} añadido correctamente`);
    } catch (error) {
      console.error("Error adding contact:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleContactChange = (value: string) => {
    if (value.length > MAX_LENGTH_NEW_CONTACT_NAME) {
      return toast.error("El nombre del contacto no puede tener más de 25 caracteres");
    }
    dispatch({ type: "SET_NEW_CONTACT_NAME", payload: value });
  };

  return (
    <div className="flex items-center space-x-4">
      <Input
        placeholder="Nuevo contacto"
        className="w-[200px]"
        maxLength={MAX_LENGTH_NEW_CONTACT_NAME}
        value={state.newContactName}
        onChange={(e) => handleContactChange(e.target.value)}
      />
      <Button className="w-1/3" onClick={addNewContact}>
        Añadir
      </Button>
    </div>
  );
};

export default NewContact;
