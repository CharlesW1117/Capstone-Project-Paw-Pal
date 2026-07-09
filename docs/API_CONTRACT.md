# PawPal Frontend API Contract

Base URL:

```text
http://localhost:3000/api
```

Protected routes:

```text
Authorization: Bearer <token>
```

Error shape:

```json
{ "error": "Error message" }
```

---

# Shared Fields

```js
User: id, name, email, role, bio, phone, city, state, zipCode

Sitter: id, name, bio, city, state, zipCode, trustScore, backgroundCheckStatus, onTimePercentage, averageRating, reviewCount, services

SitterService: sitterServiceId, serviceId, name, description, price

Pet: id, ownerId, name, species, breed, age, careNotes, photoUrl

Availability: id, sitterId, date, startTime, endTime, isBooked

Booking: id, ownerId, sitterId, petId, sitterServiceId, availabilityId, status, totalPrice, date, startTime, endTime

Review: id, bookingId, reviewerId, sitterId, rating, comment, createdAt
```

Booking statuses:

```text
pending, accepted, declined, cancelled, completed
```

---

# Endpoints

## GET /api/health

Response:

```json
{ "status": "ok", "message": "PawPal backend is running", "environment": "development" }
```

---

## POST /api/auth/register

Request:

```json
{ "name": "Antoni Roman", "email": "toni@example.com", "password": "password123", "role": "owner", "city": "Chicago", "state": "IL", "zipCode": "60601" }
```

Response:

```json
{ "token": "jwt_token_here", "user": { "id": 1, "name": "Antoni Roman", "email": "toni@example.com", "role": "owner" } }
```

---

## POST /api/auth/login

Request:

```json
{ "email": "toni@example.com", "password": "password123" }
```

Response:

```json
{ "token": "jwt_token_here", "user": { "id": 1, "name": "Antoni Roman", "email": "toni@example.com", "role": "owner" } }
```

---

## GET /api/services

Response:

```json
{ "services": [{ "id": 1, "name": "Dog Walking", "description": "30-minute walk.", "basePrice": 20 }] }
```

---

## GET /api/sitters

Query params:

```text
service, city, state, zipCode, maxPrice, minRating
```

Response:

```json
{ "sitters": [{ "id": 4, "name": "Sarah Miller", "city": "Chicago", "state": "IL", "zipCode": "60601", "trustScore": 94, "averageRating": 4.8, "reviewCount": 12, "services": [{ "sitterServiceId": 9, "serviceId": 1, "name": "Dog Walking", "price": 22 }] }] }
```

---

## GET /api/sitters/:id

Response:

```json
{ "sitter": { "id": 4, "name": "Sarah Miller", "bio": "Experienced dog walker.", "services": [], "availability": [], "reviews": [] } }
```

---

## POST /api/sitters/me/services

Protected: sitter

Request:

```json
{ "serviceId": 1, "priceOverride": 22 }
```

Response:

```json
{ "sitterService": { "sitterServiceId": 9, "sitterId": 4, "serviceId": 1, "name": "Dog Walking", "price": 22 } }
```

---

## GET /api/pets

Protected: owner

Response:

```json
{ "pets": [] }
```

---

## POST /api/pets

Protected: owner

Request:

```json
{ "name": "Rocky", "species": "Dog", "breed": "Golden Retriever", "age": 4, "careNotes": "Allergic to chicken.", "photoUrl": "https://example.com/rocky.jpg" }
```

Response:

```json
{ "pet": { "id": 3, "ownerId": 1, "name": "Rocky", "species": "Dog", "breed": "Golden Retriever", "age": 4, "careNotes": "Allergic to chicken.", "photoUrl": "https://example.com/rocky.jpg" } }
```

---

## GET /api/pets/:id

Protected: owner

Response:

```json
{ "pet": {} }
```

---

## PUT /api/pets/:id

Protected: owner

Request:

```json
{ "name": "Rocky", "species": "Dog", "breed": "Golden Retriever", "age": 5, "careNotes": "Needs medication with dinner.", "photoUrl": "https://example.com/rocky.jpg" }
```

Response:

```json
{ "pet": {} }
```

---

## DELETE /api/pets/:id

Protected: owner

Response:

```json
{ "message": "Pet deleted successfully" }
```

---

## GET /api/sitters/:id/availability

Response:

```json
{ "availability": [] }
```

---

## POST /api/availability

Protected: sitter

Request:

```json
{ "date": "2026-07-15", "startTime": "09:00", "endTime": "09:30" }
```

Response:

```json
{ "availability": { "id": 11, "sitterId": 4, "date": "2026-07-15", "startTime": "09:00", "endTime": "09:30", "isBooked": false } }
```

---

## PUT /api/availability/:id

Protected: sitter

Request:

```json
{ "date": "2026-07-15", "startTime": "10:00", "endTime": "10:30" }
```

Response:

```json
{ "availability": {} }
```

---

## DELETE /api/availability/:id

Protected: sitter

Response:

```json
{ "message": "Availability deleted successfully" }
```

---

## POST /api/bookings

Protected: owner

Request:

```json
{ "petId": 3, "sitterId": 4, "sitterServiceId": 9, "availabilityId": 11 }
```

Response:

```json
{ "booking": { "id": 15, "ownerId": 1, "sitterId": 4, "petId": 3, "sitterServiceId": 9, "availabilityId": 11, "status": "pending", "totalPrice": 22, "date": "2026-07-15", "startTime": "09:00", "endTime": "09:30" } }
```

---

## GET /api/bookings

Protected: owner or sitter

Response:

```json
{ "bookings": [] }
```

---

## PATCH /api/bookings/:id/status

Protected: owner or sitter

Request:

```json
{ "status": "accepted" }
```

Response:

```json
{ "booking": { "id": 15, "status": "accepted", "availabilityId": 11, "isAvailabilityBooked": true } }
```

---

## POST /api/reviews

Protected: owner

Request:

```json
{ "bookingId": 15, "rating": 5, "comment": "Great communication and very reliable." }
```

Response:

```json
{ "review": { "id": 7, "bookingId": 15, "reviewerId": 1, "sitterId": 4, "rating": 5, "comment": "Great communication and very reliable.", "createdAt": "2026-07-16T15:30:00.000Z" } }
```

---

# Mock Files

```text
client/src/mocks/sitters.js
client/src/mocks/pets.js
client/src/mocks/bookings.js
client/src/mocks/reviews.js
```