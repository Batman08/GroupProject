using Domain.Database;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace Test.Database
{
    public class CommandsTestBase : DbContext
    {
        protected readonly Mock<ICommandsContextWrapper> CommandsContextWrapperMock;
        protected readonly GroupProjectDatabaseContext TestContext;

        public CommandsTestBase()
        {
            // Mocking the QueriesContextWrapper
            CommandsContextWrapperMock = new Mock<ICommandsContextWrapper>();

            // Setting up an in-memory database for testing
            var options = new DbContextOptionsBuilder<GroupProjectDatabaseContext>().UseInMemoryDatabase(databaseName: "GroupProjectDbTestComands")
                                                                                    .Options;
            TestContext = new GroupProjectDatabaseContext(options);

            // Mock the QueriesContext property to return the in-memory context
            CommandsContextWrapperMock.Setup(wrapper => wrapper.CommandsContext).Returns(TestContext);
        }
    }
}
