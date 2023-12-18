using Models.Models;

namespace Repository.Interface
{
    public interface IUserRepository : IRepository<User>
    {
        Task<IEnumerable<User>> GetPagedFilteredAsync(
            int skip,
            int pageSize,
            bool isAsc,
            string sortField,
            DateOnly? startDate,
            DateOnly? endDate,
            List<bool>? genderList,
            List<string>? userTypeList,
            string? searchValue);
        Task<long> CountFilteredAsync(
            DateOnly? startDate,
            DateOnly? endDate,
            List<bool>? genderList,
            List<string>? userTypeList,
            string? searchValue);
    }
}
