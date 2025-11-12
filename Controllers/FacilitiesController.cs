using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MIS330__GroupProject.Data;
using MIS330__GroupProject.Models;

namespace MIS330__GroupProject.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FacilitiesController : ControllerBase
{
    private readonly VitalCoreDbContext _context;

    public FacilitiesController(VitalCoreDbContext context)
    {
        _context = context;
    }

    // GET: api/Facilities
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Facility>>> GetFacilities()
    {
        return await _context.Facilities.ToListAsync();
    }

    // GET: api/Facilities/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Facility>> GetFacility(int id)
    {
        var facility = await _context.Facilities.FindAsync(id);

        if (facility == null)
        {
            return NotFound();
        }

        return facility;
    }

    // POST: api/Facilities
    [HttpPost]
    public async Task<ActionResult<Facility>> PostFacility(Facility facility)
    {
        _context.Facilities.Add(facility);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetFacility), new { id = facility.FacilityID }, facility);
    }

    // PUT: api/Facilities/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutFacility(int id, Facility facility)
    {
        if (id != facility.FacilityID)
        {
            return BadRequest();
        }

        _context.Entry(facility).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!FacilityExists(id))
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

    // DELETE: api/Facilities/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFacility(int id)
    {
        var facility = await _context.Facilities.FindAsync(id);
        if (facility == null)
        {
            return NotFound();
        }

        _context.Facilities.Remove(facility);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool FacilityExists(int id)
    {
        return _context.Facilities.Any(e => e.FacilityID == id);
    }
}
