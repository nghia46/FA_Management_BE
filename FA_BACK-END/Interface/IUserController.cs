using Microsoft.AspNetCore.Mvc;
using Models.Models;
using ModelViews.ViewModels;
using System.ComponentModel.DataAnnotations;

namespace FA_BACK_END.Interface
{
    public interface IUserController
    {
        Task<IActionResult> UpdateUser([FromQuery][Required] string id,UserUpdateView userView);
        Task<IActionResult> LoginUser(LoginUser loginUser);
        Task<IActionResult> GoogleLogin(GoogleUser googleUser);
        Task<IActionResult> UpdatedUser(string id);
        Task<IActionResult> UpdatePassword(ChangePasswordView changePassword);
    }
}
