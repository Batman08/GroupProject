using Domain.Features.StoryModuleSubmission;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Web.Pages
{
    public class StoryModuleSubmissionModel : PageModel
    {
        public List<KeywordItemDTO> ModulePositionKeywords { get; set; } = new List<KeywordItemDTO>();
        public List<KeywordItemDTO> MainKeywords { get; set; } = new List<KeywordItemDTO>();

        private readonly IStoryModuleSubmissionQueries _storyModuleSubmissionQueries;

        public StoryModuleSubmissionModel(IStoryModuleSubmissionQueries storyModuleSubmissionQueries)
        {
            _storyModuleSubmissionQueries = storyModuleSubmissionQueries;
        }

        public async void OnGet()
        {
            ModulePositionKeywords = await _storyModuleSubmissionQueries.GetModulePositionKeywords();
            MainKeywords = await _storyModuleSubmissionQueries.GetMainKeywords();
        }
    }
}
