using FA_BACK_END.Interface;
using Microsoft.AspNetCore.Mvc;
using Models.Models;
using ModelViews.ViewModels;
using Services.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace FA_BACK_END.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationController : ControllerBase, ILocationController
    {
        private readonly ILocationService _locationService;
        public LocationController(ILocationService locationService)
        {
            _locationService = locationService;
        }
        
        [HttpGet("Get-All")]
        public async Task<IActionResult> GetLocation()
        {
            var locations = await _locationService.GetLocation();
            return Ok(locations);
        }
        
        [HttpPost("Add")]
        public async Task<IActionResult> AddLocation(LocationView locationView)
        {
            var location = await _locationService.AddLocation(locationView);
            return Ok(location);
        }
        
        [HttpPut("Update")]
        public async Task<IActionResult> UpdateLocation([Required][FromQuery] string id, LocationView locationView)
        {
            Location location = await _locationService.UpdateLocation(id, locationView);
            return Ok(location);
        }
        [HttpDelete("Delete")]
        public async Task<IActionResult> RemoveLocation([FromQuery][Required] string id)
        {
            bool isDelete = await _locationService.RemoveLocation(id);
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