using Models.Models;
using ModelViews.ViewModels;
namespace Services.Interfaces
{
    public interface IUserService
    {
        Task<User> GetUser(string id);
        Task<User> AddUser(UserView userView);
        Task<UserUpdateView> GetUpdatedUser(string id);
        Task<(string, UserUpdateView)> AuthorizeUser(LoginUser loginUser);
        Task<(string, UserUpdateView)> GoogleAuthorizeUser(GoogleUser googleUser);
        Task<IEnumerable<User>> AddUsers(List<UserView> userViewList);
        Task<object> GetUsers(int page, int pageSize, int sortOrder, string sortField, DateOnly? startDate, DateOnly? endDate, List<bool>? genderList, List<string>? userTypeList, string? searchValue);
        Task<User> UserUpdateUser(string id, UserUpdateView userView);
        Task<User> UpdateUser(string id, UserView userView);
        Task<User> Register(UserRegisterView registerView);
        Task<User> UpdateUserRole(string id, string roleId);
        Task<User> ToggleUserStatus(string id);
        Task<bool> DeleteUser(string id);
        Task<User> ChangeStatus(string id);
        Task<string> SortIdRegister(string id);
        Task<User> ChangePasword(string id, ChangePasswordView changePasswordView);
        Task<User> FindUserByEmail(string email);
        Task<User> UpdatePassword(string email, string password, string id);
    }
}
