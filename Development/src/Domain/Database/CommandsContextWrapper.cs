using Domain.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Domain.Database
{
    public interface ICommandsContextWrapper
    {
        GroupProjectDatabaseContext CommandsContext { get; set; }
    }

    public class CommandsContextWrapper : DbContext, ICommandsContextWrapper, IGpScoped
    {
        public GroupProjectDatabaseContext CommandsContext { get; set; }

        public CommandsContextWrapper(IOptions<ConfigSettingsDTO> configSettings)
        {
            _contextOptions ??= new DbContextOptionsBuilder<GroupProjectDatabaseContext>()
                                .UseSqlServer(configSettings.Value.DatabaseConnStr).Options;

            CommandsContext = new GroupProjectDatabaseContext(_contextOptions);
        }

        private static DbContextOptions<GroupProjectDatabaseContext>? _contextOptions = null;
    }
}
