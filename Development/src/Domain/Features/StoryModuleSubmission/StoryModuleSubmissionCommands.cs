using Domain.Common;
using Domain.Database;

namespace Domain.Features.StoryModuleSubmission
{
    public interface IStoryModuleSubmissionCommands
    {
        Task<(Result, int)> CreateModule(CreateModuleDTO createModuleData);
        Task<Result> UpdateModule(UpdateModuleDTO updateModuleData);
        Task<Result> DeleteModule(DeleteModuleDTO deleteModuleData);
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

        public async Task<Result> UpdateModule(UpdateModuleDTO updateModuleData)
        {
            /* update module */

            var module = CommandsContext.Modules.FirstOrDefault(x => x.ModuleId == updateModuleData.ModuleId);
            if (module == null || module.Author != updateModuleData.Author)
            {
                return Result.Bad("Something went wrong. Module not found. Please try again.");
            }

            module.Contents = updateModuleData.Content;
            module.PassChoiceText = updateModuleData.PassChoiceText;
            module.PassChoiceResult = updateModuleData.PassChoiceResult;
            module.FailChoiceText = updateModuleData.FailChoiceText;
            module.FailChoiceResult = updateModuleData.FailChoiceResult;
            module.ModuleStatusTypeId = updateModuleData.ModuleStatusTypeId;

            CommandsContext.Modules.Update(module);


            /* remove all keywords for module */

            var module2Keywords = CommandsContext.Modules2Keywords.Where(x => x.ModuleId == updateModuleData.ModuleId);
            CommandsContext.Modules2Keywords.RemoveRange(module2Keywords);


            /* add new keyword for module */

            foreach (var keywordId in updateModuleData.Keywords)
            {
                var module2Keyword = new Modules2Keywords
                {
                    ModuleId = updateModuleData.ModuleId,
                    KeywordId = keywordId
                };
                await CommandsContext.Modules2Keywords.AddAsync(module2Keyword);
            }

            await CommandsContext.SaveChangesAsync();

            return Result.Good();
        }

        public async Task<Result> DeleteModule(DeleteModuleDTO deleteModuleData)
        {
            /* find module */

            var module = CommandsContext.Modules.FirstOrDefault(x => x.ModuleId == deleteModuleData.ModuleId);
            if (module == null || module.Author != deleteModuleData.Author)
            {
                return Result.Bad("Something went wrong. Module not found. Please try again.");
            }


            /* remove all keywords for module */

            var module2Keywords = CommandsContext.Modules2Keywords.Where(x => x.ModuleId == deleteModuleData.ModuleId);
            CommandsContext.Modules2Keywords.RemoveRange(module2Keywords);

            /* remove module */

            CommandsContext.Modules.Remove(module);

            await CommandsContext.SaveChangesAsync();

            return Result.Good();
        }
    }
}
