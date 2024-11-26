namespace Domain.Features.Search
{
    public class ModuleOptionDTO
    {
        public int ModuleId { get; set; }
        public string Contents { get; set; } = "";
        public List<SearchParam> Keywords { get; set; } = new List<SearchParam>();
    }

    public class SearchParam
    {
        public int CategoryId { get; set; }
        public string Keyword { get; set; } = "";
    }
}
