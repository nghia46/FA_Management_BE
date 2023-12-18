using Models.Models;
using ModelViews.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IForgotPasswordService
    {
        Task<VerifyCode> AddCode(string code, string email);
        Task<User> VerifyCode(string code, string email);
        Task<bool> IsCodeExist(string email);
        Task<bool> Delete(string email);
    }
}
