using FA_BACK_END.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.Models;
using ModelViews.ViewModels;
using Repository.Interface;
using Services.Interfaces;
using System.ComponentModel.DataAnnotations;
using Tools.Tools;

namespace FA_BACK_END.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SyllabusController : ControllerBase, ISyllabusController
    {

        private readonly ISyllabusService _syllabusService;
        private readonly ISyllabusRepository _syllabusRepository;
        public SyllabusController(ISyllabusService syllabusService, ISyllabusRepository syllabusRepository)
        {
            _syllabusService = syllabusService;
            _syllabusRepository = syllabusRepository;
        }
        [HttpGet("Get-All")]
        public async Task<IActionResult> GetAll(
            int page = 1,
            int pageSize = 10,
            int sortOrder = 1,
            string sortField = "Name",
            DateOnly? startDate = null,
            DateOnly? endDate = null,
            [FromQuery] List<string>? searchValues = null)
        {
            var syllabus = await _syllabusService.GetAll(page, pageSize, sortOrder, sortField, startDate, endDate, searchValues);
            return Ok(syllabus);
        }
        [HttpGet("Get")]
        public async Task<IActionResult> GetSyllabusById([FromQuery][Required] string id)
        {
            var syllabus = await _syllabusService.GetSyllabusById(id);
            return Ok(syllabus);
        }
        [HttpGet("Export-CSV")]
        public async Task<IActionResult> ExportSyllabusCSV()
        {
            var syllabusList = await _syllabusRepository.GetAllAsync();

            byte[] csvBytes = await _syllabusService.ExportSyllabus(syllabusList);

            // Set the response headers for CSV download
            Response.Headers.Add("Content-Disposition", "attachment; filename=syllabus.csv");
            Response.Headers.Add("Content-Type", "text/csv");

            // Return the CSV file as the response
            return File(csvBytes, "text/csv");
        }
        [HttpPost("Add")]
        public async Task<IActionResult> AddSyllabus(SyllabusCreateView syllabusView)
        {
            string userId = Authentication.GetUserIdFromHttpContext(HttpContext);
            var syllabus = await _syllabusService.AddSyllabus(syllabusView,userId);
            return Ok(syllabus);
        }
        

        [HttpPost("Add-By-CSV")]
        [Authorize]
        public async Task<IActionResult> AddSyllabusCSV([FromForm] SyllabusImportCsvView syllabusImportCsv)
        {
            string userId = Authentication.GetUserIdFromHttpContext(HttpContext);
            var syllabus = await _syllabusService.AddSyllabusCSV(syllabusImportCsv,userId);
            return Ok(syllabus);
        }

       
        [HttpPut("Update")]
        public async Task<IActionResult> UpdateSyllabus([FromQuery][Required] string id, SyllabusCreateView syllabusView)
        {
            Syllabus syllabus = await _syllabusService.UpdateSyllabus(id, syllabusView);
            return Ok(syllabus);
        }
        [HttpDelete("Delete")]
        public async Task<IActionResult> RemoveSyllabus([FromQuery][Required] string id)
        {
            bool isRemoved = await _syllabusService.RemoveSyllabus(id);
            if (isRemoved)
            {
                return Ok();
            }
            return BadRequest();
        }
    }
}
