# Sample Data for Testing

Use these examples to populate your VitalCore database for testing.

## Trainers

```json
{
  "name": "John Smith",
  "specialty": "Weight Training",
  "hourlyRate": 75.00,
  "contactInfo": "john.smith@vitalcore.com",
  "vitalcoreFee": 15.00
}

{
  "name": "Sarah Johnson",
  "specialty": "Yoga & Flexibility",
  "hourlyRate": 65.00,
  "contactInfo": "sarah.j@vitalcore.com",
  "vitalcoreFee": 13.00
}

{
  "name": "Mike Chen",
  "specialty": "CrossFit",
  "hourlyRate": 80.00,
  "contactInfo": "mike.chen@vitalcore.com",
  "vitalcoreFee": 16.00
}

{
  "name": "Emily Rodriguez",
  "specialty": "Cardio & HIIT",
  "hourlyRate": 70.00,
  "contactInfo": "emily.r@vitalcore.com",
  "vitalcoreFee": 14.00
}
```

## Clients

```json
{
  "name": "Alice Brown",
  "email": "alice.brown@email.com",
  "phone": "555-0101",
  "membershipStatus": "Active"
}

{
  "name": "Bob Martinez",
  "email": "bob.martinez@email.com",
  "phone": "555-0102",
  "membershipStatus": "Active"
}

{
  "name": "Carol Davis",
  "email": "carol.davis@email.com",
  "phone": "555-0103",
  "membershipStatus": "Active"
}

{
  "name": "David Wilson",
  "email": "david.wilson@email.com",
  "phone": "555-0104",
  "membershipStatus": "Inactive"
}
```

## Facilities

```json
{
  "location": "Main Building - 2nd Floor",
  "roomName": "Studio A",
  "equipment": "Yoga mats, mirrors, sound system",
  "capacity": 20
}

{
  "location": "Main Building - 1st Floor",
  "roomName": "Weight Room",
  "equipment": "Free weights, bench press, squat racks, resistance machines",
  "capacity": 30
}

{
  "location": "Annex Building",
  "roomName": "Cardio Zone",
  "equipment": "Treadmills, ellipticals, stationary bikes",
  "capacity": 25
}

{
  "location": "Main Building - 3rd Floor",
  "roomName": "CrossFit Box",
  "equipment": "Ropes, kettlebells, pull-up bars, rowing machines",
  "capacity": 15
}
```

## Session Bookings

```json
{
  "clientID": 1,
  "trainerID": 1,
  "facilityID": 2,
  "date": "2025-11-15",
  "startTime": "10:00:00",
  "endTime": "11:00:00",
  "status": "Scheduled",
  "totalFee": 90.00
}

{
  "clientID": 2,
  "trainerID": 2,
  "facilityID": 1,
  "date": "2025-11-15",
  "startTime": "14:00:00",
  "endTime": "15:00:00",
  "status": "Scheduled",
  "totalFee": 78.00
}

{
  "clientID": 3,
  "trainerID": 3,
  "facilityID": 4,
  "date": "2025-11-16",
  "startTime": "09:00:00",
  "endTime": "10:00:00",
  "status": "Scheduled",
  "totalFee": 96.00
}
```

## Payments

```json
{
  "sessionID": 1,
  "trainerID": 1,
  "amountPaid": 90.00,
  "paymentDate": "2025-11-14",
  "paymentStatus": "Completed"
}

{
  "sessionID": 2,
  "trainerID": 2,
  "amountPaid": 78.00,
  "paymentDate": "2025-11-14",
  "paymentStatus": "Completed"
}
```

## How to Use This Data

### Option 1: Using the Web Interface
1. Run the application: `dotnet run`
2. Open http://localhost:5000
3. Navigate to each section (Trainers, Clients, etc.)
4. Click "Add" buttons and enter the data from above

### Option 2: Using Swagger API
1. Run the application: `dotnet run`
2. Open http://localhost:5000/swagger
3. Expand each endpoint (e.g., POST /api/trainers)
4. Click "Try it out"
5. Paste the JSON data
6. Click "Execute"

### Option 3: Using curl

```bash
# Add a trainer
curl -X POST "http://localhost:5000/api/trainers" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "specialty": "Weight Training",
    "hourlyRate": 75.00,
    "contactInfo": "john.smith@vitalcore.com",
    "vitalcoreFee": 15.00
  }'

# Add a client
curl -X POST "http://localhost:5000/api/clients" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Brown",
    "email": "alice.brown@email.com",
    "phone": "555-0101",
    "membershipStatus": "Active"
  }'

# Add a facility
curl -X POST "http://localhost:5000/api/facilities" \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Main Building - 2nd Floor",
    "roomName": "Studio A",
    "equipment": "Yoga mats, mirrors, sound system",
    "capacity": 20
  }'
```

## Testing Workflow

1. **Start with core entities:**
   - Add 3-4 Trainers
   - Add 3-4 Clients
   - Add 3-4 Facilities

2. **Create relationships:**
   - Add Session Bookings (requires Trainers, Clients, and Facilities to exist)

3. **Record payments:**
   - Add Payments (requires Sessions to exist)

4. **Test CRUD operations:**
   - View all records
   - View individual records
   - Update existing records
   - Delete records (be careful with foreign key constraints)

## Notes on Foreign Keys

- Session Bookings reference: Client, Trainer, Facility
- Payments reference: Session, Trainer

**Important**: Create Trainers, Clients, and Facilities first before creating Session Bookings. Create Session Bookings before creating Payments.

## Database Relationships

```
Trainer (1) ──────── (Many) Session_Booking
Client (1) ──────── (Many) Session_Booking
Facility (1) ──────── (Many) Session_Booking
Session_Booking (1) ──────── (Many) Payment
Trainer (1) ──────── (Many) Payment
```
