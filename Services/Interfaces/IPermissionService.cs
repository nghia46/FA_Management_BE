using Models.Models;
using ModelViews.ViewModels;

namespace Services.Interfaces
{
    public interface IPermissionService
    {
        Task ResetAllPermission();
        Task<IEnumerable<FeaturePermission>> GetAllFeaturePermissions();
        Task<IEnumerable<UserRole>> UpdateRolePermissions(IEnumerable<UserRolePermissionView> rolePermissionViews);
    }
}
