using AzureBlobStorageRepository;
using Microsoft.AspNetCore.Mvc;
using Models.Models;
using ModelViews.ViewModels;
using Repository.Interface;
using Services.Interfaces;
using Services.Services;

namespace FA_BACK_END.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LearningMaterialController : Controller
    {
        private readonly IAzureBlobInformationService _infoService;
        public LearningMaterialController(IAzureBlobInformationService service)
        {
            _infoService = service;
        }
        [HttpGet("Get-All")] 
        public async Task<IActionResult> GetAll()
        {
            IEnumerable<AzureBlobInformation> blobInformation = await _infoService.GetAllMaterials();
            return Ok(blobInformation);
        }
        [HttpPost("Download")]
        public async Task<IActionResult> DownloadFile(FileMaterialContent materialContent)
        {
            FileDownloadView fileDownloadView = await _infoService.DownloadMaterial(materialContent);
            FileStreamResult streamResult = new(fileDownloadView.FileStream, fileDownloadView.ContentType)
            {
                FileDownloadName = materialContent.FileName,
            };
            return streamResult;
        }
        [HttpPut("Add")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            string fileHash = await _infoService.AddMaterial(file);
            return Ok(fileHash);
        }
        [HttpDelete("Delete")]
        public async Task<IActionResult> DeleteFile(string fileHash)
        {
            bool result = await _infoService.DeleteMaterial(fileHash);
            return Ok(result);
        }
        
    }
}
