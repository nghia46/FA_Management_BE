using Models.Models;

namespace Repository.Interface
{
    public interface ISyllabusRepository : IRepository<Syllabus>
    {
        Task<IEnumerable<Syllabus>> GetPagedFilteredAsync(
            int skip,
            int pageSize,
            bool isAsc,
            string sortField,
            DateOnly? startDate,
            DateOnly? endDate,
            IEnumerable<string>? searchValues);
        Task<long> CountPagedFilteredAsync(
            DateOnly? startDate,
            DateOnly? endDate,
            IEnumerable<string>? searchValues);
        Task<Syllabus> GetSyllabusByNameAndCodeAsync(string? name, string? code);
        Task<long> CountSyllabusByNameAndCodeAsync(string? name, string? code);
    }
}
