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
        <PreferenceBox
          key={pref.id}
          category={pref.category}
          keyword={pref.keyword}
          onRemove={() => removePreference(pref.id)}
        />
      ))}
    </>
  );
}

interface PreferenceBoxProps {
  category: string;
  keyword: string;
  onRemove: () => void;
}

export function PreferenceBox({ category, keyword, onRemove }: PreferenceBoxProps) {
  return (
    <div className="relative group bg-card text-card-foreground rounded-lg p-3 shadow-sm hover:shadow-mid transition-shadow">
      <div className="flex items-center space-x-2">
        <div className="flex-grow overflow-hidden">
          <h3 className="font-semibold">{category}</h3>
          <p className="text-sm text-muted-foreground">{keyword}</p>
        </div>
      </div>
      <button
        className="w-4 h-4 flex items-center justify-center flex-col absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
