using Microsoft.AspNetCore.Mvc;
using Models.Models;
using ModelViews.ViewModels;


namespace FA_BACK_END.Interface
{
    public interface ISyllabusController
    {
        Task<IActionResult> GetAll(int page,
            int pageSize,
            int sortOrder,
            string sortField,
            DateOnly? startDate,
            DateOnly? endDate,
            List<string>? searchValue);
        Task<IActionResult> AddSyllabus(SyllabusCreateView syllabusView);
        Task<IActionResult> AddSyllabusCSV(SyllabusImportCsvView syllabusImportCsv);
        Task<IActionResult> RemoveSyllabus(string Id);
        Task<IActionResult> UpdateSyllabus(string Id, SyllabusCreateView syllabusView);
        Task<IActionResult> GetSyllabusById(string Id);
    }
}
