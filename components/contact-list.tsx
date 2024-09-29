// contact-list.tsx
"use client";

import { useReducer, useEffect, useRef } from "react";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

import { contactReducer, initialState } from "@/reducers/contactReducer";
import { addContact, addPreference, deletePreference } from "@/app/contactos/actions";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import ContactPreferences from "./contact-preferences";

import { Category, PlainContactListProps } from "@/types/custom";

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

  const addNewPreference = async () => {
    if (!state.selectedContactId || !state.selectedCategory || !state.newKeyword) {
      return toast.error("Selecciona un contacto y completa los campos");
    }
    try {
      const newPreference = await addPreference(state.selectedContactId, state.selectedCategory.id, state.newKeyword);
      dispatch({
        type: "ADD_PREFERENCE",
        payload: {
          contactId: state.selectedContactId,
          preference: { id: newPreference.id, keyword: state.newKeyword, category: state.selectedCategory.category },
        },
      });
      toast.success("Preferencia añadida correctamente");
    } catch (error) {
      console.error("Error adding preference:", error);
      toast.error("Error al añadir la preferencia");
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
        <ContactPreferences preferences={selectedContact.preferences} removePreference={removePreference} />
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button className="bg-muted text-muted-foreground rounded-lg p-3 flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
            <Plus />
            <span>Añadir Preferencia</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <h4 className="font-medium leading-none">Agregar Preferencia</h4>
            <Select
              value={state.selectedCategory?.id.toString()}
              onValueChange={(value) => {
                const category = state.categories.find((cat) => cat.id === Number(value));
                dispatch({ type: "SET_SELECTED_CATEGORY", payload: category || null });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {state.categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Keyword"
              value={state.newKeyword}
              onChange={(e) => dispatch({ type: "SET_NEW_KEYWORD", payload: e.target.value })}
            />
            <Button onClick={addNewPreference} className="mt-2">
              Añadir
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
