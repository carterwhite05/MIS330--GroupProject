using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MIS330__GroupProject.Data;
using MIS330__GroupProject.Models;

namespace MIS330__GroupProject.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TrainersController : ControllerBase
{
    private readonly VitalCoreDbContext _context;

    public TrainersController(VitalCoreDbContext context)
    {
        _context = context;
    }

    // GET: api/Trainers
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Trainer>>> GetTrainers()
    {
        return await _context.Trainers.ToListAsync();
    }

    // GET: api/Trainers/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Trainer>> GetTrainer(int id)
    {
        var trainer = await _context.Trainers.FindAsync(id);

        if (trainer == null)
        {
            return NotFound();
        }

        return trainer;
    }

    // POST: api/Trainers
    [HttpPost]
    public async Task<ActionResult<Trainer>> PostTrainer(Trainer trainer)
    {
        _context.Trainers.Add(trainer);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTrainer), new { id = trainer.TrainerID }, trainer);
    }

    // PUT: api/Trainers/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTrainer(int id, Trainer trainer)
    {
        if (id != trainer.TrainerID)
        {
            return BadRequest();
        }

        _context.Entry(trainer).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!TrainerExists(id))
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

    // DELETE: api/Trainers/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTrainer(int id)
    {
        var trainer = await _context.Trainers.FindAsync(id);
        if (trainer == null)
        {
            return NotFound();
        }

        _context.Trainers.Remove(trainer);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool TrainerExists(int id)
    {
        return _context.Trainers.Any(e => e.TrainerID == id);
    }
}
