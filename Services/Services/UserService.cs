using AutoMapper;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using Models.Models;
using ModelViews.ViewModels;
using Repository.Interface;
using Services.Interfaces;
using Tools.Tools;


namespace Services.Services
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepos;
        private readonly IRepository<UserRole> _userRoleRepos;
        private readonly IRepository<WaitingActivate> _waitingRepos;
        private readonly IRepository<VerifyCode> _repo;

        public UserService(IUserRepository userRepo, IRepository<UserRole> userRoleRepo, IConfiguration configuration,
            IMapper mapper, IRepository<WaitingActivate> waitingRepos, IRepository<VerifyCode> repo)
        {
            _mapper = mapper;
            _configuration = configuration;
            _userRepos = userRepo;
            _userRoleRepos = userRoleRepo;
            _waitingRepos = waitingRepos;
            _repo = repo;
        }

        public async Task<User> GetUser(string id)
        {
            IEnumerable<User> users = await _userRepos.GetByFilterAsync(x => x.Id == id);
            if (!users.Any())
            {
                throw new CustomException.DataNotFoundException($"User with ID {id} not found");
            }

            return users.First();
        }
        public async Task<UserUpdateView> GetUpdatedUser(string id)
        {
            var users = await _userRepos.GetByFilterAsync(x => x.Id == id);
            User user = users.First();
            UserUpdateView userUpdated = _mapper.Map<UserUpdateView>(user);
            return userUpdated;
        }

        public async Task<User> AddUser(UserView userView)
        {
            var user = _mapper.Map<User>(userView);
            // Check if the user role exists
            IEnumerable<UserRole> userRoles = await _userRoleRepos.GetByFilterAsync(r => r.Id.Equals(user.RoleId));
            if (!userRoles.Any())
            {
                throw new CustomException.InvalidDataException($"User type with name {user.RoleId} not found");
            }

            // Generate ID, Password, and any other required values
            user.Id = IdGenerator.GenerateId();
            user.Password = EncryptPassword.Encrypt(IdGenerator.GeneratePassword());
            user.Status = userView.Status != null;
            // Add the user to the repository
            return await _userRepos.AddOneItem(user);
        }

        public async Task<User> Register(UserRegisterView registerView)
        {
            IEnumerable<User> checkEmail = await _userRepos.GetByFilterAsync(x => x.Email.Equals(registerView.Email));
            if (checkEmail.Count() != 0)
            {
                throw new CustomException.InvalidDataException($"Email is exist");
            }

            var user = _mapper.Map<User>(registerView);
            user.RoleId = (await _userRoleRepos.GetByFilterAsync(r => r.Name.Equals("User"))).First().Id;
            user.Id = IdGenerator.GenerateId();
            user.Password = EncryptPassword.Encrypt(registerView.Password);
            user.Status = false;
            user.Gender = registerView.Gender;
            user.CreateAt = DateTime.Now;
            await _userRepos.AddOneItem(user);
            // Add id to table waiting active
            var waitingUser = _mapper.Map<WaitingActivate>(registerView);
            waitingUser.Id = user.Id;
            waitingUser.CreateAt = user.CreateAt;
            await _waitingRepos.AddOneItem(waitingUser);

            // Add the user to the repository
            return user;
        }


        public async Task<(string, UserUpdateView)> AuthorizeUser(LoginUser loginUser)
        {
            string hashedPass = EncryptPassword.Encrypt(loginUser.Password);
            IEnumerable<User> check = await _userRepos.GetByFilterAsync(x =>
                x.Email.Equals(loginUser.Email) && x.Password.Equals(hashedPass));
            if (!check.Any())
            {
                throw new CustomException.InvalidDataException($"Email or password error");
            }

            User user = check.First();
            if (user.Status == false)
            {
                throw new CustomException.InvalidDataException($"User is not active");
            }
            UserUpdateView userUpdate = _mapper.Map<UserUpdateView>(user);
            Authentication authentication = new(_configuration);
            string token = authentication.GenerateJwtToken(user.Id, 15);
            return (token, userUpdate);
        }

        public async Task<(string, UserUpdateView)> GoogleAuthorizeUser(GoogleUser googleUser)
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(googleUser.idToken);
            User user;
            IEnumerable<User> check = await _userRepos.GetByFilterAsync(x => x.Email.Equals(payload.Email));
            if (check.Any())
            {
                user = check.First();
            }
            else
            {
                User addGoogleUser = new User
                {
                    Email = payload.Email,
                    Id = IdGenerator.GenerateId(),
                    Name = payload.Name,
                    Password = EncryptPassword.Encrypt(IdGenerator.GeneratePassword()),
                    Phone = string.Empty,
                    Status = true,
                    RoleId = (await _userRoleRepos.GetByFilterAsync(r => r.Name.Equals("User"))).First().Id,
                    Dob = new(),
                    Gender = true,
                    ImageUrl = payload.Picture,
                    CreateAt = DateTime.Now
                };
                user = await _userRepos.AddOneItem(addGoogleUser);
            }
            UserUpdateView userUpdate = _mapper.Map<UserUpdateView>(user);
            Authentication authentication = new(_configuration);
            string token = authentication.GenerateJwtToken(user.Id, 15);
            return (token, userUpdate);
        }

        public async Task<IEnumerable<User>> AddUsers(List<UserView> userViewList)
        {
            List<User> userList = new();
            IEnumerable<UserRole> userRoles = await _userRoleRepos.GetAllAsync();
            foreach (UserView userView in userViewList)
            {
                if (!userRoles.Any(ut => ut.Id.Equals(userView.RoleId)))
                {
                    throw new CustomException.InvalidDataException($"User type with id {userView.RoleId} not found");
                }

                User user = _mapper.Map<User>(userView);
                user.Id = IdGenerator.GenerateId();
                user.Password = IdGenerator.GeneratePassword();
                user.Status = userView.Status != null;
                userList.Add(user);
            }

            return await _userRepos.AddManyItem(userList);
        }

        public async Task<object> GetUsers(int page, int pageSize, int sortOrder, string sortField, DateOnly? startDate,
            DateOnly? endDate, List<bool>? genderList, List<string>? userRoleList, string? searchValue)
        {
            int skip = (page - 1) * pageSize;
            long totalCount =
                await _userRepos.CountFilteredAsync(startDate, endDate, genderList, userRoleList, searchValue);
            bool isAsc;
            IEnumerable<User> users;
            isAsc = (sortOrder == 1);
            users = await _userRepos.GetPagedFilteredAsync(skip, pageSize, isAsc, sortField, startDate, endDate,
                genderList, userRoleList, searchValue);
            var response = new
            {
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                Users = users
            };
            return response;
        }

        public async Task<User> UserUpdateUser(string id, UserUpdateView userView)
        {
            var oldUser = await _userRepos.GetByFilterAsync(x => x.Id == id);
            if (!oldUser.Any())
            {
                throw new CustomException.DataNotFoundException($"User with ID {id} not found");
            }
            var updatingUser = _mapper.Map<User>(userView);
            updatingUser.Id = id;
            updatingUser.RoleId = oldUser.First().RoleId;
            updatingUser.Email = oldUser.First().Email;
            updatingUser.Class = oldUser.First().Class;
            updatingUser.CreateAt = oldUser.First().CreateAt;
            updatingUser.Password = oldUser.First().Password;
            updatingUser.Status = oldUser.First().Status;
            return await _userRepos.UpdateItemByValue(id, updatingUser);
        }
        public async Task<User> UpdateUser(string id, UserView userView)
        {
            IEnumerable<UserRole> userRoles = await _userRoleRepos.GetByFilterAsync(ut => ut.Id == userView.RoleId);
            if (!userRoles.Any())
            {
                throw new CustomException.InvalidDataException($"User type with name {userView.RoleId} not found");
            }

            var oldUser = await _userRepos.GetByFilterAsync(x => x.Id == id);
            if (!oldUser.Any())
            {
                throw new CustomException.DataNotFoundException($"User with ID {id} not found");
            }

            var updatingUser = _mapper.Map<User>(userView);
            updatingUser.Id = id;
            updatingUser.Password = oldUser.First().Password;
            return await _userRepos.UpdateItemByValue(id, updatingUser);
        }

        public async Task<User> UpdateUserRole(string id, string roleId)
        {
            var oldUser = await _userRepos.GetByFilterAsync(x => x.Id == id);
            if (!oldUser.Any())
            {
                throw new CustomException.DataNotFoundException($"User with ID {id} not found");
            }

            IEnumerable<UserRole> userRoles = await _userRoleRepos.GetByFilterAsync(ut => ut.Id.Equals(roleId));
            if (!userRoles.Any())
            {
                throw new CustomException.DataNotFoundException($"User role with id {roleId} not found!");
            }

            User updatingUser = oldUser.First();
            updatingUser.RoleId = roleId;
            return await _userRepos.UpdateItemByValue(id, updatingUser);
        }

        public async Task<User> ToggleUserStatus(string id)
        {
            IEnumerable<User> user = await this._userRepos.GetByFilterAsync(u => u.Id == id);
            if (!user.Any())
            {
                throw new CustomException.DataNotFoundException($"User with ID {id} not found");
            }

            User updatingUser = user.First();
            updatingUser.Status = !updatingUser.Status;
            return await _userRepos.UpdateItemByValue(id, updatingUser);
        }

        public async Task<bool> DeleteUser(string id)
        {
            IEnumerable<User> user = await this._userRepos.GetByFilterAsync(u => u.Id == id);
            if (!user.Any())
            {
                throw new CustomException.DataNotFoundException($"User with ID {id} not found");
            }

            return await _userRepos.RemoveItemByValue(id);
        }

        public async Task<User> ChangeStatus(string id)
        {
            IEnumerable<User> checkUser = await this._userRepos.GetByFilterAsync(x => x.Id == id);
            if (!checkUser.Any())
            {
                throw new CustomException.DataNotFoundException($"User with ID {id} not found");
            }

            User find = checkUser.First();

            if (find.Status == false)
            {
                find.Status = true;
                await _waitingRepos.RemoveItemByValue(find.Id);
            }

            return await _userRepos.UpdateItemByValue(id, find);
        }

        public async Task<string> SortIdRegister(string id)
        {
            IEnumerable<WaitingActivate> check = await _waitingRepos.GetByFilterAsync(x => x.Id == id);
            if (!check.Any())
            {
                throw new CustomException.DataNotFoundException($"User with ID {id} not found");
            }
            return check.First().Id;
        }
        public async Task<User> ChangePasword(string id, ChangePasswordView changePassword)
        {

            var users = await _userRepos.GetByFilterAsync(x => x.Id == id && x.Password == EncryptPassword.Encrypt(changePassword.CurrentPassword));
            if (!users.Any())
            {
                throw new CustomException.InvalidDataException("Wrong Password!");
            }
            var user = users.First();
            User updateUser = new User
            {
                Id = user.Id,
                Email = user.Email,
                Password = EncryptPassword.Encrypt(changePassword.NewPassword),
                Name = user.Name,
                Phone = user.Phone,
                RoleId = user.RoleId,
                Class = user.Class,
                CreateAt = user.CreateAt,
                Dob = user.Dob,
                Gender = user.Gender,
                ImageUrl = user.ImageUrl,
                Status = user.Status,
            };
            return await _userRepos.UpdateItemByValue(id, updateUser);
        }
        public async Task<User> FindUserByEmail(string email)
        {
            var user = await _userRepos.GetByFilterAsync(u => u.Email == email);
            if (!user.Any())
            {
                return null;
            }
            return user.First();
        }

        public async Task<User> UpdatePassword(string email, string password, string id)
        {
            var hashedPassword = EncryptPassword.Encrypt(password);
            var checkCode = await _repo.GetByFilterAsync(c => c.Email.Equals(email));
            var user = await _userRepos.GetByFilterAsync(u => u.Email == email && u.Id == id);
            if (!user.Any() || !checkCode.Any())
            {
                throw new Exception("Invalid request!");
            }
            User newUser = new User
            {
                Id = user.First().Id,
                Email = user.First().Email,
                Password = hashedPassword,
                Dob = user.First().Dob,
                Gender = user.First().Gender,
                Name = user.First().Name,
                Phone = user.First().Phone,
                RoleId = user.First().RoleId,
                ImageUrl = user.First().ImageUrl,
                Class = user.First().Class,
                Status = user.First().Status,
                CreateAt = user.First().CreateAt
            };
            var updateUser = await _userRepos.UpdateItemByValue(user.First().Id, newUser);
            await _repo.RemoveItemByValue(checkCode.First().Id);
            return updateUser;
        }
    }
}