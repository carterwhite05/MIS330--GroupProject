# VitalCore Setup - Quick Start Guide

## ✅ What's Been Completed

The full-stack application has been successfully created with:
- ASP.NET Core 9.0 Web API backend
- Entity Framework Core 9.0 with MySQL
- Complete CRUD API controllers
- Modern responsive frontend (HTML/CSS/JavaScript)
- Initial database migration created

## 📋 Next Steps to Run the Application

### 1. Set Up MySQL Database

First, ensure MySQL is installed and running. Then create the database:

```bash
# Start MySQL service (if not running)
brew services start mysql

# Or if installed differently:
mysql.server start

# Connect to MySQL and create the database
mysql -u root -p
```

In the MySQL prompt:
```sql
CREATE DATABASE VitalCoreDB;
EXIT;
```

### 2. Update Connection String

Edit `appsettings.json` and update the password:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=VitalCoreDB;User=root;Password=YOUR_MYSQL_PASSWORD;"
}
```

### 3. Apply Database Migration

The migration has already been created. Now apply it to create the database tables:

```bash
cd /Users/robertgill/mis330gp/MIS330--GroupProject
dotnet ef database update
```

### 4. Run the Application

```bash
dotnet run
```

The application will start on:
- **Application UI**: http://localhost:5000 or https://localhost:5001
- **API Documentation**: http://localhost:5000/swagger

## 🎯 Using the Application

Once running, you can:

1. **View Swagger API Docs**: Navigate to `/swagger` to see all API endpoints
2. **Use the Web Interface**: Open the root URL to access the management interface
3. **Manage Data**: Add, edit, and delete trainers, clients, facilities, sessions, and payments

## 📁 Project Structure

```
MIS330--GroupProject/
├── Controllers/              # REST API endpoints
│   ├── TrainersController.cs
│   ├── ClientsController.cs
│   ├── FacilitiesController.cs
│   ├── SessionBookingsController.cs
│   └── PaymentsController.cs
├── Data/
│   ├── VitalCoreDbContext.cs              # Database context
│   └── VitalCoreDbContextFactory.cs       # Design-time factory
├── Models/                   # Entity models
│   ├── Trainer.cs
│   ├── Client.cs
│   ├── Facility.cs
│   ├── TrainerAvailability.cs
│   ├── SessionBooking.cs
│   ├── FacilityUsage.cs
│   └── Payment.cs
├── Migrations/              # Database migrations
│   └── [timestamp]_InitialCreate.cs
├── wwwroot/                 # Frontend
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
├── Program.cs
├── appsettings.json
└── README.md
```

## 🔧 Troubleshooting

### Database Connection Issues

If you get "Access denied" errors:
1. Check your MySQL password in `appsettings.json`
2. Verify MySQL is running: `brew services list | grep mysql`
3. Test connection: `mysql -u root -p`

### Port Already in Use

If port 5000/5001 is taken:
```bash
dotnet run --urls "http://localhost:5050;https://localhost:5051"
```

### Migration Issues

To reset and recreate migrations:
```bash
# Remove migration
dotnet ef migrations remove

# Recreate
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## 📚 API Endpoints

### Trainers
- `GET /api/trainers` - Get all trainers
- `GET /api/trainers/{id}` - Get trainer by ID
- `POST /api/trainers` - Create trainer
- `PUT /api/trainers/{id}` - Update trainer
- `DELETE /api/trainers/{id}` - Delete trainer

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/{id}` - Get client by ID
- `POST /api/clients` - Create client
- `PUT /api/clients/{id}` - Update client
- `DELETE /api/clients/{id}` - Delete client

### Facilities
- `GET /api/facilities` - Get all facilities
- `GET /api/facilities/{id}` - Get facility by ID
- `POST /api/facilities` - Create facility
- `PUT /api/facilities/{id}` - Update facility
- `DELETE /api/facilities/{id}` - Delete facility

### Session Bookings
- `GET /api/sessionbookings` - Get all bookings
- `GET /api/sessionbookings/{id}` - Get booking by ID
- `POST /api/sessionbookings` - Create booking
- `PUT /api/sessionbookings/{id}` - Update booking
- `DELETE /api/sessionbookings/{id}` - Delete booking

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/{id}` - Get payment by ID
- `POST /api/payments` - Create payment
- `PUT /api/payments/{id}` - Update payment
- `DELETE /api/payments/{id}` - Delete payment

## 🎓 Tech Notes

- **Framework**: .NET 9.0
- **EF Core Version**: 9.0.0
- **MySQL Provider**: MySQL.EntityFrameworkCore 9.0.0
- **Database**: MySQL 8.0+

The application uses MySQL.EntityFrameworkCore (Oracle's official provider) instead of Pomelo because Pomelo doesn't have a stable release for EF Core 9.0 yet.

## ✨ Features Implemented

- ✅ Full CRUD operations for all entities
- ✅ RESTful API design
- ✅ Entity relationships and foreign keys
- ✅ Input validation
- ✅ Responsive web interface
- ✅ Modal forms for data entry
- ✅ Swagger API documentation
- ✅ Error handling
- ✅ CORS enabled for development

## 🚀 Ready to Go!

Your VitalCore Trainer Management System is ready. Just update your MySQL password and run:

```bash
dotnet ef database update
dotnet run
```

Then open http://localhost:5000 in your browser!
