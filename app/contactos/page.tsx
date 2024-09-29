import ContactList from "@/components/contact-list"; // Componente client para mostrar y gestionar contactos
import { getCategories, getContacts } from "./actions";
import { PlainContactListProps } from "@/types/custom";

export default async function ContactosPage() {
  // Crear el cliente de Supabase en el lado del servidor
  const { contacts, contactsError } = await getContacts();
  const { categories, categoriesError } = await getCategories();

  if (contactsError) {
    console.error("Error al solicitar los contactos asociados a tu cuenta.", contactsError.message);
    return <p>Error al cargar los contactos.</p>;
  }

  if (categoriesError) {
    console.error("Error al solicitar las preferencias", categoriesError.message);
    return <p>Error al cargar las preferencias.</p>;
  }

  // Formatear los datos para pasarlos como props a los componentes client
  const formattedContacts: PlainContactListProps[] =
    contacts?.map((contact) => ({
      id: contact.id,
      name: contact.name,
      preferences: contact.preferences.map((pref) => ({
        id: pref.id,
        keyword: pref.keyword,
        category: pref.preferencecategory.category,
      })),
    })) || [];

  return (
    <section className="p-3 pt-6 max-w-2xl w-full flex flex-col gap-4">
      <h1 className="text-3xl font-bold mb-6">Contactos y Preferencias</h1>
      <ContactList initialContacts={formattedContacts} initialCategories={categories || []} />
    </section>
  );
}
