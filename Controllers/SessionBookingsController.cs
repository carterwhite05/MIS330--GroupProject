using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MIS330__GroupProject.Data;
using MIS330__GroupProject.Models;

namespace MIS330__GroupProject.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SessionBookingsController : ControllerBase
{
    private readonly VitalCoreDbContext _context;

    public SessionBookingsController(VitalCoreDbContext context)
    {
        _context = context;
    }

    // GET: api/SessionBookings
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SessionBooking>>> GetSessionBookings()
    {
        return await _context.SessionBookings
            .Include(s => s.Client)
            .Include(s => s.Trainer)
            .Include(s => s.Facility)
            .ToListAsync();
    }

    // GET: api/SessionBookings/5
    [HttpGet("{id}")]
    public async Task<ActionResult<SessionBooking>> GetSessionBooking(int id)
    {
        var sessionBooking = await _context.SessionBookings
            .Include(s => s.Client)
            .Include(s => s.Trainer)
            .Include(s => s.Facility)
            .FirstOrDefaultAsync(s => s.SessionID == id);

        if (sessionBooking == null)
        {
            return NotFound();
        }

        return sessionBooking;
    }

    // POST: api/SessionBookings
    [HttpPost]
    public async Task<ActionResult<SessionBooking>> PostSessionBooking(SessionBooking sessionBooking)
    {
        _context.SessionBookings.Add(sessionBooking);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSessionBooking), new { id = sessionBooking.SessionID }, sessionBooking);
    }

    // PUT: api/SessionBookings/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutSessionBooking(int id, SessionBooking sessionBooking)
    {
        if (id != sessionBooking.SessionID)
        {
            return BadRequest();
        }

        _context.Entry(sessionBooking).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!SessionBookingExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/SessionBookings/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSessionBooking(int id)
    {
        var sessionBooking = await _context.SessionBookings.FindAsync(id);
        if (sessionBooking == null)
        {
            return NotFound();
        }

        _context.SessionBookings.Remove(sessionBooking);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool SessionBookingExists(int id)
    {
        return _context.SessionBookings.Any(e => e.SessionID == id);
    }
}
