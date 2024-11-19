namespace Domain.Features.Search
{
    public class ModuleOverviewDTO
    {
        public int ModuleId { get; set; }
        public string Name { get; set; } = "";
        public string Overview { get; set; } = "";
        public List<SearchParam> Keywords { get; set; } = new List<SearchParam>();
    }

    public class SearchParam
    {
        public int CategoryId { get; set; }
        public string Keyword { get; set; } = "";
    }
}
