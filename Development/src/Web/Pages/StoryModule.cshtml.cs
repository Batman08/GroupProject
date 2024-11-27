using Domain.Common;
using Domain.Features.Search;
using Domain.Features.StoryModule;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Text.Json;

namespace Web.Pages
{
    public class StoryModuleModel : PageModel
    {
        public ModuleDTO InitialModule { get; set; } = new ModuleDTO();

        private readonly IStoryModuleQueries _storyModuleQueries;

        public StoryModuleModel(IStoryModuleQueries storyModuleQueries)
        {
            _storyModuleQueries = storyModuleQueries;
        }

        public IActionResult OnGet(string selected)
        {
            var moduleId = ExtractModuleId(selected);
            if (moduleId == null) return RedirectToPage(UrlConstants.SearchPageUrl);

            InitialModule = _storyModuleQueries.GetInitalModule(moduleId.Value)!;
            if (InitialModule == null) return RedirectToPage(UrlConstants.SearchPageUrl, new { error = "Story not found" });

            return Page();
        }

        public async Task<JsonResult> OnGetMiddleModule([FromQuery] List<string> usedModulesParam)
        {
            var result = await _storyModuleQueries.GetMiddleModule(usedModulesParam);
            return new JsonResult(new { MiddleModule = result }, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        public async Task<JsonResult> OnGetEndModule([FromQuery] List<SearchParam> searchParams)
        {
            var result = await _storyModuleQueries.GetEndModule(searchParams);
            return new JsonResult(new { EndModule = result }, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }


        private int? ExtractModuleId(string selectedModuleIdStr)
        {
            if (int.TryParse(selectedModuleIdStr, out int moduleId))
            {
                return moduleId;
            }
            else
            {
                return null;
            }
        }
    }
}
