# Issue #11 Review Route Testing

## Route

- POST /api/reviews

## Successful Tests

- [ ] Owner can review a completed booking
- [ ] Rating is stored correctly
- [ ] Comment is stored correctly
- [ ] Response includes bookingId, reviewerId, and sitterId
- [ ] Response does not expose sensitive user information

## Validation Tests

- [ ] Missing bookingId returns 400
- [ ] Invalid bookingId returns 400
- [ ] Missing rating returns 400
- [ ] Rating below 1 returns 400
- [ ] Rating above 5 returns 400
- [ ] Decimal rating returns 400
- [ ] Non-string comment returns 400

## Permission Tests

- [ ] Missing token returns 401
- [ ] Invalid token returns 401
- [ ] Sitter role returns 403
- [ ] Another owner cannot review the booking
- [ ] Pending booking cannot be reviewed
- [ ] Accepted booking cannot be reviewed
- [ ] Cancelled booking cannot be reviewed

## Duplicate Test

- [ ] A booking can only be reviewed once
- [ ] Duplicate review returns 409

## Result

Issue #11 review creation behavior has been manually verified.