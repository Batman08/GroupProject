namespace Domain.Features.StoryModuleSubmission
{
    public class FullModuleDTO
    {
        public int ModuleId { get; set; }
        public string Contents { get; set; } = "";
        public string PassChoiceText { get; set; } = "";
        public string PassChoiceResult { get; set; } = "";
        public string FailChoiceText { get; set; } = "";
        public string FailChoiceResult { get; set; } = "";
        public string Author { get; set; } = "";
        public string ModuleStatusType { get; set; } = "";
    }

    public class KeywordItemDTO
    {
        public int KeywordId { get; set; }
        public string Name { get; set; } = "";
    }
}
