using Domain.Common;
using Domain.Features.KeywordGenerator;
using Moq;
using Test.Database;

namespace Test.KeywordGenerator
{
    public class KeywordGeneratorQueriesTests : QueriesTestBase
    {
        private readonly Mock<ICachingSystem> _cachingSystemMock;

        private readonly KeywordGeneratorQueries _keywordGeneratorQueries;

        public KeywordGeneratorQueriesTests()
        {
            // Mocking CachingSystem
            _cachingSystemMock = new Mock<ICachingSystem>();

            // Create instance of KeywordGeneratorQueries with the mocked QueriesContextWrapper
            _keywordGeneratorQueries = new KeywordGeneratorQueries(QueriesContextWrapperMock.Object, _cachingSystemMock.Object);
        }


        [Fact]
        public async void GetKeywordsTest()
        {

            _cachingSystemMock.Setup(cs => cs.GetOrSet(CacheConstants.KeywordCategoriesData,
                                           It.IsAny<Func<Task<List<CategoryDTO>>>>(),
                                           TimeSpan.FromMinutes(50)))
                                           .Returns((string key, Func<Task<List<CategoryDTO>>> callback, TimeSpan duration) => callback());


            var result = await _keywordGeneratorQueries.GetKeywords();
            Assert.True(result.Count == 3); // result: returns 3 keywords
        }
    }
}