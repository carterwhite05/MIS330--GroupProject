using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MIS330__GroupProject.Models;

public class SessionBooking
{
    [Key]
    public int SessionID { get; set; }
    
    public int? ClientID { get; set; }
    
    public int? TrainerID { get; set; }
    
    public int? AvailabilityID { get; set; }
    
    public int? FacilityID { get; set; }
    
    [Column(TypeName = "date")]
    public DateTime? Date { get; set; }
    
    [Column(TypeName = "time")]
    public TimeSpan? StartTime { get; set; }
    
    [Column(TypeName = "time")]
    public TimeSpan? EndTime { get; set; }
    
    [StringLength(50)]
    public string? Status { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal? TotalFee { get; set; }
    
    // Navigation properties
    [ForeignKey("ClientID")]
    public Client? Client { get; set; }
    
    [ForeignKey("TrainerID")]
    public Trainer? Trainer { get; set; }
    
    [ForeignKey("AvailabilityID")]
    public TrainerAvailability? TrainerAvailability { get; set; }
    
    [ForeignKey("FacilityID")]
    public Facility? Facility { get; set; }
    
    public ICollection<FacilityUsage> FacilityUsages { get; set; } = new List<FacilityUsage>();
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
