import { PlainContactListProps, PlainPreference, Category } from "@/types/custom";
import { useReducer } from "react";

// Definir los tipos de acción
type Action =
  | { type: "SET_CONTACTS"; payload: PlainContactListProps[] }
  | { type: "SET_CATEGORIES"; payload: Category[] }
  | { type: "SELECT_CONTACT"; payload: number }
  | { type: "SET_NEW_CONTACT_NAME"; payload: string }
  | { type: "SET_SELECTED_CATEGORY"; payload: Category | null }
  | { type: "SET_NEW_KEYWORD"; payload: string }
  | { type: "ADD_CONTACT"; payload: PlainContactListProps }
  | { type: "ADD_PREFERENCE"; payload: { contactId: number; preference: PlainPreference } }
  | { type: "REMOVE_PREFERENCE"; payload: { contactId: number; preferenceId: number } }
  | { type: "UPDATE_CONTACT"; payload: { id: number; name: string } };

// Definir el estado inicial
interface State {
  contacts: PlainContactListProps[];
  categories: Category[];
  selectedContactId: number | null;
  newContactName: string;
  selectedCategory: Category | null;
  newKeyword: string;
}

const initialState: State = {
  contacts: [],
  categories: [],
  selectedContactId: null,
  newContactName: "",
  selectedCategory: null,
  newKeyword: "",
};

// Definir el reducer
function contactReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_CONTACTS":
      return { ...state, contacts: action.payload };
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "SELECT_CONTACT":
      return { ...state, selectedContactId: action.payload };
    case "SET_NEW_CONTACT_NAME":
      return { ...state, newContactName: action.payload };
    case "SET_SELECTED_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    case "SET_NEW_KEYWORD":
      return { ...state, newKeyword: action.payload };
    case "ADD_CONTACT":
      return { ...state, contacts: [...state.contacts, action.payload], newContactName: "" };
    case "ADD_PREFERENCE":
      return {
        ...state,
        contacts: state.contacts.map((contact) =>
          contact.id === action.payload.contactId
            ? { ...contact, preferences: [...contact.preferences, action.payload.preference] }
            : contact
        ),
        newKeyword: "",
      };
    case "REMOVE_PREFERENCE":
      return {
        ...state,
        contacts: state.contacts.map((contact) =>
          contact.id === action.payload.contactId
            ? { ...contact, preferences: contact.preferences.filter((pref) => pref.id !== action.payload.preferenceId) }
            : contact
        ),
      };
    case "UPDATE_CONTACT":
      return {
        ...state,
        contacts: state.contacts.map((contact) =>
          contact.id === action.payload.id ? { ...contact, name: action.payload.name } : contact
        ),
      };
    default:
      return state;
  }
}

// Reducer
const useContactReducer = () => useReducer(contactReducer, initialState);

export { useContactReducer, contactReducer, initialState, type State, type Action };
