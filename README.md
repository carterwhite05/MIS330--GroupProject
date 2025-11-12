# VitalCore Trainer Management System

A full-stack web application for managing trainers, clients, facilities, session bookings, and payments at VitalCore fitness center.

## Tech Stack

- **Backend**: ASP.NET Core 9.0 Web API
- **Database**: MySQL with Entity Framework Core
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **ORM**: Entity Framework Core 9.0
- **MySQL Provider**: MySQL.EntityFrameworkCore 9.0

## Features

- **Trainer Management**: Create, read, update, and delete trainer profiles with specialties and rates
- **Client Management**: Manage client information and membership status
- **Facility Management**: Track facilities, rooms, equipment, and capacity
- **Session Bookings**: Schedule and manage training sessions between clients and trainers
- **Payment Processing**: Record and track payments for training sessions
- **RESTful API**: Complete CRUD operations for all entities
- **Swagger Documentation**: Interactive API documentation

## Project Structure

```
MIS330--GroupProject/
├── Controllers/          # API Controllers
│   ├── TrainersController.cs
│   ├── ClientsController.cs
│   ├── FacilitiesController.cs
│   ├── SessionBookingsController.cs
│   └── PaymentsController.cs
├── Data/                 # Database context
│   └── VitalCoreDbContext.cs
├── Models/               # Entity models
│   ├── Trainer.cs
│   ├── Client.cs
│   ├── Facility.cs
│   ├── TrainerAvailability.cs
│   ├── SessionBooking.cs
│   ├── FacilityUsage.cs
│   └── Payment.cs
├── wwwroot/              # Static files
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── Program.cs
├── appsettings.json
└── MIS330--GroupProject.csproj
```

## Setup Instructions

### Prerequisites

- .NET 9.0 SDK
- MySQL Server 8.0+
- Git

### Database Setup

1. Install MySQL and start the MySQL service

2. Create the database (you can use the MySQL command line or a tool like MySQL Workbench):
```sql
CREATE DATABASE VitalCoreDB;
```

3. Update the connection string in `appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=VitalCoreDB;User=root;Password=kifirogill"
}
```

### Running the Application

1. Restore NuGet packages:
```bash
dotnet restore
```

2. Create and apply the database migration:
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

3. Run the application:
```bash
dotnet run
```

4. Open your browser and navigate to:
   - Application: `https://localhost:5001` or `http://localhost:5000`
   - Swagger API Docs: `https://localhost:5001/swagger`

## API Endpoints

### Trainers
- `GET /api/trainers` - Get all trainers
- `GET /api/trainers/{id}` - Get trainer by ID
- `POST /api/trainers` - Create new trainer
- `PUT /api/trainers/{id}` - Update trainer
- `DELETE /api/trainers/{id}` - Delete trainer

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/{id}` - Get client by ID
- `POST /api/clients` - Create new client
- `PUT /api/clients/{id}` - Update client
- `DELETE /api/clients/{id}` - Delete client

### Facilities
- `GET /api/facilities` - Get all facilities
- `GET /api/facilities/{id}` - Get facility by ID
- `POST /api/facilities` - Create new facility
- `PUT /api/facilities/{id}` - Update facility
- `DELETE /api/facilities/{id}` - Delete facility

### Session Bookings
- `GET /api/sessionbookings` - Get all session bookings
- `GET /api/sessionbookings/{id}` - Get session booking by ID
- `POST /api/sessionbookings` - Create new session booking
- `PUT /api/sessionbookings/{id}` - Update session booking
- `DELETE /api/sessionbookings/{id}` - Delete session booking

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/{id}` - Get payment by ID
- `POST /api/payments` - Create new payment
- `PUT /api/payments/{id}` - Update payment
- `DELETE /api/payments/{id}` - Delete payment

## Database Schema

The application implements the following tables:
- **Trainer**: Trainer profiles with specialties and rates
- **Client**: Client information and membership status
- **Facility**: Facility locations, rooms, and equipment
- **Trainer_Availability**: Trainer availability schedules
- **Session_Booking**: Training session bookings
- **Facility_Usage**: Facility usage tracking
- **Payment**: Payment records

## Development

To add new features or modify existing ones:

1. **Models**: Add or modify entity classes in the `Models/` folder
2. **Database**: Update `VitalCoreDbContext.cs` and create a new migration
3. **API**: Add or modify controllers in the `Controllers/` folder
4. **Frontend**: Update HTML, CSS, and JavaScript files in `wwwroot/`

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check connection string credentials
- Ensure VitalCoreDB database exists

### Migration Issues
```bash
# Remove last migration
dotnet ef migrations remove

# Reset database
dotnet ef database drop
dotnet ef database update
```

### Port Conflicts
If ports 5000/5001 are in use, modify `launchSettings.json` or use:
```bash
dotnet run --urls "http://localhost:5050;https://localhost:5051"
```

## License

This project is for educational purposes as part of MIS 330 coursework.
