using Domain.Features.Search;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Text.Json;

namespace Web.Pages
{
    public class SearchModel : PageModel
    {
        private readonly ISearchQueries _searchQueries;

        public SearchModel(ISearchQueries searchQueries)
        {
            _searchQueries = searchQueries;
        }

        public void OnGet()
        {
        }

        public JsonResult OnGetModuleOptions([FromQuery] List<SearchParam> searchParams)
        {
            var result = _searchQueries.GetModuleOptions(searchParams);
            return new JsonResult(new { ModuleOptions = result }, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
    }
}
