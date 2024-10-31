namespace Domain.Database
{
    public class CommandsBase
    {
        protected GroupProjectDatabaseContext CommandsContext { get; set; }

        public CommandsBase(ICommandsContextWrapper commandsContextWrapper)
        {
            CommandsContext = commandsContextWrapper.CommandsContext;
        }
    }
}
