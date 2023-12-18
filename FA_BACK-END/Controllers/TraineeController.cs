using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using FA_BACK_END.Interface;
using Models.Models;
using ModelViews.ViewModels;
using Services.Interfaces;

namespace FA_BACK_END.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TraineeController : ControllerBase, ITraineeController
    {
        private readonly ITraineeService _traineeService;
        public TraineeController(ITraineeService traineeService)
        {
            _traineeService = traineeService;
        }

        

        [HttpGet("Get-All")]
        public async Task<IActionResult> GetAll()
        {
            IEnumerable<Trainee> trainees = await _traineeService.GetAllTrainees();
            return Ok(trainees);
        }

        [HttpGet("Get-Trainee")]
        public async Task<IActionResult> GetTraineeById([FromQuery][Required] string id)
        {
            Trainee trainee = await _traineeService.GetTraineeById(id);
            return Ok(trainee);
        }
        [HttpPost("Add")]
        public async Task<IActionResult> AddTrainee(TraineeView traineeView)
        {
            var trainee = await _traineeService.AddTrainee(traineeView);
            return Ok(trainee);
        }
        [HttpPut("Toggle-Status")]
        public async Task<IActionResult> ToggleTraineeStatus([FromQuery][Required] string id)
        {
            Trainee trainee = await _traineeService.ToggleTraineeById(id);
            return Ok(trainee);
        }

        [HttpPut("Update")]
        public async Task<IActionResult> UpdateTrainee([FromQuery][Required] string Id, TraineeView traineeView)
        {
            Trainee trainee = await _traineeService.UpdateTrainee(Id, traineeView);
            return Ok(trainee);
        }
    }
}
