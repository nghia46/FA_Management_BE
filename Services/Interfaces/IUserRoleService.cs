using Models.Models;
using ModelViews.ViewModels;

namespace Services.Interfaces
{
    public interface IUserRoleService
    {
        Task<IEnumerable<UserRole>> GetAllRoles();
        Task<UserRole> AddUserRole(string userRoleName);
        Task<bool> DeleteUserRole(string id);
    }
}
