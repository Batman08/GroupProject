using Domain.Common;
using Domain.Database;
using Microsoft.EntityFrameworkCore;

namespace Domain.Features.KeywordGenerator
{
    public interface IKeywordGeneratorQueries
    {
        Task<List<KeywordDTO>> GetKeywords();
    }

    public class KeywordGeneratorQueries : QueriesBase, IKeywordGeneratorQueries, IGpScoped
    {
        private readonly ICachingSystem _cachingSystem;

        public KeywordGeneratorQueries(IQueriesContextWrapper queriesContextWrapper, ICachingSystem cachingSystem) : base(queriesContextWrapper)
        {
            _cachingSystem = cachingSystem;
        }

        public async Task<List<KeywordDTO>> GetKeywords()
        {
            var keywordCategories = GetAllKeywordCategories().Result;

            //for each of these categories, get all the keywords for it then randomly select one of them
            var keywords = new List<KeywordDTO>();
            foreach (var category in keywordCategories)
            {
                var categoryKeywords = await (from k in QueriesContext.Keywords
                                              where k.CategoryId == category.CategoryId && category.CategoryName != "Module Position"
                                              select new KeywordDTO
                                              {
                                                  CategoryId = k.CategoryId,
                                                  Keyword = k.Name
                                              }).ToListAsync();

                bool categoryHasKeywords = categoryKeywords.Count > 0;
                if (categoryHasKeywords)
                {
                    var random = new Random();
                    var randomIndex = random.Next(0, categoryKeywords.Count);
                    keywords.Add(categoryKeywords[randomIndex]);
                }
            }

            return keywords;
        }

        private Task<List<CategoryDTO>> GetAllKeywordCategories()
        {
            var keywordCategories = _cachingSystem.GetOrSet(CacheConstants.KeywordCategoriesData, async () =>
            {
                return await (from c in QueriesContext.Categories
                              select new CategoryDTO
                              {
                                  CategoryId = c.CategoryId,
                                  CategoryName = c.Name
                              }).ToListAsync();
            }, TimeSpan.FromMinutes(50));

            return keywordCategories;
        }
    }
}
