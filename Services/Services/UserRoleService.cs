using AutoMapper;
using Models.Models;
using ModelViews.ViewModels;
using MongoDB.Driver;
using Repository.Service;
using Tools.Tools;
using Services.Interfaces;
using Repository.Interface;

namespace Services.Services
{
    public class UserRoleService : IUserRoleService
    {
        private readonly IRepository<UserRole> _userRoleRepository;
        private readonly IUserRepository _userRepository;

        private readonly string defaultPermissionAccessId = "none";
        public UserRoleService(IRepository<UserRole> roleRepo, IUserRepository userRepo)
        {
            _userRoleRepository = roleRepo;
            _userRepository = userRepo;
        }
        public async Task<UserRole> AddUserRole(string userRoleName)
        {
            string id = userRoleName.Trim().ToLower().Replace(" ", "_");
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new CustomException.InvalidDataException("Invalid name");
            }
            IEnumerable<UserRole> duplicatedRole = await _userRoleRepository.GetByFilterAsync(x => x.Id.Equals(id) || x.Name.Equals(userRoleName));
            if (duplicatedRole.Any())
            {
                throw new CustomException.InvalidDataException($"User role with name {userRoleName} already exist");
            }
            UserRole userRole = new()
            {
                Id = id,
                Name = userRoleName,
                FeatureAccessPermission = new()
            };
            return await _userRoleRepository.AddOneItem(userRole);
        }
        public async Task<bool> DeleteUserRole(string id)
        {
            IEnumerable<UserRole> userRoles = await _userRoleRepository.GetByFilterAsync(x => x.Id == id);
            if (!userRoles.Any())
            {
                throw new CustomException.DataNotFoundException($"User role with id {id} not found");
            }
            IEnumerable<User> users = await _userRepository.GetByFilterAsync(x => x.RoleId.Equals(id));
            if (users.Any())
            {
                throw new CustomException.InternalServerErrorException($"Unable to delete user role. Some users still have this role assigned. Please reassign the role from the affected users before attempting to delete it.");
            }
            return await _userRoleRepository.RemoveItemByValue(id);
        }
        public async Task<IEnumerable<UserRole>> GetAllRoles()
        {
            IEnumerable<UserRole> userRoles = await _userRoleRepository.GetAllAsync();
            return userRoles;
        }
    }
}
