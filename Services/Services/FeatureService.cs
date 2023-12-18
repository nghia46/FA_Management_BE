using Models.Models;
using MongoDB.Driver;
using Repository.Interface;
using Repository.Service;
using Services.Interfaces;

namespace Services.Services
{
    public class FeatureService : IFeatureService
    {
        private readonly IRepository<Feature> _featureRepo;
        public FeatureService(IRepository<Feature> featurRepo)
        {
            _featureRepo = featurRepo;
        }
        public async Task<IEnumerable<Feature>> GetAllFeatures()
        {
            return await _featureRepo.GetAllAsync();
        }
    }
}
