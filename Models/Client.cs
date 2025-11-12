using System.ComponentModel.DataAnnotations;

namespace MIS330__GroupProject.Models;

public class Client
{
    [Key]
    public int ClientID { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(100)]
    [EmailAddress]
    public string? Email { get; set; }
    
    [StringLength(20)]
    public string? Phone { get; set; }
    
    [StringLength(50)]
    public string? MembershipStatus { get; set; }
    
    // Navigation properties
    public ICollection<SessionBooking> SessionBookings { get; set; } = new List<SessionBooking>();
}
