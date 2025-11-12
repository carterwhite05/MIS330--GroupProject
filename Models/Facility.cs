using System.ComponentModel.DataAnnotations;

namespace MIS330__GroupProject.Models;

public class Facility
{
    [Key]
    public int FacilityID { get; set; }
    
    [StringLength(100)]
    public string? Location { get; set; }
    
    [StringLength(100)]
    public string? RoomName { get; set; }
    
    [StringLength(255)]
    public string? Equipment { get; set; }
    
    public int? Capacity { get; set; }
    
    // Navigation properties
    public ICollection<SessionBooking> SessionBookings { get; set; } = new List<SessionBooking>();
    public ICollection<FacilityUsage> FacilityUsages { get; set; } = new List<FacilityUsage>();
}
