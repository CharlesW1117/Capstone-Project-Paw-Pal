# Issue #8 Notes

Pet routes added:

- GET /api/pets
- POST /api/pets
- GET /api/pets/:id
- PUT /api/pets/:id
- DELETE /api/pets/:id

All pet routes are protected owner-only routes.

Expected auth behavior:

- User must be logged in.
- User must have role owner.
- Owners can only access their own pets.

Main fields used:

- id
- ownerId
- name
- species
- breed
- age
- careNotes
- photoUrl