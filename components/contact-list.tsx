// contact-list.tsx
"use client";

import { useReducer, useEffect, useRef } from "react";
import { toast } from "sonner";

import { contactReducer, initialState } from "@/reducers/contactReducer";
import { addContact, deletePreference } from "@/app/contactos/actions";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import ContactPreferences from "./contact-preferences";

import { Category, PlainContactListProps } from "@/types/custom";
import CreatePreference from "./create-preference";

interface ContactListProps {
  initialContacts: PlainContactListProps[];
  initialCategories: Category[];
}

export default function ContactList({ initialContacts, initialCategories }: ContactListProps) {
  const [state, dispatch] = useReducer(contactReducer, initialState);
  const initialLoadRef = useRef(true); // Ref para controlar la carga inicial

  useEffect(() => {
    dispatch({ type: "SET_CONTACTS", payload: initialContacts });
    dispatch({ type: "SET_CATEGORIES", payload: initialCategories });

    // Solo seleccionar el primer contacto si no hay uno seleccionado (al cargar por primera vez)
    if (initialContacts.length > 0 && initialLoadRef.current) {
      dispatch({ type: "SELECT_CONTACT", payload: initialContacts[0].id });
      initialLoadRef.current = false; // Cambiar a false después de la primera carga
    }
  }, [initialContacts, initialCategories]);

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

  const removePreference = async (preferenceId: number) => {
    if (state.selectedContactId) {
      try {
        await deletePreference(preferenceId);
        dispatch({ type: "REMOVE_PREFERENCE", payload: { contactId: state.selectedContactId, preferenceId } });
        toast.success("Preferencia eliminada correctamente");
      } catch (error) {
        console.error("Error removing preference:", error);
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
  };

  const selectedContact = state.contacts.find((contact) => contact.id === state.selectedContactId);

  return (
    <div className="flex flex-col space-y-4">
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

      <div className="flex items-center space-x-4">
        <Input
          placeholder="Nuevo contacto"
          className="w-2/3"
          maxLength={25}
          value={state.newContactName}
          onChange={(e) => dispatch({ type: "SET_NEW_CONTACT_NAME", payload: e.target.value })}
        />
        <Button className="w-1/3" onClick={addNewContact}>
          Añadir
        </Button>
      </div>

      {selectedContact && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          <ContactPreferences preferences={selectedContact.preferences} removePreference={removePreference} />
          <CreatePreference state={state} dispatch={dispatch} />
        </div>
      )}
      <div className="text-sm text-muted-foreground">Haz clic en una preferencia para eliminarla.</div>
    </div>
  );
}
