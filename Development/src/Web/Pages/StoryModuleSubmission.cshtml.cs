using Domain.Common;
using Domain.Features.StoryModuleSubmission;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Text.Json;

namespace Web.Pages
{
    public class StoryModuleSubmissionModel : PageModel
    {
        public List<KeywordItemDTO> ModulePositionKeywords { get; set; } = new List<KeywordItemDTO>();
        public List<KeywordItemDTO> MainKeywords { get; set; } = new List<KeywordItemDTO>();
        public EditModuleModalInitialDataModel EditModuleModalInitialDataModel { get; set; } = new EditModuleModalInitialDataModel();

        private readonly IStoryModuleSubmissionCommands _storyModuleSubmissionCommands;
        private readonly IStoryModuleSubmissionQueries _storyModuleSubmissionQueries;

        public StoryModuleSubmissionModel(IStoryModuleSubmissionCommands storyModuleSubmissionCommands,
                                          IStoryModuleSubmissionQueries storyModuleSubmissionQueries)
        {
            _storyModuleSubmissionCommands = storyModuleSubmissionCommands;
            _storyModuleSubmissionQueries = storyModuleSubmissionQueries;
        }

        public async Task OnGet()
        {
            ModulePositionKeywords = await _storyModuleSubmissionQueries.GetModulePositionKeywords();
            MainKeywords = await _storyModuleSubmissionQueries.GetMainKeywords();

            EditModuleModalInitialDataModel.ModulePositionKeywords = ModulePositionKeywords;
            EditModuleModalInitialDataModel.MainKeywords = MainKeywords;
        }

        public async Task<JsonResult> OnGetAuthorsModules([FromQuery] string author)
        {
            var result = await _storyModuleSubmissionQueries.GetAllModulesForSpecificAuthor(author);
            return new JsonResult(new { AuthorsModules = result }, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        public async Task<JsonResult> OnGetEditModalModuleData([FromQuery] int moduleId)
        {
            var result = await _storyModuleSubmissionQueries.GetEditModuleData(moduleId);
            return new JsonResult(result, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        public async Task<JsonResult> OnPostCreateModule([FromBody] CreateModuleDTO createModuleData)
        {
            var result = await _storyModuleSubmissionCommands.CreateModule(createModuleData);
            var returnData = new AuthorsModuleDTO
            {
                ModuleId = result.Item2,
                ModulePosition = createModuleData.ModulePosition,
                ModuleContent = createModuleData.Content
            };

            ResponseDTO<AuthorsModuleDTO> responseData = null!;
            if (result.Item1.Success)
                responseData = GpResponse.Success(returnData, result.Item1.Message);
            else
                responseData = GpResponse.Error<AuthorsModuleDTO>(result.Item1.Message);

            return new JsonResult(responseData, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        public async Task<JsonResult> OnPostUpdateModuleData([FromBody] UpdateModuleDTO updateModuleData)
        {
            var result = await _storyModuleSubmissionCommands.UpdateModule(updateModuleData);
            var returnData = new AuthorsModuleDTO
            {
                ModuleId = updateModuleData.ModuleId,
                ModulePosition = updateModuleData.ModulePosition,
                ModuleContent = updateModuleData.Content
            };

            ResponseDTO<AuthorsModuleDTO> responseData = null!;
            if (result.Success)
                responseData = GpResponse.Success(returnData, result.Message);
            else
                responseData = GpResponse.Error<AuthorsModuleDTO>(result.Message);


            return new JsonResult(responseData, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        public async Task<JsonResult> OnPostDeleteModuleData([FromBody] DeleteModuleDTO deleteModuleData)
        {
            var result = await _storyModuleSubmissionCommands.DeleteModule(deleteModuleData);

            ResponseDTO<DeleteModuleDTO> responseData = null!;
            if (result.Success)
                responseData = GpResponse.Success(deleteModuleData, result.Message);
            else
                responseData = GpResponse.Error<DeleteModuleDTO>(result.Message);


            return new JsonResult(responseData, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
    }
}
