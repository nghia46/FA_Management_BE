using Microsoft.AspNetCore.Http;
using Tools.Tools;
namespace Models.Models
{
    public class SyllabusImportCsvView
    {
        public required IFormFile CsvFile { get; set; }
        public required List<string> DuplicateCheckField { get; set; }
        [CustomDataValidation.EnumValidation(typeof(ImportHandleMethod))]
        public ImportHandleMethod DuplicateHandleMethod { get; set; }
    }
    public enum ImportHandleMethod
    {
        Create,//0
        Replace,//1
        Skip//2
    }
}
