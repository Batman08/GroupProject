using Domain.Common;
using Domain.Features.StoryModuleSubmission;
using System.Text.RegularExpressions;
using Test.Database;

namespace Test.Features.StoryModuleSubmission
{
    public class StoryModuleSubmissionQueriesTests : QueriesTestBase
    {
        private readonly StoryModuleSubmissionQueries _storyModuleSubmissionQueries;

        public StoryModuleSubmissionQueriesTests()
        {
            // Create instance of StoryModuleSubmissionQueries with the mocked QueriesContextWrapper
            _storyModuleSubmissionQueries = new StoryModuleSubmissionQueries(QueriesContextWrapperMock.Object);
        }

        [Fact]
        public async void GetModulePositionKeywordsTest()
        {
            var result = await _storyModuleSubmissionQueries.GetModulePositionKeywords();

            Assert.NotNull(result); // result: returns keywords

            // result: returns "Beginning", "Middle", "End" keywords
            Assert.Equal("Beginning", result[0].Name);
            Assert.Equal("Middle", result[1].Name);
            Assert.Equal("End", result[2].Name);
        }

        [Fact]
        public async void GetMainKeywordsTest()
        {
            var result = await _storyModuleSubmissionQueries.GetMainKeywords();
            Assert.NotNull(result); // result: returns keywords

            // result: returns keywords exluding "Beginning", "Middle", "End"
            Assert.DoesNotContain(result, x => x.Name == "Beginning");
            Assert.DoesNotContain(result, x => x.Name == "Middle");
            Assert.DoesNotContain(result, x => x.Name == "End");
        }

        [Fact]
        public async void GetAllModulesForSpecificAuthorTest()
        {
            var result = await _storyModuleSubmissionQueries.GetAllModulesForSpecificAuthor(authorParam: "12997639-ca49-pre-generated-modules-45bf-873e-13da36548903");
            var result2 = await _storyModuleSubmissionQueries.GetAllModulesForSpecificAuthor(authorParam: "");
            Assert.True(result.Count > 0); // result: returns default modules
            Assert.True(result2.Count == 0); // result: returns no modules
        }

        [Fact]
        public async void GetEditModuleDataTest()
        {
            var result = await _storyModuleSubmissionQueries.GetEditModuleData(moduleId: 43);
            var resultContentTrimmed = Regex.Replace(result!.Content.Trim(), @"\s+", string.Empty);
            var expectedContentTrimmed = Regex.Replace(("This perplexing case, seems like something you can quickly resolve. People are engaging in relations, the boss of the bank knows about it, so one member must be an employee.  The other participant could be… literally anyone else who uses this bank…  Okay, this crime may be a little harder to get a handle on.  You may have to look at this a little more big picture.").Trim(), @"\s+", string.Empty);

            Assert.NotNull(result); // result: returns module data
            Assert.True(result.ModuleId == 43); // result: returns module with id 43
            Assert.True(resultContentTrimmed == expectedContentTrimmed); // result: returns module with correct contents
            Assert.True(result.ModuleStatusType == ModuleStatusTypeEnum.Published.ToString()); // result: returns module with correct status
        }
    }
}
