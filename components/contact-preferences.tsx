// components/ContactPreferences.tsx
import React from "react";
import { X } from "lucide-react";
import { PlainPreference } from "@/types/custom";
import { Button } from "@/components/ui/button";

interface ContactPreferencesProps {
  preferences: PlainPreference[];
  removePreference: (preferenceId: number) => void;
}

export default function ContactPreferences({ preferences, removePreference }: ContactPreferencesProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
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
    </div>
  );
}
