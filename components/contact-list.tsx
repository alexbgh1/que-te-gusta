// contact-list.tsx
"use client";

import { useReducer, useEffect, useRef } from "react";
import { contactReducer, initialState } from "@/reducers/contactReducer";

import ContactPreferences from "./contact-preferences";

import { Category, PlainContactListProps } from "@/types/custom";
import CreatePreference from "./create-preference";
import SelectContact from "./select-contact";
import NewContact from "./new-contact";

interface ContactListProps {
  initialContacts: PlainContactListProps[];
  initialCategories: Category[];
}

export default function ContactList({ initialContacts, initialCategories }: ContactListProps) {
  const [state, dispatch] = useReducer(contactReducer, initialState);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    dispatch({ type: "SET_CONTACTS", payload: initialContacts });
    dispatch({ type: "SET_CATEGORIES", payload: initialCategories });

    // Select first contact on initial load
    if (initialContacts.length > 0 && initialLoadRef.current) {
      dispatch({ type: "SELECT_CONTACT", payload: initialContacts[0].id });
      initialLoadRef.current = false;
    }
  }, [initialContacts, initialCategories]);

  const selectedContact = state.contacts.find((contact) => contact.id === state.selectedContactId);

  return (
    <div className="flex flex-col space-y-4">
      <SelectContact state={state} dispatch={dispatch} />
      <NewContact state={state} dispatch={dispatch} />

      {/* Current Preferences for the selected user (based on id) */}
      {selectedContact && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          <ContactPreferences preferences={selectedContact.preferences} state={state} dispatch={dispatch} />
          <CreatePreference state={state} dispatch={dispatch} />
        </div>
      )}
      <div className="text-sm text-muted-foreground">Haz clic en una preferencia para eliminarla.</div>
    </div>
  );
}
