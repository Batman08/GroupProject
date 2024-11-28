using Domain.Common;
using Domain.Database;

namespace Domain.Features.StoryModuleSubmission
{
    public interface IStoryModuleSubmissionCommands
    {
        Task<(Result, int)> CreateModule(CreateModuleDTO createModuleData);
    }

    public class StoryModuleSubmissionCommands : CommandsBase, IStoryModuleSubmissionCommands, IGpScoped
    {
        public StoryModuleSubmissionCommands(ICommandsContextWrapper commandsContextWrapper) : base(commandsContextWrapper)
        {
        }

        public async Task<(Result, int)> CreateModule(CreateModuleDTO createModuleData)
        {
            var module = new Module
            {
                Author = createModuleData.Author,
                ModuleStatusTypeId = createModuleData.ModuleStatusTypeId,
                Contents = createModuleData.Content,
                PassChoiceText = createModuleData.PassChoiceText,
                PassChoiceResult = createModuleData.PassChoiceResult,
                FailChoiceText = createModuleData.FailChoiceText,
                FailChoiceResult = createModuleData.FailChoiceResult
            };

            await CommandsContext.Modules.AddAsync(module);
            await CommandsContext.SaveChangesAsync();

            var newModuleId = module.ModuleId;
            if (newModuleId == 0)
            {
                return (Result.Bad("Failed to create story module."), 0);
            }

            foreach (var keywordId in createModuleData.Keywords)
            {
                var module2Keyword = new Modules2Keywords
                {
                    ModuleId = newModuleId,
                    KeywordId = keywordId
                };
                await CommandsContext.Modules2Keywords.AddAsync(module2Keyword);
            }

            await CommandsContext.SaveChangesAsync();


            return (Result.Good(), newModuleId);
        }
    }
}
