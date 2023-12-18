using Microsoft.AspNetCore.Http;
using Models.Models;
using MongoDB.Driver;
using Repository.Interface;
using Repository.Service;
using Services.Interfaces;
using LogEntry = Models.Models.LogEntry;

namespace Services.Services
{
    public class LoggerService : ILoggerService
    {
        private readonly IRepository<LogEntry> _logRepos;
        public LoggerService(IRepository<LogEntry> logRepos)
        {
            _logRepos = logRepos ;
        }
        public async Task<LogEntry> AddLog(HttpContext context,string methodName, LogLevel level)
        {

            LogEntry log = new()
            {
                Id = Tools.Tools.IdGenerator.GenerateId(),
                UserId = Tools.Tools.Authentication.GetUserIdFromHttpContext(context),
                Level = level,
                Logger = methodName,
                Exception = "",
                Message = methodName+ " work correctly!",
                Timestamp = DateTime.Now,        
                
            };
            LogEntry logEntry = await _logRepos.AddOneItem(log);
            return logEntry;
        }
    }
}
