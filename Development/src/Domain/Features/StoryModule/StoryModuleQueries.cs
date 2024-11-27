using Domain.Common;
using Domain.Database;
using Domain.Features.Search;
using Microsoft.EntityFrameworkCore;

namespace Domain.Features.StoryModule
{
    public interface IStoryModuleQueries
    {
        ModuleDTO? GetInitalModule(int moduleId);
        Task<ModuleDTO> GetMiddleModule(List<string> usedModulesParam);
        Task<ModuleDTO> GetEndModule(List<SearchParam> keywords);
    }

    public class StoryModuleQueries : QueriesBase, IStoryModuleQueries, IGpScoped
    {
        public StoryModuleQueries(IQueriesContextWrapper queriesContextWrapper) : base(queriesContextWrapper)
        {

        }

        #region Initial Module

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

        #endregion


        #region Middle Module
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

        #endregion


        #region End Module

        public async Task<ModuleDTO> GetEndModule(List<SearchParam> keywords)
        {
            var availableModules = await (from m in QueriesContext.Modules
                                          join mst in QueriesContext.ModuleStatusTypes on m.ModuleStatusTypeId equals mst.ModuleStatusTypeId
                                          join m2k in QueriesContext.Modules2Keywords on m.ModuleId equals m2k.ModuleId
                                          join k in QueriesContext.Keywords on m2k.KeywordId equals k.KeywordId
                                          join c in QueriesContext.Categories on k.CategoryId equals c.CategoryId
                                          where mst.ModuleStatusTypeId == (int)ModuleStatusTypeEnum.Published
                                             && c.Name == "Module Position"
                                             && k.Name == "End"
                                          select new ModuleDTO
                                          {
                                              ModuleId = m.ModuleId,
                                              Contents = m.Contents,
                                              PassChoiceText = m.PassChoiceText,
                                              PassChoiceResult = m.PassChoiceResult,
                                              FailChoiceText = m.FailChoiceText,
                                              FailChoiceResult = m.FailChoiceResult
                                          }).ToListAsync();

            //get all keywords for each module
            foreach (var module in availableModules) module.Keywords = await GetModuleKeywords(module.ModuleId);

            //get the category id for category "Module Position"
            var modulePositionCategoryId = (await QueriesContext.Categories.FirstOrDefaultAsync(c => c.Name == "Module Position"))?.CategoryId;

            //filter modules based on search params and return 2 modules
            var filteredModules = availableModules.Where(m => keywords.Any(sp => m.Keywords.Any(k => k.CategoryId == sp.CategoryId && k.Keyword.Contains(sp.Keyword)))
                                                     && m.Keywords.Any(k => k.CategoryId == modulePositionCategoryId && k.Keyword == "End"))
                      .ToList();

            // Select a random module from the available modules
            var random = new Random();
            var randomModule = filteredModules.OrderBy(x => random.Next(0, filteredModules.Count)).FirstOrDefault();

            return randomModule!;
        }

        #endregion

        private async Task<List<SearchParam>> GetModuleKeywords(int moduleId)
        {
            return await (from m2k in QueriesContext.Modules2Keywords
                          join m in QueriesContext.Modules on m2k.ModuleId equals m.ModuleId
                          join k in QueriesContext.Keywords on m2k.KeywordId equals k.KeywordId
                          join c in QueriesContext.Categories on k.CategoryId equals c.CategoryId
                          where m.ModuleId == moduleId
                          select new SearchParam
                          {
                              CategoryId = c.CategoryId,
                              Keyword = k.Name
                          }).ToListAsync();
        }
    }
}
