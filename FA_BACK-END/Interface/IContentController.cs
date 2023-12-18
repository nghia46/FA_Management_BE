using Microsoft.AspNetCore.Mvc;
using ModelViews.ViewModels;

namespace FA_BACK_END.Interface
{
    public interface IContentController
    {
        Task<IActionResult> GetAll();
        Task<IActionResult> AddOneContent(ContentView contentView);
        Task<IActionResult> DeleteContent(string id);
        Task<IActionResult> UpdateContent(string id, ContentView contentView);
        Task<IActionResult> GetContentById(string id);
    }
}
