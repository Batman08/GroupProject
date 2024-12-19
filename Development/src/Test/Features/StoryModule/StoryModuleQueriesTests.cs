using Domain.Features.Search;
using Domain.Features.StoryModule;
using Test.Database;

namespace Test.Features.StoryModule
{
    public class StoryModuleQueriesTests : QueriesTestBase
    {
        private readonly StoryModuleQueries _storyModuleQueries;

        public StoryModuleQueriesTests()
        {
            // Create instance of StoryModuleQueries with the mocked QueriesContextWrapper
            _storyModuleQueries = new StoryModuleQueries(QueriesContextWrapperMock.Object);
        }

        [Fact]
        public void GetInitalModuleTest()
        {
            var result = _storyModuleQueries.GetInitalModule(moduleId: 1);

            Assert.NotNull(result); // result: returns module
            Assert.True(string.IsNullOrEmpty(result.PassChoiceText) && string.IsNullOrEmpty(result.PassChoiceResult) && string.IsNullOrEmpty(result.FailChoiceText) && string.IsNullOrEmpty(result.FailChoiceResult)); // result: returns module with no option choices
        }

        [Fact]
        public async void GetMiddleModuleTest()
        {
            var keywords = new List<SearchParam>
            {
                new SearchParam { CategoryId = 1, Keyword = "Middle" },
                new SearchParam { CategoryId = 2, Keyword = "Retail Worker" },
                new SearchParam { CategoryId = 3, Keyword = "Friend" },
                new SearchParam { CategoryId = 4, Keyword = "Fraud" }
            };

            var usedModulesParams = new List<string>
            {
                "33", "34", "35", "36", "37", "38",
                "39", "40", "41", "42", "43", "44",
                "45", "46", "47", "48", "49", "50",
                "51", "52", "53", "54", "55", "56",
                "57", "58", "59", "60", "61", "62"
            };

            var result = await _storyModuleQueries.GetMiddleModule(keywords, usedModulesParams);
            Assert.NotNull(result); // result: returns module
            Assert.True(result.ModuleId == 64); // result: returns module with id 64 since other modules are used
            Assert.False(string.IsNullOrEmpty(result.PassChoiceText) && string.IsNullOrEmpty(result.PassChoiceResult) && string.IsNullOrEmpty(result.FailChoiceText) && string.IsNullOrEmpty(result.FailChoiceResult)); // result: returns module with option choices since middle modules require them
        }

        [Fact]
        public async void GetEndModuleTest()
        {
            var keywords = new List<SearchParam>
            {
                new SearchParam { CategoryId = 1, Keyword = "End" },
                new SearchParam { CategoryId = 2, Keyword = "Retail Worker" },
                new SearchParam { CategoryId = 3, Keyword = "Friend" },
                new SearchParam { CategoryId = 4, Keyword = "Fraud" }
            };

            var result = await _storyModuleQueries.GetEndModule(keywords);
            Assert.NotNull(result); // result: returns module
            Assert.True(string.IsNullOrEmpty(result.PassChoiceText) && string.IsNullOrEmpty(result.PassChoiceResult) && string.IsNullOrEmpty(result.FailChoiceText) && string.IsNullOrEmpty(result.FailChoiceResult)); // result: returns module with no option choices
        }
    }
}
