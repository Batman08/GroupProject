using Domain.Common;
using Domain.Database;

namespace Domain.Features.StoryModule
{
    public interface IStoryModuleQueries
    {
        public ModuleDTO? GetInitalModule(int moduleId);
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
                          where m.ModuleId == moduleId && mst.ModuleStatusTypeId == (int)ModuleStatusTypeEnum.Published
                          select new ModuleDTO
                          {
                              ModuleId = m.ModuleId,
                              Name = m.Name,
                              Contents = m.Contents
                          }).FirstOrDefault();

            return module;
        }
    }
}
