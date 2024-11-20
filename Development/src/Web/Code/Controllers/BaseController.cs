using Domain.Features.KeywordGenerator;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Text.Json;

namespace Web.Code.Controllers
{
    public class BaseController : PageModel
    {
        public BaseController()
        {
        }

        public JsonResult OnGetGenerateKeywords()
        {
            var keywordGeneratorQueriesService = HttpContext.RequestServices.GetService<IKeywordGeneratorQueries>()!;
            var keywordsData = keywordGeneratorQueriesService.GetKeywords();
            return new JsonResult(new { KeywordsData = keywordsData }, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
    }
}
