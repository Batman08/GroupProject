using Domain.Features.Search;
using Test.Database;

namespace Test.Features.Search
{
    public class SearchQueriesTests : QueriesTestBase
    {
        private readonly SearchQueries _searchQueries;

        public SearchQueriesTests()
        {
            // Create instance of SearchQueries with the mocked QueriesContextWrapper
            _searchQueries = new SearchQueries(QueriesContextWrapperMock.Object);
        }

        [Fact]
        public async void GetModuleOptionsTest()
        {
            var searchParams = new List<SearchParam>
            {
                new SearchParam
                {
                    CategoryId = 2,
                    Keyword = "Retail Worker"
                },
                new SearchParam
                {
                    CategoryId = 3,
                    Keyword = "Friend"
                },
                new SearchParam
                {
                    CategoryId = 4,
                    Keyword = "Fraud"
                }
            };

            var result = await _searchQueries.GetModuleOptions(searchParams: searchParams);
            Assert.NotNull(result); // result: returns minimum of 1 modules
        }
    }
}