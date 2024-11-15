namespace Domain.Features.Search
{
    public class ModuleOverviewDTO
    {
        public int ModuleId { get; set; }
        public string Name { get; set; } = "";
        public string Overview { get; set; } = "";
        public List<string> Keywords { get; set; } = new List<string>();
    }
}
