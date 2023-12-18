using Microsoft.AspNetCore.Http;
using Models.Models;

namespace Services.Interfaces
{
    public interface ILoggerService
    {
        Task<LogEntry> AddLog(HttpContext context, string methodName, LogLevel level);
    }
}
