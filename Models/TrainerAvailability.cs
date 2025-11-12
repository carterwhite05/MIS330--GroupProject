using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MIS330__GroupProject.Models;

public class TrainerAvailability
{
    [Key]
    public int AvailabilityID { get; set; }
    
    public int? TrainerID { get; set; }
    
    [Column(TypeName = "date")]
    public DateTime? DatesAvailable { get; set; }
    
    [Column(TypeName = "time")]
    public TimeSpan? StartTime { get; set; }
    
    [Column(TypeName = "time")]
    public TimeSpan? EndTime { get; set; }
    
    [StringLength(50)]
    public string? Status { get; set; }
    
    // Navigation properties
    [ForeignKey("TrainerID")]
    public Trainer? Trainer { get; set; }
    
    public ICollection<SessionBooking> SessionBookings { get; set; } = new List<SessionBooking>();
}
