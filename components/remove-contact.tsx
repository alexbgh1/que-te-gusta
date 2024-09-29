import { Button } from "./ui/button";
import { Trash } from "lucide-react";

interface RemoveContactProps {
  handleDeleteContact: () => Promise<void>;
}
const RemoveContact = ({ handleDeleteContact }: RemoveContactProps) => {
  return (
    <Button variant="destructive" className="ml-2" onClick={() => handleDeleteContact()}>
      <Trash className="h-4 w-4" />
      <span className="sr-only sm:hidden">Eliminar contacto</span>
      <span className="ml-1 hidden sm:block">Eliminar contacto</span>
    </Button>
  );
};

export default RemoveContact;
