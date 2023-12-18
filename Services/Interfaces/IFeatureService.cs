using Models.Models;

namespace Services.Interfaces
{
    public interface IFeatureService
    {
        Task<IEnumerable<Feature>> GetAllFeatures();
    }
}
