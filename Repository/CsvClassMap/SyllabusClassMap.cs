using CsvHelper.Configuration;
using Models.Models;
using Tools.Tools;

namespace Repository.CsvClassMap
{
    public class SyllabusClassMap : ClassMap<Syllabus>
    {
        public SyllabusClassMap()
        {
            Map(m => m.Id).Ignore();
            Map(m => m.Code).Name("Code");
            Map(m => m.Name).Name("Syllabus");
            Map(m => m.Version).Name("Version");
            Map(m => m.ModifiedBy).Ignore();
            Map(m => m.TechnicalRequirement).Name("TechnicalRequirement");
            Map(m => m.Objective).Name("Objective");
            Map(m => m.DeliveryPrinciple).Name("DeliveryPrinciple");
            Map(m => m.AttendeeQuantity).Name("AttendeeQuantity");
            Map(m => m.PassingCriteria).Name("PassingCriteria");
            Map(m => m.ModifiedOn).Ignore();
            Map(m => m.Status).Ignore();
            Map(m => m.Level).Name("Level");
        }
    }
}
