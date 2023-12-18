using FA_BACK_END.Interface;
using Microsoft.AspNetCore.Mvc;
using Models.Models;
using ModelViews.ViewModels;
using Services.Interfaces;
using System.ComponentModel.DataAnnotations;
using Tools.Tools;

namespace FA_BACK_END.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassController : ControllerBase, IClassController
    {
        private readonly IClassService _classService;
        public ClassController(IClassService classService)
        {
            _classService = classService;
        }

        [HttpGet("Get-All")]
        public async Task<IActionResult> GetAllClass()
        {
            IEnumerable<Class> classes = await _classService.GetAllClass();
            return Ok(classes);
        }

        [HttpGet("Get")]
        public async Task<IActionResult> GetClassById([FromQuery][Required] string id)
        {
            Class classes = await _classService.GetClassById(id);
            return Ok(classes);
        }
        [HttpPost("Add")]
        public async Task<IActionResult> AddClass(ClassView classView)
        {
            string userId = Authentication.GetUserIdFromHttpContext(HttpContext);
            Class addedClass = await _classService.AddClass(classView, userId);
            return Ok(addedClass);
        }
        [HttpPut("Update")]
        public async Task<IActionResult> UpdateClass(string id, ClassView classView)
        {
            Class updatedClass = await _classService.UpdateClass(id, classView);
            return Ok(updatedClass);
        }

        [HttpDelete("Delete")]
        public async Task<IActionResult> RemoveClassById(string id)
        {
            bool isDeleted = await _classService.RemoveClassById(id);
            if (isDeleted)
            {
                return Ok();
            }
            return BadRequest();
        }

        
    }
}