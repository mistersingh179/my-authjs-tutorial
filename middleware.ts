import {auth} from "@/auth";

export default auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (auth folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ],
}