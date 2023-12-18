using Models.Models;
using ModelViews.ViewModels;

namespace Services.Interfaces
{
    public interface ISyllabusService
    {
        Task<object> GetAll(
            int page,
            int pageSize,
            int sortOrder,
            string sortField,
            DateOnly? startDate,
            DateOnly? endDate,
            IEnumerable<string>? searchValues);
        Task<Syllabus> GetSyllabusById(string id);
        Task<Syllabus> AddSyllabus(SyllabusCreateView syllabusView, string userId);
        Task<List<Syllabus>> AddSyllabusCSV(SyllabusImportCsvView syllabusImportCsv, string userId);
        Task<Syllabus> UpdateSyllabus(string id, SyllabusCreateView syllabusView);
        Task<bool> RemoveSyllabus(string id);
        Task<byte[]> ExportSyllabus(List<Syllabus> syllabusList);
    }
}
