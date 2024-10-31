namespace Domain.Database
{
    public class QueriesBase
    {
        protected GroupProjectDatabaseContext QueriesContext { get; set; }

        public QueriesBase(IQueriesContextWrapper queriesContextWrapper)
        {
            QueriesContext = queriesContextWrapper.QueriesContext;
        }
    }
}
