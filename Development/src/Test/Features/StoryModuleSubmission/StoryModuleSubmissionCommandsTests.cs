using Domain.Features.StoryModuleSubmission;
using Test.Database;

namespace Test.Features.StoryModuleSubmission
{
    public class StoryModuleSubmissionCommandsTests : CommandsTestBase
    {
        private readonly StoryModuleSubmissionCommands _storyModuleSubmissionCommands;

        public StoryModuleSubmissionCommandsTests()
        {
            // Create instance of StoryModuleSubmissionCommands with the mocked CommandsContextWrapper
            _storyModuleSubmissionCommands = new StoryModuleSubmissionCommands(CommandsContextWrapperMock.Object);
        }

        [Fact]
        public async void CreateModuleTest()
        {
            var moduleData = new CreateModuleDTO
            {
                Content = "This is a test module",
                Author = "TestDB",
                ModuleStatusTypeId = 2,
                Keywords = new List<int> { 4, 7, 13 },
                ModulePosition = "1"
            };
            var result = await _storyModuleSubmissionCommands.CreateModule(moduleData);

            Assert.True(result.Item1.Success); //result: returns success result and creates module
            Assert.NotEqual(0, result.Item2); //result: returns new valid module id
        }

        [Fact]
        public async void UpdateModuleTest()
        {
            var moduleCreateData = new CreateModuleDTO
            {
                Content = "This is a test module",
                Author = "TestDB",
                ModuleStatusTypeId = 2,
                Keywords = new List<int> { 4, 7, 13 },
                ModulePosition = "1"
            };
            await _storyModuleSubmissionCommands.CreateModule(moduleCreateData);

            var moduleUpdateData = new UpdateModuleDTO
            {
                ModuleId = 1,
                Content = "Updated test module",
                Author = "TestDB",
                ModuleStatusTypeId = 2,
                Keywords = new List<int> { 4, 9, 13 },
                ModulePosition = "2"
            };
            var result = await _storyModuleSubmissionCommands.UpdateModule(moduleUpdateData);

            Assert.True(result.Success); //result: returns success result and updates module
        }

        [Fact]
        public async void DeleteModuleTest()
        {
            /* test case 1 - test for successful module deletion */

            var moduleCreateData = new CreateModuleDTO
            {
                Content = "This is a test module",
                Author = "TestDB",
                ModuleStatusTypeId = 2,
                Keywords = new List<int> { 4, 7, 13 },
                ModulePosition = "1"
            };
            await _storyModuleSubmissionCommands.CreateModule(moduleCreateData);

            var moduleDeleteData = new DeleteModuleDTO
            {
                ModuleId = 1,
                Author = "TestDB"
            };
            var result = await _storyModuleSubmissionCommands.DeleteModule(moduleDeleteData);

            Assert.True(result.Success); //result: returns success result and deletes module


            /* test case 1 - test for failed module deletion */

            moduleDeleteData = new DeleteModuleDTO
            {
                ModuleId = 5,
                Author = "TestDB"
            };
            result = await _storyModuleSubmissionCommands.DeleteModule(moduleDeleteData);

            Assert.True(result.Error); //result: returns error validation result for failed module deletion
            Assert.NotEmpty(result.Message); //result: returns error message for failed module deletion
        }
    }
}
