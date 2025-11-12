-- Create database
CREATE DATABASE VitalCoreDB;
USE VitalCoreDB;

-- 1. Trainer table
CREATE TABLE Trainer (
    TrainerID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Specialty VARCHAR(100),
    HourlyRate DECIMAL(10,2),
    ContactInfo VARCHAR(255),
    VitalcoreFee DECIMAL(10,2)
);

-- 2. Client table
CREATE TABLE Client (
    ClientID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    Phone VARCHAR(20),
    MembershipStatus VARCHAR(50)
);

-- 3. Facility table
CREATE TABLE Facility (
    FacilityID INT PRIMARY KEY AUTO_INCREMENT,
    Location VARCHAR(100),
    RoomName VARCHAR(100),
    Equipment VARCHAR(255),
    Capacity INT
);

-- 4. Trainer_Availability table
CREATE TABLE Trainer_Availability (
    AvailabilityID INT PRIMARY KEY AUTO_INCREMENT,
    TrainerID INT,
    DatesAvailable DATE,
    StartTime TIME,
    EndTime TIME,
    Status VARCHAR(50),
    FOREIGN KEY (TrainerID) REFERENCES Trainer(TrainerID)
);

-- 5. Session_Booking table
CREATE TABLE Session_Booking (
    SessionID INT PRIMARY KEY AUTO_INCREMENT,
    ClientID INT,
    TrainerID INT,
    AvailabilityID INT,
    FacilityID INT,
    Date DATE,
    StartTime TIME,
    EndTime TIME,
    Status VARCHAR(50),
    TotalFee DECIMAL(10,2),
    FOREIGN KEY (ClientID) REFERENCES Client(ClientID),
    FOREIGN KEY (TrainerID) REFERENCES Trainer(TrainerID),
    FOREIGN KEY (AvailabilityID) REFERENCES Trainer_Availability(AvailabilityID),
    FOREIGN KEY (FacilityID) REFERENCES Facility(FacilityID)
);

-- 6. Facility_Usage table
CREATE TABLE Facility_Usage (
    UsageID INT PRIMARY KEY AUTO_INCREMENT,
    FacilityID INT,
    SessionID INT,
    UsageDate DATE,
    StartTime TIME,
    EndTime TIME,
    FeeCharged DECIMAL(10,2),
    FOREIGN KEY (FacilityID) REFERENCES Facility(FacilityID),
    FOREIGN KEY (SessionID) REFERENCES Session_Booking(SessionID)
);

-- 7. Payment table
CREATE TABLE Payment (
    PaymentID INT PRIMARY KEY AUTO_INCREMENT,
    SessionID INT,
    TrainerID INT,
    AmountPaid DECIMAL(10,2),
    PaymentDate DATE,
    PaymentStatus VARCHAR(50),
    FOREIGN KEY (SessionID) REFERENCES Session_Booking(SessionID),
    FOREIGN KEY (TrainerID) REFERENCES Trainer(TrainerID)
);



USE VitalCoreDB;

-- 1. Trainer
INSERT INTO Trainer (Name, Specialty, HourlyRate, ContactInfo, VitalcoreFee)
VALUES
('Alice Johnson', 'Strength Training', 60.00, 'alice.johnson@email.com', 5.00),
('Bob Smith', 'Yoga', 50.00, 'bob.smith@email.com', 4.00),
('Cynthia Lee', 'Cardio Fitness', 55.00, 'cynthia.lee@email.com', 4.50),
('David Kim', 'Pilates', 65.00, 'david.kim@email.com', 5.50),
('Ella Martinez', 'CrossFit', 70.00, 'ella.martinez@email.com', 6.00);

-- 2. Client
INSERT INTO Client (Name, Email, Phone, MembershipStatus)
VALUES
('Frank Wilson', 'frank.wilson@email.com', '555-101-2020', 'Active'),
('Grace Liu', 'grace.liu@email.com', '555-202-3030', 'Active'),
('Henry Adams', 'henry.adams@email.com', '555-303-4040', 'Inactive'),
('Isabella Lopez', 'isabella.lopez@email.com', '555-404-5050', 'Active'),
('Jack Thomas', 'jack.thomas@email.com', '555-505-6060', 'Active');

-- 3. Facility
INSERT INTO Facility (Location, RoomName, Equipment, Capacity)
VALUES
('Downtown', 'Room A', 'Treadmills, Dumbbells, Mats', 15),
('Downtown', 'Room B', 'Yoga Mats, Blocks, Bands', 20),
('Uptown', 'Room C', 'Spin Bikes, Mirrors, Weights', 18),
('Midtown', 'Room D', 'Kettlebells, Ropes, Barbells', 12),
('Suburb', 'Room E', 'Cardio Machines, Resistance Machines', 25);

-- 4. Trainer_Availability
INSERT INTO Trainer_Availability (TrainerID, DatesAvailable, StartTime, EndTime, Status)
VALUES
(1, '2025-11-15', '09:00:00', '12:00:00', 'Available'),
(2, '2025-11-16', '10:00:00', '13:00:00', 'Available'),
(3, '2025-11-17', '08:00:00', '11:00:00', 'Available'),
(4, '2025-11-18', '11:00:00', '14:00:00', 'Available'),
(5, '2025-11-19', '07:00:00', '10:00:00', 'Available');

-- 5. Session_Booking
INSERT INTO Session_Booking (ClientID, TrainerID, AvailabilityID, FacilityID, Date, StartTime, EndTime, Status, TotalFee)
VALUES
(1, 1, 1, 1, '2025-11-15', '09:00:00', '10:00:00', 'Confirmed', 60.00),
(2, 2, 2, 2, '2025-11-16', '10:30:00', '11:30:00', 'Confirmed', 50.00),
(3, 3, 3, 3, '2025-11-17', '08:30:00', '09:30:00', 'Pending', 55.00),
(4, 4, 4, 4, '2025-11-18', '11:00:00', '12:00:00', 'Confirmed', 65.00),
(5, 5, 5, 5, '2025-11-19', '07:30:00', '08:30:00', 'Confirmed', 70.00);

-- 6. Facility_Usage
INSERT INTO Facility_Usage (FacilityID, SessionID, UsageDate, StartTime, EndTime, FeeCharged)
VALUES
(1, 1, '2025-11-15', '09:00:00', '10:00:00', 10.00),
(2, 2, '2025-11-16', '10:30:00', '11:30:00', 8.00),
(3, 3, '2025-11-17', '08:30:00', '09:30:00', 9.00),
(4, 4, '2025-11-18', '11:00:00', '12:00:00', 10.50),
(5, 5, '2025-11-19', '07:30:00', '08:30:00', 11.00);

-- 7. Payment
INSERT INTO Payment (SessionID, TrainerID, AmountPaid, PaymentDate, PaymentStatus)
VALUES
(1, 1, 10.00, '2025-11-15', 'Paid'),
(2, 2, 8.00, '2025-11-16', 'Paid'),
(3, 3, 9.00, '2025-11-17', 'Pending'),
(4, 4, 10.50, '2025-11-18', 'Paid'),
(5, 5, 11.00, '2025-11-19', 'Paid');

