"use server";

import { auth, signIn, signOut } from "@/auth";
import prisma from "@/prismaClient";

export async function signInWithGithubAction(formData: FormData) {
  console.log("in signInWithGithubAction");
  await signIn("github", {
    redirectTo: "/dashboard/todos",
  });
}

export async function signInWithGoogleAction(formData: FormData) {
  console.log("in signInWithGoogle");
  await signIn("google", {
    redirectTo: "/dashboard/todos",
  });
}

export async function signInWithZoomAction(formData: FormData) {
  console.log("in signInWithZoom");
  await signIn("zoom", {
    redirectTo: "/dashboard/todos",
  });
}

export async function signInWithEmailAction(formData: FormData) {
  console.log("in signInWithEmail");
  const emailAddress = (formData.get("email-address") as string) || "";
  await signIn("sendgrid", {
    redirectTo: "/dashboard/todos",
    email: emailAddress,
  });
}

export async function signOutAction() {
  await signOut({
    redirectTo: "/auth/signIn",
  });
}

export async function impersonateAction(formData: FormData) {
  const session = await auth();
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: session?.userId,
    },
  });
  if (user.email === "mistersingh179@gmail.com") {
    const emailAddress = (formData.get("email-address") as string) || "";
    await signIn("credentials", {
      redirectTo: "/dashboard/todos",
      email: emailAddress,
    });
  }
}
