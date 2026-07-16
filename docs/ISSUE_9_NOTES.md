# Issue #9 Notes

Availability routes added:

- GET /api/sitters/:id/availability
- POST /api/availability
- PUT /api/availability/:id
- DELETE /api/availability/:id

Route permissions:

- GET /api/sitters/:id/availability is public.
- POST /api/availability is sitter-only.
- PUT /api/availability/:id is sitter-only.
- DELETE /api/availability/:id is sitter-only.

Expected auth behavior:

- Sitters can create their own availability slots.
- Sitters can only update their own availability slots.
- Sitters can only delete their own availability slots.

Main fields used:

- id
- sitterId
- date
- startTime
- endTime
- isBooked