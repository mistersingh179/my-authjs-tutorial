import {NextResponse} from "next/server";
import {auth} from "@/auth";

export const GET = async () => {
  const session = await auth();
  if(session?.userId){
    return NextResponse.json({
      message: "pong"
    })
  }else{
    return new Response("sorry, no access", {
      status: 403
    })
  }

}