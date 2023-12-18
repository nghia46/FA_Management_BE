using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace Models.Models
{
    public class SyllabusMaterial
    {
        [BsonRequired]
        public required string Title { get; set; }
        [BsonRequired]
        public required string Owner { get; set; }
        [BsonRequired]
        public DateOnly CreatedDate { get; set; }
        [BsonRequired]
        public required MaterialContent Content { get; set; }
    }
    [BsonDiscriminator(Required = true)]
    [BsonKnownTypes(typeof(FileMaterialContent), typeof(UrlMaterialContent))]
    [JsonDerivedType(typeof(FileMaterialContent),"File")]
    [JsonDerivedType(typeof(UrlMaterialContent),"Url")]
    public abstract class MaterialContent
    {
    }
    public class FileMaterialContent : MaterialContent
    {
        public FileMaterialContent() { }
        public required string FileHash { get; set; }
        public required string FileName { get; set; }
    }
    public class UrlMaterialContent : MaterialContent
    {
        public UrlMaterialContent() { }
        public required string Url { get; set; }
    }
}
