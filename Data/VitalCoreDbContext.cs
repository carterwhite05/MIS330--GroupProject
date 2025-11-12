using Microsoft.EntityFrameworkCore;
using MIS330__GroupProject.Models;

namespace MIS330__GroupProject.Data;

public class VitalCoreDbContext : DbContext
{
    public VitalCoreDbContext(DbContextOptions<VitalCoreDbContext> options) : base(options)
    {
    }

    public DbSet<Trainer> Trainers { get; set; }
    public DbSet<Client> Clients { get; set; }
    public DbSet<Facility> Facilities { get; set; }
    public DbSet<TrainerAvailability> TrainerAvailabilities { get; set; }
    public DbSet<SessionBooking> SessionBookings { get; set; }
    public DbSet<FacilityUsage> FacilityUsages { get; set; }
    public DbSet<Payment> Payments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Trainer
        modelBuilder.Entity<Trainer>(entity =>
        {
            entity.ToTable("Trainer");
            entity.HasKey(e => e.TrainerID);
            entity.Property(e => e.TrainerID).ValueGeneratedOnAdd();
            entity.HasIndex(e => e.Name);
        });

        // Configure Client
        modelBuilder.Entity<Client>(entity =>
        {
            entity.ToTable("Client");
            entity.HasKey(e => e.ClientID);
            entity.Property(e => e.ClientID).ValueGeneratedOnAdd();
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Configure Facility
        modelBuilder.Entity<Facility>(entity =>
        {
            entity.ToTable("Facility");
            entity.HasKey(e => e.FacilityID);
            entity.Property(e => e.FacilityID).ValueGeneratedOnAdd();
        });

        // Configure TrainerAvailability
        modelBuilder.Entity<TrainerAvailability>(entity =>
        {
            entity.ToTable("Trainer_Availability");
            entity.HasKey(e => e.AvailabilityID);
            entity.Property(e => e.AvailabilityID).ValueGeneratedOnAdd();
            
            entity.HasOne(e => e.Trainer)
                .WithMany(t => t.TrainerAvailabilities)
                .HasForeignKey(e => e.TrainerID)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure SessionBooking
        modelBuilder.Entity<SessionBooking>(entity =>
        {
            entity.ToTable("Session_Booking");
            entity.HasKey(e => e.SessionID);
            entity.Property(e => e.SessionID).ValueGeneratedOnAdd();
            
            entity.HasOne(e => e.Client)
                .WithMany(c => c.SessionBookings)
                .HasForeignKey(e => e.ClientID)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.Trainer)
                .WithMany(t => t.SessionBookings)
                .HasForeignKey(e => e.TrainerID)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.TrainerAvailability)
                .WithMany(ta => ta.SessionBookings)
                .HasForeignKey(e => e.AvailabilityID)
                .OnDelete(DeleteBehavior.SetNull);
            
            entity.HasOne(e => e.Facility)
                .WithMany(f => f.SessionBookings)
                .HasForeignKey(e => e.FacilityID)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Configure FacilityUsage
        modelBuilder.Entity<FacilityUsage>(entity =>
        {
            entity.ToTable("Facility_Usage");
            entity.HasKey(e => e.UsageID);
            entity.Property(e => e.UsageID).ValueGeneratedOnAdd();
            
            entity.HasOne(e => e.Facility)
                .WithMany(f => f.FacilityUsages)
                .HasForeignKey(e => e.FacilityID)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.SessionBooking)
                .WithMany(sb => sb.FacilityUsages)
                .HasForeignKey(e => e.SessionID)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Payment
        modelBuilder.Entity<Payment>(entity =>
        {
            entity.ToTable("Payment");
            entity.HasKey(e => e.PaymentID);
            entity.Property(e => e.PaymentID).ValueGeneratedOnAdd();
            
            entity.HasOne(e => e.SessionBooking)
                .WithMany(sb => sb.Payments)
                .HasForeignKey(e => e.SessionID)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.Trainer)
                .WithMany(t => t.Payments)
                .HasForeignKey(e => e.TrainerID)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
