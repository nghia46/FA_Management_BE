using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Models
{
    public class AzureBlobInformation
    {
        [BsonId]
        public required string SHA256 {  get; set; }
        public required string ContentType { get; set; }
        public required string BlobStorageName { get; set; }
    }
}
