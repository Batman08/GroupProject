using Domain.Database;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace Test.Database
{
    public class QueriesTestBase
    {
        protected readonly Mock<IQueriesContextWrapper> QueriesContextWrapperMock;
        protected readonly GroupProjectDatabaseContext TestContext;

        public QueriesTestBase()
        {
            // Mocking the QueriesContextWrapper
            QueriesContextWrapperMock = new Mock<IQueriesContextWrapper>();

            // Setting up database for testing
            var options = new DbContextOptionsBuilder<GroupProjectDatabaseContext>().UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking).Options;
            TestContext = new GroupProjectDatabaseContext(options);

            // Mock the QueriesContext property to return the in-memory context
            QueriesContextWrapperMock.Setup(wrapper => wrapper.QueriesContext).Returns(TestContext);
        }
    }
}
