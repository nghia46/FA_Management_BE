using Models.Models;
using ModelViews.ViewModels;

namespace Services.Interfaces
{
    public interface IClassService
    {
        Task<IEnumerable<Class>> GetAllClass();
        Task<Class> GetClassById(string id);
        Task<Class> UpdateClass(string id, ClassView classView);
        Task<bool> RemoveClassById(string id);
        Task<Class> AddClass(ClassView classView, string userId);
    }
}