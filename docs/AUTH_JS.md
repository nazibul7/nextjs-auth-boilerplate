# Auth.js (NextAuth) — JWT & Session Full Notes

## Session strategy: "jwt" vs "database". Why choose jwt.
- jwt : Session is stored in a signed cookie. No DB lookup on each request.
- Reduced database load
- Perfect for serverless function

## Request flow examples

## Initial Sign-in
- User clicks on singin with credential or goolge or any providers 
- 1️⃣ Your Signin callback runs or default singin callback run by authjs.(If defined) – allows or blocks the login
- 2️⃣ JWT callback runs (user object available) or default jwt callback runs.
- user object is available only during sign-in
- You can attach data (like token.id = user.id)
- 3️⃣Session callback runs (if session is accessed right away)

## Why user can be undefined
- User object inside of jwt calback is defined on sign-in.
- On future requests → user is undefined.
- if (user) {
      token.id = user.id; // ✅ Save user id into JWT payload
  }
- Next time we will get that data untill expiry or signout.

##  What session callback does
- Auth.js only calls the session() callback when you actually access the session, such as via:
- getSession or useSession on client
- auth() or getServerSession() on server
- auth() in middleware (calls it via req.auth)
- 
- callbacks: {
  async session({ session, token }) {
    session.user.id = token.id; // ✅ Pass token data to session & expose it to client
    return session;
  },
}
- u can also check using **console.trace("Show me")** inside session callback;

## Callback Execution Matrix
| Scenario              | SignIn | JWT | Session | Redirect |
| --------------------- | ------ | --- | ------- | -------- |
| Initial sign-in       | ✅      | ✅   | ✅*      | ✅*       |
| Page load (signed in) | ❌      | ✅   | ✅       | ❌        |
| `useSession()` call   | ❌      | ✅   | ✅       | ❌        |
| API session check     | ❌      | ✅   | ✅       | ❌        |
| Sign out              | ❌      | ❌   | ❌       | ✅*       |

✅ → Runs
❌ → Does not run
✅* → May run depending on conditions


## Can u put data directly into the token inside SignIn callback?
- No
- The signin callback is just a guard.It decides
- allow login
- deny login
- redirect
- It doesn't have token object. So u cannot attach data to the token here.
-
- So you should do it inside jwt callback,if the user just signed in, you get usdr, so you can attach data to token.




## 🧠 When does jwt() run?
| Scenario                                   | `jwt()` runs? | Why?                                               |
| ------------------------------------------ | ------------- | -------------------------------------------------- |
| ✅ Sign-in (e.g. `/api/auth/callback`)      | Yes           | Create a new JWT                                   |
| ✅ Middleware or `auth()` call              | Yes           | Decode JWT and "rebuild" it (even without changes) |
| ✅ Token refresh (if using custom logic)    | Yes           | You can modify/refresh token                       |
| ❌ You never call any session-related logic | No            | It's not needed                                    |




## 🧠 When does session() run?

| Scenario                              | `session()` runs? | Why?                              |
| ------------------------------------- | ----------------- | --------------------------------- |
| ✅ After `jwt()` (always)              | Yes               | Convert token into session object |
| ✅ On `auth()` or `getServerSession()` | Yes               | Needed to return `session.user`   |
| ❌ If you never ask for session        | No                | No reason to run                  |

## 🔍 Why does jwt() run on every auth() call?
- Because NextAuth must:
- Read the JWT cookie
- Decode it
- Run jwt() to reconstruct/validate/transform the token
- Then run session() to construct the final session object
- This ensures that any token updates, custom claims, or logic written in jwt() is always applied — even when just reading the session.


## ⚠️ If jwt() didn’t run first?
- Then session() would receive an outdated or empty token, leading to a broken or incomplete session.
- API routes uses getToken() only token use no session that means no session() calback run only jwt() runs.

## 🔄 So yes — every auth() or getServerSession() call runs this flow:
  JWT Cookie →
    🔓 Decode →
      🔁 jwt({ token }) →
        🎯 session({ session, token }) →
          ✅ Return session
