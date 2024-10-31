using Domain.Common;
using Domain.Database;

namespace Domain.Features.Search
{
    public interface ISearchQueries
    {

    }

    public class SearchQueries : QueriesBase, ISearchQueries, IGpScoped
    {
        public SearchQueries(IQueriesContextWrapper queriesContextWrapper) : base(queriesContextWrapper)
        {

        }


    }
}
