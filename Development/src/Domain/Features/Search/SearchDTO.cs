namespace Domain.Features.Search
{
    public class ModuleDTO
    {
        public int ModuleId { get; set; }
        public string Name { get; set; } = "";
        public string Contents { get; set; } = "";
        public List<string> Keywords { get; set; } = new List<string>();
    }
}
