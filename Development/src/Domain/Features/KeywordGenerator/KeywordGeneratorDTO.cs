namespace Domain.Features.KeywordGenerator
{
    public class CategoryDTO
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = "";
    }

    public class KeywordDTO
    {
        public int CategoryId { get; set; }
        public string Keyword { get; set; } = "";
    }
}
