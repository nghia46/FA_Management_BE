using Microsoft.AspNetCore.Mvc;
using ModelViews.ViewModels;
using System.ComponentModel.DataAnnotations;

namespace FA_BACK_END.Interface
{
    public interface IUserManagermentController
    {
        Task<IActionResult> GetUsers(
           [FromQuery] int page = 1,
           [FromQuery] int pageSize = 10,
           [FromQuery] string sortBy = "UserRole",
           [FromQuery] int orderBy = 1,
           [FromQuery] DateOnly? startDate = null,
           [FromQuery] DateOnly? endDate = null,
           [FromQuery] List<bool>? genderList = null,
           [FromQuery] List<string>? userTypeList = null,
           [FromQuery] string? searchValue = null);
        Task<IActionResult> GetUser([FromQuery][Required] string id);
        Task<IActionResult> AddUser(UserView userView);
        Task<IActionResult> AddUsers(List<UserView> userViews);
        Task<IActionResult> UpdateUser([FromQuery][Required] string id, UserView userView);
        Task<IActionResult> DeleteUser([FromQuery][Required] string id);
        Task<IActionResult> UpdateRole(string id, string roleId);
        Task<IActionResult> ToggleUser(string id);
    }
}
