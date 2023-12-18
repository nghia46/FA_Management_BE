using MongoDB.Bson.Serialization.Attributes;

namespace Models.Models
{
    public class LogEntry
    {
        [BsonId]
        public required string Id { get; set; }
        [BsonElement]
        public  string UserId { get; set; }
        [BsonElement]
        public DateTime Timestamp { get; set; }
        [BsonElement]
        public LogLevel Level { get; set; }
        [BsonElement]
        public required string Message { get; set; }
        [BsonElement]
        public required string Logger { get; set; }
        [BsonElement]
        public required string Exception { get; set; }
    }
    public enum LogLevel
    {
        Trace,
        Debug,
        Info,
        Warning,
        Error,
        Fatal
    }
}
