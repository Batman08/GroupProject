namespace Domain.Features.StoryModuleSubmission
{
    public class AuthorsModuleDTO
    {
        public int ModuleId { get; set; }
        public string ModulePosition { get; set; } = "";
        public string ModuleContent { get; set; } = "";
    }

    public class AuthorsFullModuleDTO
    {
        public int ModuleId { get; set; }
        public string Content { get; set; } = "";
        public string PassChoiceText { get; set; } = "";
        public string PassChoiceResult { get; set; } = "";
        public string FailChoiceText { get; set; } = "";
        public string FailChoiceResult { get; set; } = "";
        public string ModuleStatusType { get; set; } = "";
        public KeywordItemDTO ModulePosition { get; set; } = new KeywordItemDTO();
        public List<KeywordItemDTO> KeywordItems { get; set; } = new List<KeywordItemDTO>();
    }

    public class KeywordItemDTO
    {
        public int KeywordId { get; set; }
        public string Name { get; set; } = "";
    }

    public class EditModuleModalInitialDataModel
    {
        public List<KeywordItemDTO> ModulePositionKeywords { get; set; } = new List<KeywordItemDTO>();
        public List<KeywordItemDTO> MainKeywords { get; set; } = new List<KeywordItemDTO>();
    }

    public class CreateModuleDTO
    {
        public string Content { get; set; } = "";
        public string? PassChoiceText { get; set; }
        public string? PassChoiceResult { get; set; }
        public string? FailChoiceText { get; set; }
        public string? FailChoiceResult { get; set; }
        public string Author { get; set; } = "";
        public int ModuleStatusTypeId { get; set; }
        public List<int> Keywords { get; set; } = new List<int>();
        public string ModulePosition { get; set; } = "";
    }

    public class UpdateModuleDTO
    {
        public int ModuleId { get; set; }
        public string Content { get; set; } = "";
        public string? PassChoiceText { get; set; }
        public string? PassChoiceResult { get; set; }
        public string? FailChoiceText { get; set; }
        public string? FailChoiceResult { get; set; }
        public string Author { get; set; } = "";
        public int ModuleStatusTypeId { get; set; }
        public List<int> Keywords { get; set; } = new List<int>();
        public string ModulePosition { get; set; } = "";
    }
}
