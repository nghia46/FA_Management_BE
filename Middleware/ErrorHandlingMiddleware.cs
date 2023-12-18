
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Models.Models;
using Repository.Interface;
using System.Net;
using System.Text.Json;
using Tools.Tools;

namespace Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        
        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }   

        public async Task Invoke(HttpContext context, IRepository<LogEntry> repository)
        {
            try
            {
                await _next(context);
            }
            catch (CustomException.InvalidDataException ex)
            {
                await HandleDataExceptionAsync(context, ex);
            }
            catch (CustomException.DataNotFoundException ex)
            {
                await LogToMongoDb(repository, context, ex);
                await HandleDataNotFoundExceptionAsync(context, ex);
            }
            catch (Exception ex)
            {
                await LogToMongoDb(repository, context, ex);
                await HandleServerExceptionAsync(context, ex);
            }
        }
        public static Task HandleDataExceptionAsync(HttpContext context, CustomException.InvalidDataException ex)
        {
            var result = JsonSerializer.Serialize(new
            {
                error = ex.Message
            });
            context.Response.ContentType = "application/json";
            var header = new KeyValuePair<string, StringValues>("Access-Control-Allow-Origin","*");
            context.Response.Headers.Add(header);
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return context.Response.WriteAsync(result);
        }
        public static Task HandleDataNotFoundExceptionAsync(HttpContext context, CustomException.DataNotFoundException ex)
        {
            var result = JsonSerializer.Serialize(new
            {
                error = ex.Message
            });
            context.Response.ContentType = "application/json";
            var header = new KeyValuePair<string, StringValues>("Access-Control-Allow-Origin", "*");
            context.Response.Headers.Add(header);
            context.Response.StatusCode = (int)HttpStatusCode.NotFound;
            return context.Response.WriteAsync(result);
        }
        public static Task HandleServerExceptionAsync(HttpContext context, Exception ex)
        {
            var code = HttpStatusCode.InternalServerError;
            var result = JsonSerializer.Serialize(new
            {
                error = ex.Message
            });
            context.Response.ContentType = "application/json";
            var header = new KeyValuePair<string, StringValues>("Access-Control-Allow-Origin", "*");
            context.Response.Headers.Add(header);
            context.Response.StatusCode = (int)code;
            return context.Response.WriteAsync(result);
        }
        private static async Task LogToMongoDb(IRepository<LogEntry> _logEntryRepos, HttpContext context, Exception ex)
        {
            string? userId = null;
            try
            {
                userId = Tools.Tools.Authentication.GetUserIdFromHttpContext(context);
            } catch (Exception){}
            var logEntry = new LogEntry
            {
                Id = IdGenerator.GenerateId(),
                UserId = userId ?? string.Empty,
                Timestamp = DateTime.UtcNow,
                Message = context.Request.Path,
                Exception = ex.Message,
                Level = LogLevel.Error,
                Logger = string.Empty
            };
            await _logEntryRepos.AddOneItem(logEntry);
        }
    }
}
