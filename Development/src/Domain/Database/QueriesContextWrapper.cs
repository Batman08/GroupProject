using Domain.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Domain.Database
{
    public interface IQueriesContextWrapper
    {
        GroupProjectDatabaseContext QueriesContext { get; set; }
    }

    public class QueriesContextWrapper : DbContext, IQueriesContextWrapper, IGpScoped
    {
        public GroupProjectDatabaseContext QueriesContext { get; set; }

        public QueriesContextWrapper(IOptions<ConfigSettingsDTO> configSettings)
        {
            _contextOptions ??= new DbContextOptionsBuilder<GroupProjectDatabaseContext>()
                                .UseSqlServer(configSettings.Value.DatabaseConnStr)
                                 .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking).Options;

            QueriesContext = new GroupProjectDatabaseContext(_contextOptions);
            QueriesContext.ChangeTracker.AutoDetectChangesEnabled = false;
        }

        private static DbContextOptions<GroupProjectDatabaseContext>? _contextOptions = null;
    }
}
