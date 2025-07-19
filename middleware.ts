import { auth } from "./auth";
import { publicRoutes, authRoutes, apiAuthPrefix, default_login_redirect } from "./routes";
import { NextResponse } from "next/server";


/**
 * This is the Auth.js middleware to protect routes.
 * 
 * The auth() helper from Auth.js runs the callback function.
 * It wraps the function with its internal getSession logic → that logic:
 * - verifies the JWT,
 * - runs your jwt callback,
 * - runs your session callback,
 * - attaches it to req.auth
 */

export default auth((req) => {
    // console.log("From middleware");
    // console.log("Route", !!req.auth);
    // console.log(authRoutes[0], req.url);

    const isApiAuthRoute = req.nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(req.nextUrl.pathname);

    // Let NextAuth handle its own API routes like /api/auth/*
    if (isApiAuthRoute) return NextResponse.next();

    // Allow public routes to everyone 
    if (isPublicRoute) return NextResponse.next();

    // If the user is already logged in and is trying to access /login -> send them to app
    if (isAuthRoute && !!req.auth) {
        return NextResponse.redirect(new URL(default_login_redirect, req.url));
    }
    // If the user is not logged in and tries to access a private page -> send to login
    if (!req.auth && !isAuthRoute) {
        return NextResponse.redirect(new URL(authRoutes[0], req.url))
    }

    return NextResponse.next();
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}