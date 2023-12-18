using Microsoft.AspNetCore.Mvc;
using Models.Models;
using MongoDB.Driver;
using Repository.Interface;
using Repository.Service;

namespace FA_BACK_END.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoggerController : ControllerBase
    {
        private readonly IRepository<LogEntry> _loggerRepos;
        public LoggerController(IRepository<LogEntry> logRepo)
        {
            _loggerRepos = logRepo ;
        }
        [HttpGet("Get-All")]
        public async Task<IActionResult> GetAllLog(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            int skip = (page - 1) * pageSize;
            IEnumerable<LogEntry> logs = await _loggerRepos.GetPagedAsync(skip,pageSize,false,"Timestamp");
            return Ok(logs);
        }
    }
}
