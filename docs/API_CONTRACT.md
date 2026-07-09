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