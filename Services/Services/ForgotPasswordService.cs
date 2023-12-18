using Models.Models;
using Repository.Interface;
using Services.Interfaces;
using Tools.Tools;

namespace Services.Services
{
    public class ForgotPasswordService : IForgotPasswordService
    {
        private readonly IRepository<VerifyCode> _repo;
        private readonly IUserRepository _userRepository;
        public ForgotPasswordService(IRepository<VerifyCode> repo, IUserRepository userRepository)
        {
            _repo = repo;
            _userRepository = userRepository;

        }
        public async Task<VerifyCode> AddCode(string code, string email)
        {
            var verifyCode = new VerifyCode
            {
                Id = IdGenerator.GenerateId(),
                Email = email,
                Code = code,
                CreateAt = DateTime.Now,
            };

            return await _repo.AddOneItem(verifyCode);
        }

        public async Task<User> VerifyCode(string code, string email)
        {
            IEnumerable<User> users = await _userRepository.GetByFilterAsync(u => u.Email.Equals(email));
            if (!users.Any())
            {
                throw new CustomException.DataNotFoundException("Email is invalid");
            }
            IEnumerable<VerifyCode> verifyCode = await _repo.GetByFilterAsync(c => c.Email.Equals(email) && c.Code.Equals(code));
            if (!verifyCode.Any())
            {
                throw new Tools.Tools.CustomException.InvalidDataException("Verify code incorrect");
            }
            var createAt = verifyCode.First().CreateAt;

            DateTime now = DateTime.UtcNow;

            TimeSpan timeDifference = now - createAt;

            if (timeDifference.TotalSeconds < 60)
            {
                return users.First();
            }
            else
            {
                throw new Tools.Tools.CustomException.InvalidDataException("Verify code expired");
            }
        }

        public async Task<bool> IsCodeExist(string email)
        {
            IEnumerable<VerifyCode> verifyCodes = await _repo.GetByFilterAsync(c => c.Email.Equals(email));
            if (!verifyCodes.Any())
            {
                return false;
            }
            return true;
        }

        public async Task<bool> Delete(string email)
        {
            IEnumerable<VerifyCode> verifyCodes = await _repo.GetByFilterAsync(c => c.Email.Equals(email));
            var id = verifyCodes.First().Id;
            return await _repo.RemoveItemByValue(id);
        }
    }
}
