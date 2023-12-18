using Microsoft.AspNetCore.Http;
using Models.Models;

namespace ModelViews.ViewModels
{
    public class MaterialCreateView
    {
        public required string ContentId { get; set; }
        public required string Title { get; set; }
        public bool IsFileType { get; set; }
        public required string Owner { get; set; }
        public IFormFile? File { get; set; }
        public string? Url { get; set; }
    }
}
