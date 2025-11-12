using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MIS330__GroupProject.Models;

public class Trainer
{
    [Key]
    public int TrainerID { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(100)]
    public string? Specialty { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal? HourlyRate { get; set; }
    
    [StringLength(255)]
    public string? ContactInfo { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal? VitalcoreFee { get; set; }
    
    // Navigation properties
    public ICollection<TrainerAvailability> TrainerAvailabilities { get; set; } = new List<TrainerAvailability>();
    public ICollection<SessionBooking> SessionBookings { get; set; } = new List<SessionBooking>();
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
