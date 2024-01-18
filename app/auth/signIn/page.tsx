import exp from "node:constants";
import {
  signInWithEmailAction,
  signInWithGithubAction,
  signInWithGoogleAction,
  signInWithZoomAction
} from "@/app/actions/auth";

export default function SignIn() {
  return <>
    <h1>Sign In</h1>
    <form action={signInWithGithubAction}>
      <input type={'submit'} value={'Sign in with Github'}/>
    </form>
    <br/><br/>
    <form action={signInWithGoogleAction}>
      <input type={'submit'} value={'Sign in with Google'}/>
    </form>
    <br/><br/>
    <form action={signInWithZoomAction}>
      <input type={'submit'} value={'Sign in with Zoom'}/>
    </form>
    <br/><br/>
    <form action={signInWithEmailAction}>
      Email Address: <input name={'email-address'} type={'text'}/> <input type={'submit'} value={'Sign in via Email'}/>
    </form>

  </>
}