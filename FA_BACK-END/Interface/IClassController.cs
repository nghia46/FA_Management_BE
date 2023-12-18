using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using ModelViews.ViewModels;

namespace FA_BACK_END.Interface
{
    public interface IClassController
    {
        Task<IActionResult> GetAllClass();
        Task<IActionResult> GetClassById([FromQuery] [Required] string id);
        Task<IActionResult> AddClass(ClassView classView);
        Task<IActionResult> UpdateClass(string Id, ClassView classView);
        Task<IActionResult> RemoveClassById(string Id);
    }
}