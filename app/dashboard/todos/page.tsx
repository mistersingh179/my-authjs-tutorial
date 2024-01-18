import { impersonateAction, signOutAction } from "@/app/actions/auth";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import createTodoAction from "@/app/actions/todos";

export default async function Todos() {
  console.log("in todos");
  const session = await auth();
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: session?.userId
    }
  })
  const todos = await prisma.todo.findMany({
    where: {
      organizationId: session?.organizationId,
    },
  });
  return (
    <>
      <h2>
        {" "}
        This is the todos page – {session?.user?.name} - {session?.user?.email}
      </h2>
      <div>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
      Todos:{" "}
      <div>
        <pre>{JSON.stringify(todos, null, 2)}</pre>
      </div>
      <form action={createTodoAction}>
        Name: <input name={"the-todo-name"} type={"text"} />{" "}
        <input type={"submit"} value={"save todo"} />
      </form>
      <br />
      <br />
      {user.email === "mistersingh179@gmail.com" && (
        <form action={impersonateAction}>
          <input type={"text"} name={"email-address"} />{" "}
          <input type={"submit"} value={"Impersonate"} />
        </form>
      )}
      <br />
      <br />
      <form action={signOutAction}>
        <input type={"submit"} value={"Logout"} />
      </form>
    </>
  );
}
