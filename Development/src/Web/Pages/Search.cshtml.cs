using Domain.Features.Search;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Web.Code.Controllers;

namespace Web.Pages
{
    public class SearchModel : BaseController
    {
        private readonly ISearchQueries _searchQueries;

        public SearchModel(ISearchQueries searchQueries)
        {
            _searchQueries = searchQueries;
        }

        public void OnGet()
        {
        }

        public async Task<JsonResult> OnGetModuleOptions([FromQuery] List<SearchParam> searchParams)
        {
            var result = await _searchQueries.GetModuleOptions(searchParams);
            return new JsonResult(new { ModuleOptions = result }, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
    }
}
