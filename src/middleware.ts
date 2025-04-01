import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
// import acceptLanguage from "accept-language";
// import { fallbackLng, languages, cookieName } from "./i18n/settings";

// acceptLanguage.languages(languages);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images|assets|favicon.ico|sw.js|site.webmanifest).*)'
  ]
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Skip middleware for certain paths
  if (pathname.includes('icon') || pathname.includes('chrome')) {
    return NextResponse.next();
  }

  // let lng;
  // if (req.cookies.has(cookieName)) {
  //   lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  // }
  // if (!lng) {
  //   lng = acceptLanguage.get(req.headers.get("Accept-Language") || "");
  // }
  // if (!lng) {
  //   lng = fallbackLng;
  // }

  // Redirect if lng in path is not supported
  // if (
  //   !languages.some((loc) => pathname.startsWith(`/${loc}`)) &&
  //   !pathname.startsWith("/_next")
  // ) {
  //   return NextResponse.redirect(
  //     new URL(`/${lng}${pathname}${req.nextUrl.search}`, req.url)
  //   );
  // }

  // if (req.headers.has("referer")) {
  //   const refererUrl = new URL(req.headers.get("referer") || "");
  //   const lngInReferer = languages.find((l) =>
  //     refererUrl.pathname.startsWith(`/${l}`)
  //   );
  //   const response = NextResponse.next();
  //   if (lngInReferer) {
  //     response.cookies.set(cookieName, lngInReferer);
  //   }
  //   return response;
  // }

  return NextResponse.next();
}

export default middleware;
