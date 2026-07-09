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

