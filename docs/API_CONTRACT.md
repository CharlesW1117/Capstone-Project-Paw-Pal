# PawPal Frontend API Contract

API contract between the PawPal frontend and the standalone backend:

https://github.com/AntoniRom17/Capstone-Project-Paw-Pal-Back

## Configuration

```env
VITE_API_URL=http://localhost:3000/api
```

The frontend defaults to `http://localhost:3000/api`.

Protected requests require:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

All errors use:

```json
{
  "error": "Error message"
}
```

All route IDs must be positive integers. Dates use `YYYY-MM-DD`; request times use `HH:MM`.

## Roles

- `owner`: manages pets, creates bookings, cancels bookings, and submits reviews.
- `sitter`: manages availability and services, accepts or declines bookings, and completes bookings.
- Both roles can manage their profile, view bookings, and exchange booking messages.

## Shared Objects

```text
User:
id, name, email, role, bio, phone, city, state, zipCode,
trustScore, backgroundCheckStatus, onTimePercentage,
isActive, deactivatedAt, createdAt

Sitter:
id, name, bio, phone, city, state, zipCode, trustScore,
backgroundCheckStatus, onTimePercentage, averageRating,
reviewCount, services

SitterService:
sitterServiceId, sitterId, serviceId, name, description, price

Pet:
id, ownerId, name, species, breed, age, careNotes, photoUrl

Availability:
id, sitterId, date, startTime, endTime, isBooked

Booking:
id, ownerId, sitterId, petId, sitterServiceId, availabilityId,
status, totalPrice, date, startTime, endTime, petName,
ownerName, sitterName, serviceName

Message:
id, bookingId, senderId, recipientId, body, readAt, createdAt

Review:
id, bookingId, reviewerId, sitterId, rating, wasOnTime,
comment, createdAt

TrustMetrics:
sitterId, trustScore, onTimePercentage, backgroundCheckStatus
```

Booking statuses:

```text
pending, accepted, declined, cancelled, completed
```

Background-check statuses:

```text
not_submitted, pending, verified, rejected
```

## Health And Authentication

| Method | Endpoint | Access | Request | Success response |
| --- | --- | --- | --- | --- |
| `GET` | `/api/health` | Public | None | `{ status, message, environment }` |
| `POST` | `/api/auth/register` | Public | Registration fields | `{ token, user }` |
| `POST` | `/api/auth/login` | Public | `{ email, password }` | `{ token, user }` |

Registration request:

```json
{
  "name": "Antoni Roman",
  "email": "toni@example.com",
  "password": "password123",
  "role": "owner",
  "city": "Chicago",
  "state": "IL",
  "zipCode": "60601",
  "phone": null,
  "bio": null
}
```

Required registration fields are `name`, `email`, `password`, `role`, `city`, `state`, and `zipCode`.

Passwords must contain 8 to 128 characters. Duplicate emails return `409 Conflict`.

## Account Management

| Method | Endpoint | Request | Success response |
| --- | --- | --- | --- |
| `GET` | `/api/users/me` | None | `{ user }` |
| `PATCH` | `/api/users/me` | Profile fields | `{ user }` |
| `PATCH` | `/api/users/me/password` | `{ currentPassword, newPassword }` | `{ message }` |
| `DELETE` | `/api/users/me` | `{ password }` | `{ message }` |

Supported profile fields:

```text
name, email, bio, phone, city, state, zipCode
```

`bio` and `phone` can be cleared with `null`.

Accounts with pending or accepted bookings cannot be deactivated.

## Services And Sitters

| Method | Endpoint | Access | Request or query | Success response |
| --- | --- | --- | --- | --- |
| `GET` | `/api/services` | Public | None | `{ services }` |
| `GET` | `/api/sitters` | Public | Search filters | `{ sitters }` |
| `GET` | `/api/sitters/:id` | Public | None | `{ sitter }` |
| `POST` | `/api/sitters/me/services` | Sitter | `{ serviceId, priceOverride? }` | `{ sitterService }` |
| `PATCH` | `/api/sitters/me/services/:id` | Sitter | `{ priceOverride }` | `{ sitterService }` |
| `DELETE` | `/api/sitters/me/services/:id` | Sitter | None | `{ message }` |
| `POST` | `/api/sitters/me/background-check` | Sitter | None | `{ backgroundCheck, trustMetrics }` |

Sitter search parameters:

```text
service, city, state, zipCode, maxPrice, minRating
```

`priceOverride` must be non-negative. Setting it to `null` restores the service's base price.

A sitter service attached to a booking cannot be deleted.

## Provider Background-Check Webhook

| Method | Endpoint | Access | Request | Success response |
| --- | --- | --- | --- | --- |
| `PATCH` | `/api/background-checks/:sitterId` | Provider | `{ status }` | `{ backgroundCheck, trustMetrics }` |

Required header:

```http
x-background-check-secret: <BACKGROUND_CHECK_WEBHOOK_SECRET>
```

Accepted provider statuses:

```text
verified, rejected
```

This endpoint is not called directly by the frontend.

## Pets

All pet endpoints require an authenticated owner and only access that owner's pets.

| Method | Endpoint | Request | Success response |
| --- | --- | --- | --- |
| `GET` | `/api/pets` | None | `{ pets }` |
| `POST` | `/api/pets` | Pet fields | `{ pet }` |
| `GET` | `/api/pets/:id` | None | `{ pet }` |
| `PUT` | `/api/pets/:id` | Pet fields | `{ pet }` |
| `DELETE` | `/api/pets/:id` | None | `{ message }` |

Pet request:

```json
{
  "name": "Rocky",
  "species": "Dog",
  "breed": "Golden Retriever",
  "age": 4,
  "careNotes": "Allergic to chicken.",
  "photoUrl": "https://example.com/rocky.jpg"
}
```

Only `name` and `species` are required when creating a pet.

`breed`, `age`, `careNotes`, and `photoUrl` can be cleared with `null`. A pet attached to a booking cannot be deleted.

## Availability

| Method | Endpoint | Access | Request | Success response |
| --- | --- | --- | --- | --- |
| `GET` | `/api/sitters/:id/availability` | Public | None | `{ availability }` |
| `POST` | `/api/availability` | Sitter | Availability fields | `{ availability }` |
| `PUT` | `/api/availability/:id` | Sitter | Changed fields | `{ availability }` |
| `DELETE` | `/api/availability/:id` | Sitter | None | `{ message }` |

Availability request:

```json
{
  "date": "2026-08-01",
  "startTime": "09:00",
  "endTime": "10:00"
}
```

Rules:

- The date and start time must be in the future.
- `endTime` must be after `startTime`.
- A sitter's availability cannot overlap another slot.
- Overlapping slots return `409 Conflict`.
- Slots attached to bookings cannot be edited or deleted.
- Public results only include future, unbooked slots.

## Bookings

| Method | Endpoint | Access | Request | Success response |
| --- | --- | --- | --- | --- |
| `POST` | `/api/bookings` | Owner | Booking IDs | `{ booking }` |
| `GET` | `/api/bookings` | Owner or sitter | None | `{ bookings }` |
| `PATCH` | `/api/bookings/:id/status` | Participant | `{ status }` | `{ booking }` |

Create-booking request:

```json
{
  "sitterId": 4,
  "petId": 3,
  "sitterServiceId": 9,
  "availabilityId": 11
}
```

Booking requirements:

- The pet must belong to the authenticated owner.
- The service and availability must belong to the selected sitter.
- The slot must be future and unbooked.
- Concurrent requests cannot book the same slot twice.

Status permissions:

| Role | Allowed updates |
| --- | --- |
| Owner | `cancelled` |
| Sitter | `accepted`, `declined`, `completed` |

Allowed transitions:

```text
pending -> accepted, declined, cancelled
accepted -> completed, cancelled
```

Declined and cancelled bookings release their availability.

## Messages

Only booking participants can access a booking conversation.

| Method | Endpoint | Request | Success response |
| --- | --- | --- | --- |
| `GET` | `/api/messages` | None | `{ conversations }` |
| `GET` | `/api/messages/:bookingId` | None | `{ messages }` |
| `POST` | `/api/messages` | `{ bookingId, body }` | `{ message }` |

Send-message request:

```json
{
  "bookingId": 15,
  "body": "Rocky will be ready at 9:00."
}
```

Messages must contain 1 to 2000 non-whitespace characters.

Messages are returned chronologically. Opening a conversation marks messages addressed to the current user as read.

## Reviews And Trust Score

| Method | Endpoint | Access | Request | Success response |
| --- | --- | --- | --- | --- |
| `POST` | `/api/reviews` | Owner | Review fields | `{ review, trustMetrics }` |

Review request:

```json
{
  "bookingId": 15,
  "rating": 5,
  "wasOnTime": true,
  "comment": "Great communication and very reliable."
}
```

Rules:

- The booking must belong to the authenticated owner.
- The booking must be completed.
- Each booking can only be reviewed once.
- `rating` must be an integer from 1 through 5.
- `wasOnTime` can be `true`, `false`, or `null`.
- `comment` can contain up to 2000 characters.

Trust Score calculation:

```text
Average rating: up to 70 points
On-time percentage: up to 20 points
Verified background check: 10 points
Maximum score: 100
```

Trust metrics are recalculated after reviews and background-check changes.