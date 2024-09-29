import { toast } from "sonner";
import { X } from "lucide-react";

import { Action, State } from "@/reducers/contactReducer";
import { deletePreference } from "@/app/contactos/actions";
import { PlainPreference } from "@/types/custom";

interface ContactPreferencesProps {
  preferences: PlainPreference[];
  state: State;
  dispatch: React.Dispatch<Action>;
}

export default function ContactPreferences({ preferences, state, dispatch }: ContactPreferencesProps) {
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

  return (
    <>
      {preferences.map((pref) => (
        <div
          key={pref.id}
          className="relative group bg-card text-card-foreground rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-2">
            <div className="flex-grow overflow-hidden">
              <h3 className="font-semibold truncate">{pref.category}</h3>
              <p className="text-sm text-muted-foreground truncate">{pref.keyword}</p>
            </div>
          </div>
          <button
            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => removePreference(pref.id)}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </>
  );
}
