import authConfig from "./auth.config"
import NextAuth from "next-auth"
import { publicRoutes, authRoutes, apiAuthPrefix, default_login_redirect } from "./routes";
import { NextResponse } from "next/server";


const { auth } = NextAuth(authConfig);

export default auth((req) => {
    console.log("From middleware");
    console.log("Route", !req.auth);

    const isApiAuthRoute = req.nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(req.nextUrl.pathname);

    // Let NextAuth handle its own API routes like /api/auth/*
    if (isApiAuthRoute) return NextResponse.next();

    // Allow public routes to everyone 
    if (isPublicRoute) return NextResponse.next();

    // If the user is already logged in and is trying to access /login -> send them to app
    if (isAuthRoute && req.auth) {
        return NextResponse.redirect(new URL(default_login_redirect, req.url));
    }
    // If the user is not logged in and tries to access a private page -> send to login
    if (!req.auth) {
        return NextResponse.redirect(new URL("/login", req.url))
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