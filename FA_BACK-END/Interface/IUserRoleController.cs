using Microsoft.AspNetCore.Mvc;
using ModelViews.ViewModels;

namespace FA_BACK_END.Interface
{
    public interface IUserRoleController
    {
        Task<IActionResult> AddOneRole(string userRoleName);
        Task<IActionResult> GetAllRole();
        Task<IActionResult> DeleteRole(string typeId);
    }
}