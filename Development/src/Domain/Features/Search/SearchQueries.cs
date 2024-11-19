using Domain.Common;
using Domain.Database;

namespace Domain.Features.Search
{
    public interface ISearchQueries
    {
        List<ModuleOverviewDTO> GetModuleOptions(List<SearchParam> searchParams);
    }

    public class SearchQueries : QueriesBase, ISearchQueries, IGpScoped
    {
        public SearchQueries(IQueriesContextWrapper queriesContextWrapper) : base(queriesContextWrapper)
        {

        }

        #region GetModuleOptions

        public List<ModuleOverviewDTO> GetModuleOptions(List<SearchParam> searchParams)
        {
            //get all modules
            var modules = (from m in QueriesContext.Modules
                           join mst in QueriesContext.ModuleStatusTypes on m.ModuleStatusTypeId equals mst.ModuleStatusTypeId
                           where mst.ModuleStatusTypeId == (int)ModuleStatusTypeEnum.Published
                           select new ModuleOverviewDTO
                           {
                               ModuleId = m.ModuleId,
                               Name = m.Name,
                               Overview = m.Overview,
                           }).ToList();

            //get all keywords for each module
            foreach (var module in modules) module.Keywords = GetModuleKeywords(module.ModuleId);

            //filter modules based on search params and return 2 modules
            var filteredModules = modules.Where(m => searchParams.Any(sp => m.Keywords.Any(k => k.CategoryId == sp.CategoryId && k.Keyword.Contains(sp.Keyword))))
                      .Take(2)
                      .ToList();

            return filteredModules;
        }

        private List<SearchParam> GetModuleKeywords(int moduleId)
        {
            return (from m2k in QueriesContext.Modules2Keywords
                    join m in QueriesContext.Modules on m2k.ModuleId equals m.ModuleId
                    join k in QueriesContext.Keywords on m2k.KeywordId equals k.KeywordId
                    join c in QueriesContext.Categories on k.CategoryId equals c.CategoryId
                    where m.ModuleId == moduleId
                    select new SearchParam
                    {
                        CategoryId = c.CategoryId,
                        Keyword = k.Name
                    }).ToList();
        }

        #endregion
    }
}
