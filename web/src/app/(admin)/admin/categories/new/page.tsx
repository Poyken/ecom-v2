import { apiFetch } from "@/lib/api";
import Form from "./Form";

export default async function NewCategoryEntry() {
  let categories = [];
  try {
    categories = await apiFetch('/categories');
  } catch (err) {
    console.error(err);
  }

  return <Form categories={categories} />;
}
