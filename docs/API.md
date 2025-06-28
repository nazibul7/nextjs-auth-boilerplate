# 📚 API Routes

| Endpoint           | Method | Description                        | Auth required | Role  |
|---------------------|--------|-----------------------------------|---------------|-------|
| `/api/auth/*`       | GET/POST | Managed by Auth.js               | No            | -     |
| `/api/users/me`     | GET    | Get current user profile          | ✅            | Any   |
| `/api/admin/users`  | GET    | List all users (for dashboard)    | ✅            | Admin |
| `/api/settings/*`   | POST   | Change email/password/2FA/roles   | ✅            | User/Admin |

## 📝 Error responses
- `401 Unauthorized`: Not logged in.
- `403 Forbidden`: Logged in but lacks permission.
- `500 Internal Server Error`: Unexpected issues.
