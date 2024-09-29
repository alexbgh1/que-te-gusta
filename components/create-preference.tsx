"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X, Plus } from "lucide-react";
import { addPreference } from "@/app/contactos/actions";
import { toast } from "sonner";

import { Action, State } from "@/reducers/contactReducer";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "./ui/input";

import { MAX_LENGTH_NEW_KEYWORD } from "@/constants/max-length";

interface CreatePreferenceProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const CreatePreference = ({ state, dispatch }: CreatePreferenceProps) => {
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

  const handleKeywordChange = (value: string) => {
    if (value.length > MAX_LENGTH_NEW_KEYWORD) {
      return toast.error("La keyword no puede tener más de 20 caracteres");
    }
    dispatch({ type: "SET_NEW_KEYWORD", payload: value });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="bg-muted text-muted-foreground rounded-lg p-3 flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
          <Plus className="w-6 h-6" />
          <span className="ml-2">Añadir Preferencia</span>
        </div>
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
          <Input placeholder="Keyword" value={state.newKeyword} onChange={(e) => handleKeywordChange(e.target.value)} />
          <Button onClick={addNewPreference} className="mt-2">
            Añadir
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CreatePreference;
