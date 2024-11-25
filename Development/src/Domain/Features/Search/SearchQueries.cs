using Domain.Common;
using Domain.Database;
using Microsoft.EntityFrameworkCore;

namespace Domain.Features.Search
{
    public interface ISearchQueries
    {
        Task<List<ModuleOptionDTO>> GetModuleOptions(List<SearchParam> searchParams);
    }

    public class SearchQueries : QueriesBase, ISearchQueries, IGpScoped
    {
        public SearchQueries(IQueriesContextWrapper queriesContextWrapper) : base(queriesContextWrapper)
        {

        }

        #region GetModuleOptions

        public async Task<List<ModuleOptionDTO>> GetModuleOptions(List<SearchParam> searchParams)
        {
            //get all modules
            var modules = await (from m in QueriesContext.Modules
                                 join mst in QueriesContext.ModuleStatusTypes on m.ModuleStatusTypeId equals mst.ModuleStatusTypeId
                                 where mst.ModuleStatusTypeId == (int)ModuleStatusTypeEnum.Published
                                 select new ModuleOptionDTO
                                 {
                                     ModuleId = m.ModuleId,
                                     Name = m.Name,
                                     Contents = m.Contents,
                                 }).ToListAsync();

            //get all keywords for each module
            foreach (var module in modules) module.Keywords = await GetModuleKeywords(module.ModuleId);

            //get the category id for category "Module Position"
            var modulePositionCategoryId = (await QueriesContext.Categories.FirstOrDefaultAsync(c => c.Name == "Module Position"))?.CategoryId;

            //filter modules based on search params and return 2 modules
            var filteredModules = modules.Where(m => searchParams.Any(sp => m.Keywords.Any(k => k.CategoryId == sp.CategoryId && k.Keyword.Contains(sp.Keyword)))
                                                     && m.Keywords.Any(k => k.CategoryId == modulePositionCategoryId && k.Keyword == "Beginning"))
                      .Take(2)
                      .ToList();

            return filteredModules;
        }

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

        #endregion
    }
}
