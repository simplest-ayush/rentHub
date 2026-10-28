# RentHub

An apartment rental platform built with Angular and Tailwind CSS.

## Links

- **GitHub:** https://github.com/<your-username>/rent-hub
- **Live app:** https://<your-site>.netlify.app

## Demo credentials

| Email | Password |
|---|---|
| demo@renthub.com | Demo@123 |

You can also register your own account on the Register page.

## Features

- Registration, login and logout, with auth guards on protected routes
- Home page: featured carousel, paginated listings, sorting, and search and filters (location, price range, amenities)
- Mark as favourite and send inquiries to landlords
- Create, edit and delete listings, with form validation
- Listing details page with photo gallery
- Comments with replies
- Profile page: my listings, favourites and inquiries received
- Responsive layout

## Bonus attempted

- **Preview and Submit screen** for posts. The form goes to a preview, where you can edit or submit.

## Tech

Angular (standalone components, signals, reactive forms, lazy-loaded routes), Tailwind CSS, Vitest.

## Notes

- There is no backend. Data is stored in the browser's `localStorage` and seeded with sample listings on first load.
- Passwords are stored in plain text because this is a frontend-only demo. A real app would hash them on a server.
- The create form includes a "Number of Beds" field so the preview matches the wireframe.
- The vegetarian preference radio mentioned in the brief is not included.

## Run locally

    npm install
    ng serve

Open http://localhost:4200.

## Run tests

    ng test --no-watch

Unit tests cover `AuthService` and `ListingService` (services), `PaginationComponent` and `AuthComponent` (components), and `SharedModule` (module).

## Build

    ng build