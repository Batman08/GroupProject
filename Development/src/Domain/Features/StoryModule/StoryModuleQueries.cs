using Domain.Common;
using Domain.Database;
using Microsoft.EntityFrameworkCore;

namespace Domain.Features.StoryModule
{
    public interface IStoryModuleQueries
    {
        ModuleDTO? GetInitalModule(int moduleId);
        Task<ModuleDTO> GetMiddleModule(List<string> usedModulesParam);
    }

    public class StoryModuleQueries : QueriesBase, IStoryModuleQueries, IGpScoped
    {
        public StoryModuleQueries(IQueriesContextWrapper queriesContextWrapper) : base(queriesContextWrapper)
        {

        }

        public ModuleDTO? GetInitalModule(int moduleId)
        {
            var module = (from m in QueriesContext.Modules
                          join mst in QueriesContext.ModuleStatusTypes on m.ModuleStatusTypeId equals mst.ModuleStatusTypeId
                          join m2k in QueriesContext.Modules2Keywords on m.ModuleId equals m2k.ModuleId
                          join k in QueriesContext.Keywords on m2k.KeywordId equals k.KeywordId
                          join c in QueriesContext.Categories on k.CategoryId equals c.CategoryId
                          where m.ModuleId == moduleId && mst.ModuleStatusTypeId == (int)ModuleStatusTypeEnum.Published
                             && mst.ModuleStatusTypeId == (int)ModuleStatusTypeEnum.Published
                             && c.Name == "Module Position"
                             && k.Name == "Beginning"
                          select new ModuleDTO
                          {
                              ModuleId = m.ModuleId,
                              Contents = m.Contents
                          }).FirstOrDefault();

            return module;
        }

        public async Task<ModuleDTO> GetMiddleModule(List<string> usedModulesParam)
        {
            // Convert used modules to list of int
            var parsedUsedModuleIds = usedModulesParam.Select(int.Parse).ToList();

            // Get all modules that have not been used yet, the module status is published, and has a category of "Module Position" with the keyword "Middle"
            var availableModules = await (from m in QueriesContext.Modules
                                          join mst in QueriesContext.ModuleStatusTypes on m.ModuleStatusTypeId equals mst.ModuleStatusTypeId
                                          join m2k in QueriesContext.Modules2Keywords on m.ModuleId equals m2k.ModuleId
                                          join k in QueriesContext.Keywords on m2k.KeywordId equals k.KeywordId
                                          join c in QueriesContext.Categories on k.CategoryId equals c.CategoryId
                                          where !parsedUsedModuleIds.Contains(m.ModuleId) && mst.ModuleStatusTypeId == (int)ModuleStatusTypeEnum.Published
                                             && c.Name == "Module Position"
                                             && k.Name == "Middle"
                                          select new ModuleDTO
                                          {
                                              ModuleId = m.ModuleId,
                                              Contents = m.Contents,
                                              PassChoiceText = m.PassChoiceText,
                                              PassChoiceResult = m.PassChoiceResult,
                                              FailChoiceText = m.FailChoiceText,
                                              FailChoiceResult = m.FailChoiceResult
                                          }).ToListAsync();

            // Select a random module from the available modules
            var random = new Random();
            var randomModule = availableModules.OrderBy(x => random.Next(0, availableModules.Count)).FirstOrDefault();

            return randomModule!;
        }
    }
}
