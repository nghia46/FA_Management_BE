
using FA_BACK_END.Interface;
using Microsoft.AspNetCore.Mvc;
using Models.Models;
using ModelViews.ViewModels;
using Services.Interfaces;
using Services.Services;
using System.ComponentModel.DataAnnotations;
using Tools.Tools;

namespace FA_BACK_END.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrainingProgramController : ControllerBase, ITrainingProgramController
    {
        private readonly ITrainingProgramService _trainingProgramService;
        public TrainingProgramController(ITrainingProgramService trainingProgramService)
        {
            _trainingProgramService = trainingProgramService;
        }

        [HttpGet("Get-All")]
        public async Task<IActionResult> GetAllTrainingProgram()
        {
            var trainingProgram = await _trainingProgramService.GetTrainingPrograms();
            return Ok(trainingProgram);
        }

        [HttpGet("Get")]
        public async Task<IActionResult> GetTrainingProgramById(string id)
        {
            var trainingProgram = await _trainingProgramService.GetTrainingProgramsById(id);
            return Ok(trainingProgram);
        }

        [HttpPost("Add")]
        public async Task<IActionResult> AddTrainingProgram(TrainingProgramView trainingProgramView)
        {
            string userId = Authentication.GetUserIdFromHttpContext(HttpContext);
            var trainingProgram = await _trainingProgramService.AddTrainingProgram(trainingProgramView,userId);
            return Ok(trainingProgram);
        }

        [HttpPut("Update")]
        public async Task<IActionResult> UpdateTrainingProgram([FromQuery][Required] string id, TrainingProgramView trainingProgramView)
        {
            TrainingProgram trainingProgram = await _trainingProgramService.UpdateTrainingProgram(id, trainingProgramView);
            return Ok(trainingProgram);
        }

        [HttpDelete("Delete")]
        public async Task<IActionResult> DeleteTrainingProgram([FromQuery][Required] string id)
        {
            bool isDelete = await _trainingProgramService.RemoveTrainingProgram(id);
            if (isDelete)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }

        }
    }
}
