using Domain.Common;
using Domain.Database;
using Newtonsoft.Json;

namespace Domain.Features.Search
{
    public interface ISearchQueries
    {
        List<ModuleOverviewDTO> GetModuleOptions(List<string> keywords);
    }

    public class SearchQueries : QueriesBase, ISearchQueries, IGpScoped
    {
        public SearchQueries(IQueriesContextWrapper queriesContextWrapper) : base(queriesContextWrapper)
        {

        }

        public List<ModuleOverviewDTO> GetModuleOptions(List<string> keywords)
        {
            var modules = (from m in QueriesContext.Modules
                           join mst in QueriesContext.ModuleStatusTypes on m.ModuleStatusTypeId equals mst.ModuleStatusTypeId
                           where mst.ModuleStatusTypeId == (int)ModuleStatusTypeEnum.Published
                           select new ModuleOverviewDTO
                           {
                               ModuleId = m.ModuleId,
                               Name = m.Name,
                               Overview = m.Overview,
                               Keywords = JsonConvert.DeserializeObject<List<string>>(m.Keywords)!,
                           }).Take(2).ToList();

            var matchingModules = modules.Where(module => keywords.All(module.Keywords.Contains)).ToList();
            return matchingModules;
        }
    }
}
