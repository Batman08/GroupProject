﻿using Domain.Common;
using Domain.Database;
using Domain.Features.Search;
using Microsoft.EntityFrameworkCore;

namespace Domain.Features.StoryModuleSubmission
{
    public interface IStoryModuleSubmissionQueries
    {
        Task<List<KeywordItemDTO>> GetModulePositionKeywords();
        Task<List<KeywordItemDTO>> GetMainKeywords();
        Task<List<FullModuleDTO>> GetAllModulesForSpecificAuthor(string authorParam);
    }

    public class StoryModuleSubmissionQueries : QueriesBase, IStoryModuleSubmissionQueries, IGpScoped
    {
        public StoryModuleSubmissionQueries(IQueriesContextWrapper queriesContextWrapper) : base(queriesContextWrapper)
        {

        }

        public async Task<List<KeywordItemDTO>> GetModulePositionKeywords()
        {
            //get Module Position keywords only
            var keywords = await (from k in QueriesContext.Keywords
                                  join c in QueriesContext.Categories on k.CategoryId equals c.CategoryId
                                  where c.Name == "Module Position"
                                  select new KeywordItemDTO
                                  {
                                      KeywordId = k.KeywordId,
                                      Name = k.Name
                                  }).ToListAsync();
            return keywords;
        }

        public async Task<List<KeywordItemDTO>> GetMainKeywords()
        {
            //ignore Module Position keywords
            var keywords = await (from k in QueriesContext.Keywords
                                  join c in QueriesContext.Categories on k.CategoryId equals c.CategoryId
                                  where c.Name != "Module Position"
                                  select new KeywordItemDTO
                                  {
                                      KeywordId = k.KeywordId,
                                      Name = k.Name
                                  }).ToListAsync();
            return keywords;
        }

        public async Task<List<FullModuleDTO>> GetAllModulesForSpecificAuthor(string authorParam)
        {
            var modulesData = await (from m in QueriesContext.Modules
                                     join mst in QueriesContext.ModuleStatusTypes on m.ModuleStatusTypeId equals mst.ModuleStatusTypeId
                                     where m.Author == authorParam
                                     select new FullModuleDTO
                                     {
                                         ModuleId = m.ModuleId,
                                         Contents = m.Contents,
                                         PassChoiceText = m.PassChoiceText,
                                         PassChoiceResult = m.PassChoiceResult,
                                         FailChoiceText = m.FailChoiceText,
                                         FailChoiceResult = m.FailChoiceResult,
                                         Author = m.Author,
                                         ModuleStatusType = mst.Name
                                     }).ToListAsync();


            return modulesData;
        }

        private async Task<List<SearchParam>> GetModuleKeywords(int moduleId)
        {
            return await (from m2k in QueriesContext.Modules2Keywords
                          join m in QueriesContext.Modules on m2k.ModuleId equals m.ModuleId
                          join k in QueriesContext.Keywords on m2k.KeywordId equals k.KeywordId
                          join c in QueriesContext.Categories on k.CategoryId equals c.CategoryId
                          where m.ModuleId == moduleId
                          select new SearchParam
                          {
                              CategoryId = c.CategoryId,
                              Keyword = k.Name
                          }).ToListAsync();
        }

    }
}
