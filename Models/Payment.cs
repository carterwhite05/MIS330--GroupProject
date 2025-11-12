using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MIS330__GroupProject.Models;

public class Payment
{
    [Key]
    public int PaymentID { get; set; }
    
    public int? SessionID { get; set; }
    
    public int? TrainerID { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal? AmountPaid { get; set; }
    
    [Column(TypeName = "date")]
    public DateTime? PaymentDate { get; set; }
    
    [StringLength(50)]
    public string? PaymentStatus { get; set; }
    
    // Navigation properties
    [ForeignKey("SessionID")]
    public SessionBooking? SessionBooking { get; set; }
    
    [ForeignKey("TrainerID")]
    public Trainer? Trainer { get; set; }
}
