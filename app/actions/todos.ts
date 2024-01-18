"use server";

import {auth} from "@/auth";
import prisma from "@/prismaClient";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

export default async function createTodoAction(formData: FormData) {
  const session = await auth();
  const organizationId = session?.organizationId!;
  const name = formData.get("the-todo-name") as string;

  const newTodo = await prisma.todo.create({
    data: {
      name,
      organizationId
    }
  });
  console.log("we craeated a new todo: ", newTodo);
  revalidatePath("/dashboard/todos");
  redirect("/dashboard/todos");
}