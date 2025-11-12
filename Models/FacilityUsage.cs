using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MIS330__GroupProject.Models;

public class FacilityUsage
{
    [Key]
    public int UsageID { get; set; }
    
    public int? FacilityID { get; set; }
    
    public int? SessionID { get; set; }
    
    [Column(TypeName = "date")]
    public DateTime? UsageDate { get; set; }
    
    [Column(TypeName = "time")]
    public TimeSpan? StartTime { get; set; }
    
    [Column(TypeName = "time")]
    public TimeSpan? EndTime { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal? FeeCharged { get; set; }
    
    // Navigation properties
    [ForeignKey("FacilityID")]
    public Facility? Facility { get; set; }
    
    [ForeignKey("SessionID")]
    public SessionBooking? SessionBooking { get; set; }
}
