using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using ModelViews.ViewModels;

namespace FA_BACK_END.Interface
{
    public interface ILocationController
    {
        Task<IActionResult> GetLocation();
        Task<IActionResult> AddLocation(LocationView locationView);
        Task<IActionResult> RemoveLocation(string Id);
        Task<IActionResult> UpdateLocation([Required] [FromQuery] string id, LocationView locationView);
    }
}
