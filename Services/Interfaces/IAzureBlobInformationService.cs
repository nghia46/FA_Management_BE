using Microsoft.AspNetCore.Http;
using Models.Models;
using ModelViews.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
	public interface IAzureBlobInformationService
	{
        Task<IEnumerable<AzureBlobInformation>> GetAllMaterials();
        Task<string> AddMaterial(IFormFile file);
        Task<FileDownloadView> DownloadMaterial(FileMaterialContent file);
        Task<bool> DeleteMaterial(string fileHash);
	}
}
