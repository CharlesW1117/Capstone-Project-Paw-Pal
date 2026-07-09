# PawPal API Contract

This document defines the planned backend API contract for the PawPal capstone project.

The frontend team should use this file as the source of truth for planned routes, request bodies, response shapes, and booking rules.

This contract is a draft and may be updated after the final database schema is completed.

## Base URL

Local backend:

http://localhost:3000/api

## Authentication

Protected routes will require a JWT token.

Frontend should send the token in the request headers:

Authorization: Bearer <token>

## Standard Success Response

Most successful responses will return JSON data directly.

Example:

{
  "user": {
    "id": 1,
    "name": "Antoni Roman",
    "email": "toni@example.com",
    "role": "owner"
  }
}

## Standard Error Response

All backend errors should use this general shape:

{
  "error": "Error message here"
}

## User Roles

Users can have one of two roles:

- owner
- sitter

Owners can manage pets, search sitters, request bookings, and leave reviews.

Sitters can manage offered services, availability, booking requests, and profile information.
---

# Shared Data Shapes

## User Object

{
  "id": 1,
  "name": "Antoni Roman",
  "email": "toni@example.com",
  "role": "owner",
  "bio": "Pet owner in Chicago.",
  "phone": "555-555-5555",
  "city": "Chicago",
  "state": "IL",
  "zipCode": "60601"
}

## Sitter Card Object

Used for sitter search and discovery pages.

{
  "id": 4,
  "name": "Sarah Miller",
  "bio": "Experienced dog walker and pet sitter.",
  "city": "Chicago",
  "state": "IL",
  "zipCode": "60601",
  "trustScore": 94,
  "backgroundCheckStatus": "verified",
  "onTimePercentage": 98,
  "averageRating": 4.8,
  "reviewCount": 12,
  "services": [
    {
      "sitterServiceId": 9,
      "serviceId": 1,
      "name": "Dog Walking",
      "description": "30-minute neighborhood dog walk.",
      "price": 22
    }
  ]
}

## Pet Object

{
  "id": 3,
  "ownerId": 1,
  "name": "Rocky",
  "species": "Dog",
  "breed": "Golden Retriever",
  "age": 4,
  "careNotes": "Loves long walks. Allergic to chicken.",
  "photoUrl": "https://example.com/rocky.jpg"
}

## Service Object

{
  "id": 1,
  "name": "Dog Walking",
  "description": "30-minute neighborhood dog walk.",
  "basePrice": 20
}

## Availability Object

{
  "id": 11,
  "sitterId": 4,
  "date": "2026-07-15",
  "startTime": "09:00",
  "endTime": "09:30",
  "isBooked": false
}

## Booking Object

{
  "id": 15,
  "ownerId": 1,
  "sitterId": 4,
  "petId": 3,
  "sitterServiceId": 9,
  "availabilityId": 11,
  "status": "pending",
  "totalPrice": 22,
  "date": "2026-07-15",
  "startTime": "09:00",
  "endTime": "09:30"
}

## Review Object

{
  "id": 7,
  "bookingId": 15,
  "reviewerId": 1,
  "sitterId": 4,
  "rating": 5,
  "comment": "Great communication and very reliable.",
  "createdAt": "2026-07-16T15:30:00.000Z"
}


---

# API Routes

## Health

### GET /api/health

Checks whether the backend server is running.

Response:

{
  "status": "ok",
  "message": "PawPal backend is running",
  "environment": "development"
}

---

# Auth Routes

## POST /api/auth/register

Creates a new user account.

Request body:

{
  "name": "Antoni Roman",
  "email": "toni@example.com",
  "password": "password123",
  "role": "owner",
  "city": "Chicago",
  "state": "IL",
  "zipCode": "60601"
}

Response:

{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "Antoni Roman",
    "email": "toni@example.com",
    "role": "owner",
    "city": "Chicago",
    "state": "IL",
    "zipCode": "60601"
  }
}

Notes:

- Password should be hashed with bcrypt.
- Password hash should never be returned to the frontend.
- Role must be either owner or sitter.

## POST /api/auth/login

Logs in an existing user.

Request body:

{
  "email": "toni@example.com",
  "password": "password123"
}

Response:

{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "Antoni Roman",
    "email": "toni@example.com",
    "role": "owner",
    "city": "Chicago",
    "state": "IL",
    "zipCode": "60601"
  }
}

---

# Service Routes

## GET /api/services

Returns all available service categories.

Response:

{
  "services": [
    {
      "id": 1,
      "name": "Dog Walking",
      "description": "30-minute neighborhood dog walk.",
      "basePrice": 20
    },
    {
      "id": 2,
      "name": "Pet Sitting",
      "description": "In-home pet sitting.",
      "basePrice": 40
    }
  ]
}

---

# Sitter Routes

## GET /api/sitters

Searches and filters sitters.

Example query:

GET /api/sitters?service=Dog Walking&city=Chicago&state=IL&zipCode=60601&maxPrice=30&minRating=4

Supported query parameters:

- service
- city
- state
- zipCode
- maxPrice
- minRating

Response:

{
  "sitters": [
    {
      "id": 4,
      "name": "Sarah Miller",
      "bio": "Experienced dog walker and pet sitter.",
      "city": "Chicago",
      "state": "IL",
      "zipCode": "60601",
      "trustScore": 94,
      "backgroundCheckStatus": "verified",
      "onTimePercentage": 98,
      "averageRating": 4.8,
      "reviewCount": 12,
      "services": [
        {
          "sitterServiceId": 9,
          "serviceId": 1,
          "name": "Dog Walking",
          "description": "30-minute neighborhood dog walk.",
          "price": 22
        }
      ]
    }
  ]
}

Notes:

- Location search depends on city, state, and zipCode fields.
- Pricing should come from sitter_services.price_override when available.
- Rating should come from reviews.
- Trust Score, background check, and on-time percentage may be seeded demo values for MVP.

## GET /api/sitters/:id

Returns a detailed sitter profile.

Response:

{
  "sitter": {
    "id": 4,
    "name": "Sarah Miller",
    "bio": "Experienced dog walker and pet sitter.",
    "phone": "555-555-5555",
    "city": "Chicago",
    "state": "IL",
    "zipCode": "60601",
    "trustScore": 94,
    "backgroundCheckStatus": "verified",
    "onTimePercentage": 98,
    "averageRating": 4.8,
    "reviewCount": 12,
    "services": [
      {
        "sitterServiceId": 9,
        "serviceId": 1,
        "name": "Dog Walking",
        "description": "30-minute neighborhood dog walk.",
        "price": 22
      }
    ],
    "availability": [
      {
        "id": 11,
        "date": "2026-07-15",
        "startTime": "09:00",
        "endTime": "09:30",
        "isBooked": false
      }
    ],
    "reviews": [
      {
        "id": 7,
        "rating": 5,
        "comment": "Great communication and very reliable.",
        "reviewerName": "Antoni Roman",
        "createdAt": "2026-07-16T15:30:00.000Z"
      }
    ]
  }
}

## POST /api/sitters/me/services

Allows a sitter to add a service they offer.

Protected route: sitter only.

Request body:

{
  "serviceId": 1,
  "priceOverride": 22
}

Response:

{
  "sitterService": {
    "sitterServiceId": 9,
    "sitterId": 4,
    "serviceId": 1,
    "name": "Dog Walking",
    "price": 22
  }
}

---

# Pet Routes

## GET /api/pets

Returns the current owner's pets.

Protected route: owner only.

Response:

{
  "pets": [
    {
      "id": 3,
      "ownerId": 1,
      "name": "Rocky",
      "species": "Dog",
      "breed": "Golden Retriever",
      "age": 4,
      "careNotes": "Loves long walks. Allergic to chicken.",
      "photoUrl": "https://example.com/rocky.jpg"
    }
  ]
}

## POST /api/pets

Creates a pet profile.

Protected route: owner only.

Request body:

{
  "name": "Rocky",
  "species": "Dog",
  "breed": "Golden Retriever",
  "age": 4,
  "careNotes": "Loves long walks. Allergic to chicken.",
  "photoUrl": "https://example.com/rocky.jpg"
}

Response:

{
  "pet": {
    "id": 3,
    "ownerId": 1,
    "name": "Rocky",
    "species": "Dog",
    "breed": "Golden Retriever",
    "age": 4,
    "careNotes": "Loves long walks. Allergic to chicken.",
    "photoUrl": "https://example.com/rocky.jpg"
  }
}

## GET /api/pets/:id

Returns one pet owned by the current user.

Protected route: owner only.

## PUT /api/pets/:id

Updates a pet owned by the current user.

Protected route: owner only.

## DELETE /api/pets/:id

Deletes a pet owned by the current user.

Protected route: owner only.

Response:

{
  "message": "Pet deleted successfully"
}


---

# Availability Routes

## GET /api/sitters/:id/availability

Returns availability for a specific sitter.

Response:

{
  "availability": [
    {
      "id": 11,
      "sitterId": 4,
      "date": "2026-07-15",
      "startTime": "09:00",
      "endTime": "09:30",
      "isBooked": false
    }
  ]
}

## POST /api/availability

Creates a sitter availability slot.

Protected route: sitter only.

Request body:

{
  "date": "2026-07-15",
  "startTime": "09:00",
  "endTime": "09:30"
}

Response:

{
  "availability": {
    "id": 11,
    "sitterId": 4,
    "date": "2026-07-15",
    "startTime": "09:00",
    "endTime": "09:30",
    "isBooked": false
  }
}

## PUT /api/availability/:id

Updates an availability slot.

Protected route: sitter only.

Request body:

{
  "date": "2026-07-15",
  "startTime": "10:00",
  "endTime": "10:30"
}

Response:

{
  "availability": {
    "id": 11,
    "sitterId": 4,
    "date": "2026-07-15",
    "startTime": "10:00",
    "endTime": "10:30",
    "isBooked": false
  }
}

## DELETE /api/availability/:id

Deletes an availability slot.

Protected route: sitter only.

Response:

{
  "message": "Availability slot deleted successfully"
}

---

# Booking Routes

## POST /api/bookings

Creates a new booking request.

Protected route: owner only.

Request body:

{
  "petId": 3,
  "sitterId": 4,
  "sitterServiceId": 9,
  "availabilityId": 11
}

Response:

{
  "booking": {
    "id": 15,
    "ownerId": 1,
    "sitterId": 4,
    "petId": 3,
    "sitterServiceId": 9,
    "availabilityId": 11,
    "status": "pending",
    "totalPrice": 22,
    "date": "2026-07-15",
    "startTime": "09:00",
    "endTime": "09:30"
  }
}

Backend rules:

- Owner must own the selected pet.
- sitterServiceId must belong to the selected sitter.
- availabilityId must belong to the selected sitter.
- totalPrice should be calculated from the sitter-specific service price.
- Booking starts as pending.

## GET /api/bookings

Returns bookings for the current user.

Protected route: owner or sitter.

Response:

{
  "bookings": [
    {
      "id": 15,
      "ownerId": 1,
      "sitterId": 4,
      "petId": 3,
      "sitterServiceId": 9,
      "availabilityId": 11,
      "status": "pending",
      "totalPrice": 22,
      "date": "2026-07-15",
      "startTime": "09:00",
      "endTime": "09:30",
      "pet": {
        "id": 3,
        "name": "Rocky"
      },
      "sitter": {
        "id": 4,
        "name": "Sarah Miller"
      },
      "service": {
        "id": 1,
        "name": "Dog Walking"
      }
    }
  ]
}

## PATCH /api/bookings/:id/status

Updates booking status.

Protected route: owner or sitter depending on status change.

Request body:

{
  "status": "accepted"
}

Response:

{
  "booking": {
    "id": 15,
    "status": "accepted",
    "availabilityId": 11,
    "isAvailabilityBooked": true
  }
}

Allowed statuses:

- pending
- accepted
- declined
- cancelled
- completed

Status rules:

- pending -> accepted
- pending -> declined
- pending -> cancelled
- accepted -> cancelled
- accepted -> completed

Availability rules:

- accepted = availability slot becomes booked
- declined = availability slot becomes open
- cancelled = availability slot becomes open
- completed = availability slot stays historically booked

---

# Review Routes

## POST /api/reviews

Creates a review for a completed booking.

Protected route: owner only.

Request body:

{
  "bookingId": 15,
  "rating": 5,
  "comment": "Great communication and very reliable."
}

Response:

{
  "review": {
    "id": 7,
    "bookingId": 15,
    "reviewerId": 1,
    "sitterId": 4,
    "rating": 5,
    "comment": "Great communication and very reliable.",
    "createdAt": "2026-07-16T15:30:00.000Z"
  }
}

Backend rules:

- Booking must be completed.
- Only the owner from the booking can leave the review.
- Each booking can only have one review.
- Rating must be between 1 and 5.


---

# Frontend Integration Notes

Frontend can begin building with mock JSON using the response shapes in this document.

Recommended mock files:

- client/src/mocks/sitters.js
- client/src/mocks/pets.js
- client/src/mocks/bookings.js
- client/src/mocks/reviews.js

When backend endpoints are ready, frontend should replace mock data with fetch calls using the same response shapes.

Frontend should avoid hardcoding field names that are not listed in this contract.

---

# Open Questions

These should be confirmed after the final schema is completed:

1. Will Trust Score be calculated or seeded demo data?
2. Will background check status be seeded only for MVP?
3. Will on-time percentage be seeded only for MVP?
4. Should pending bookings temporarily hold availability, or only accepted bookings?
5. Will latitude and longitude be included now or saved for stretch map features?
6. Should deleted pets be hard deleted or soft deleted?
7. Should sitters be able to edit pricing after bookings already exist?
8. Should booking totalPrice remain a snapshot even if sitter pricing changes later?

---

# Notes for Backend Team

Important backend implementation rules:

- Bookings should reference sitterServiceId, not just serviceId.
- Bookings should include separate ownerId and sitterId fields.
- Bookings should include availabilityId.
- Declined or cancelled bookings should free the availability slot.
- Accepted bookings should lock the availability slot.
- Completed bookings should remain historically booked.
- Password hashes should never be returned to the frontend.
- Protected routes should require a valid JWT.
- Owner-only and sitter-only permissions should be enforced on the backend.

