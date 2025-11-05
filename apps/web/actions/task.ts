"use server";

export async function addTask(formData: FormData) {
  const title = formData.get("title") as string;
  console.log(title);
}
