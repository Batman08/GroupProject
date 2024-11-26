namespace Domain.Features.StoryModule
{
    public class ModuleDTO
    {
        public int ModuleId { get; set; }
        public string Contents { get; set; } = "";
        public string PassChoiceText { get; set; } = "";
        public string PassChoiceResult { get; set; } = "";
        public string FailChoiceText { get; set; } = "";
        public string FailChoiceResult { get; set; } = "";
    }
}
