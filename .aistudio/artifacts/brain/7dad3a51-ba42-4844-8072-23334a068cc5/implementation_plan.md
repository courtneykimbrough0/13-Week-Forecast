# Login & Sales Page (Frank Kern Style Copy)

A combined Login and Sales page written in a light, ultra-direct, conversational Frank Kern style. It introduces the 13-week cash forecast tool, explains the benefit in plain English, and provides a fast sign-in/access form.

---

## Copy & Persona Highlights (Frank Kern Style)

- **Headline**: "Stop guessing if you'll have money in 3 weeks. See your cash 13 weeks ahead—without linked bank accounts or messy spreadsheets."
- **Direct Pitch**:
  - *No corporate jargon.*
  - *No bank logins or privacy risks.*
  - *No complicated budget rules.*
  - *Just simple 13-week cash visibility so you never get surprised by a bill.*
- **Call to Action**: "Sign In to Your Forecast" / "Get Instant Access".
- **Footer Copyright**: Casual, direct Frank Kern style disclaimer & copyright statement ("Copyright © 2026 13-Week Cash Forecast. All rights reserved. Do not copy our stuff. Built to help real people see their money ahead of time.")

---

## User Experience & Page Architecture

1. **Integrated Login & Sales Hero View**:
   - **Left Column (Sales Pitch)**: Ultra-focused Frank Kern style bullet points explaining why 13-week forecasting gives total clarity.
   - **Right Column (Login / Access Card)**: Clean sign-in form with Email, Password, or "Instant Guest Session" button.
2. **Seamless Session Navigation**:
   - Signing in saves user auth state locally and immediately unlocks the 13-Week Forecast Dashboard.
   - "Sign Out" / "Account" toggle in header to jump back to the login page whenever needed.

---

## Technical Architecture

- **`components/LoginPage.tsx`**: Combined sales & login hero layout with Frank Kern copy and sign-in handlers.
- **`app/page.tsx`**: Manages auth state (`isLoggedIn`). If `isLoggedIn` is false or user chooses "View Sales / Login Page", displays `LoginPage`.

---

## Execution Steps

1. Create `components/LoginPage.tsx` with light Frank Kern style copy and sign-in card.
2. Update `Header.tsx` and `app/page.tsx` with Auth session toggle.
3. Co-execute `compile_applet` and `lint_applet` to verify build cleanly.
