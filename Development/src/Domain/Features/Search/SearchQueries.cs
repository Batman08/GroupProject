using Domain.Common;
using Domain.Database;
using Newtonsoft.Json;

namespace Domain.Features.Search
{
    public interface ISearchQueries
    {
        List<ModuleDTO> GetModuleOptions(List<string> moduleKeywords);
    }

    public class SearchQueries : QueriesBase, ISearchQueries, IGpScoped
    {
        public SearchQueries(IQueriesContextWrapper queriesContextWrapper) : base(queriesContextWrapper)
        {

        }

        public List<ModuleDTO> GetModuleOptions(List<string> keywords)
        {
            var modules = (from m in QueriesContext.Modules
                           join mst in QueriesContext.ModuleStatusTypes on m.ModuleStatusTypeId equals mst.ModuleStatusTypeId
                           where mst.Name == "Draft"
                           select new ModuleDTO
                           {
                               ModuleId = m.ModuleId,
                               Name = m.Name,
                               Contents = m.Contents,
                               Keywords = m.Keywords,
                           }).ToList();

            //ModuleDTO? firstMatchingModule = null;
            //foreach (var module in modules)
            //{
            //    List<string> parsedKeywords = JsonConvert.DeserializeObject<List<string>>(module.Keywords)!;
            //    if (keywords.All(parsedKeywords.Contains))
            //    {
            //        firstMatchingModule = module;
            //        break;
            //    }
            //}

            var matchingModules = modules.Where(module =>
            {
                // Parse JSON string into a list of strings
                var parsedKeywords = JsonConvert.DeserializeObject<List<string>>(module.Keywords)!;

                // Check if any keyword in moduleKeywords matches searchKeywords
                //return parsedKeywords.Any(keyword => keywords.Contains(keyword));
                return keywords.All(parsedKeywords.Contains);
            }).ToList();

            return matchingModules;
        }
    }
}
