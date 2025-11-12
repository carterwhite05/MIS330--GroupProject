using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using MIS330__GroupProject.Data;

namespace MIS330__GroupProject;

public class VitalCoreDbContextFactory : IDesignTimeDbContextFactory<VitalCoreDbContext>
{
    public VitalCoreDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<VitalCoreDbContext>();
        
        // Use a connection string for design-time only
        var connectionString = "Server=localhost;Port=3306;Database=VitalCoreDB;User=vitalcore;Password=vitalcore123;";
        
        // Use Pomelo MySQL provider
        var serverVersion = new MySqlServerVersion(new Version(8, 0, 0));
        optionsBuilder.UseMySql(connectionString, serverVersion);
        
        return new VitalCoreDbContext(optionsBuilder.Options);
    }
}
