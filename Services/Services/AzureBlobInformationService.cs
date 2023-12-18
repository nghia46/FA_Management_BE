using AutoMapper;
using AzureBlobStorageRepository;
using Microsoft.AspNetCore.Http;
using Models.Models;
using ModelViews.ViewModels;
using Repository.Interface;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Tools.Tools;

namespace Services.Services
{
    public class AzureBlobInformationService : IAzureBlobInformationService
    {
        private readonly IRepository<AzureBlobInformation> _fileInfoRepo;
        private readonly IMapper _mapper;
        private readonly IAzureBlobRepository _azureBlobRepo;

        public AzureBlobInformationService(IRepository<AzureBlobInformation> fileInfoRepo, IMapper mapper, IAzureBlobRepository azureBlobRepo)
        {
            _fileInfoRepo = fileInfoRepo;
            _mapper = mapper;
            _azureBlobRepo = azureBlobRepo;
        }

        public async Task<IEnumerable<AzureBlobInformation>> GetAllMaterials()
        {
            return await _fileInfoRepo.GetAllAsync();
        }
        public async Task<string> AddMaterial(IFormFile file)
        {

            string fileHash = string.Empty;
            using (Stream fileStream = file.OpenReadStream())
            {
                using SHA256 sha256 = SHA256.Create();
                byte[] hashedBytes = sha256.ComputeHash(fileStream);
                StringBuilder builder = new();
                for (int i = 0; i < hashedBytes.Length; i++)
                {
                    builder.Append(hashedBytes[i].ToString("x2"));
                }
                fileHash = builder.ToString();
            };
            IEnumerable<AzureBlobInformation> blobInfo = await _fileInfoRepo.GetByFilterAsync(b => b.SHA256.Equals(fileHash));
            if (!blobInfo.Any())
            {
                string blobName = await _azureBlobRepo.UploadFileAsync(file);
                AzureBlobInformation newBlobInfo = new()
                {
                    BlobStorageName = blobName,
                    ContentType = file.ContentType,
                    SHA256 = fileHash
                };
                await _fileInfoRepo.AddOneItem(newBlobInfo);
            }
            return fileHash;
        }
        public async Task<FileDownloadView> DownloadMaterial(FileMaterialContent fileMaterial)
        {
            IEnumerable<AzureBlobInformation> blobInfoList = await _fileInfoRepo.GetByFilterAsync(b=>b.SHA256.Equals(fileMaterial.FileHash));
            if (!blobInfoList.Any())
            {
                throw new CustomException.DataNotFoundException("File not found");
            }
            AzureBlobInformation blobInfo = blobInfoList.Single();
            Stream fileStream = await _azureBlobRepo.DownloadFileAsync(blobInfo.BlobStorageName);
            FileDownloadView fileDownloadView = new()
            {
                FileName = fileMaterial.FileName,
                ContentType = blobInfo.ContentType,
                FileStream = fileStream
            };
            return fileDownloadView;
        }

        public async Task<bool> DeleteMaterial(string fileHash)
        {
            IEnumerable<AzureBlobInformation> blobInfoList = await _fileInfoRepo.GetByFilterAsync(b => b.SHA256.Equals(fileHash));
            if (!blobInfoList.Any())
            {
                throw new CustomException.DataNotFoundException("File not found");
            }
            AzureBlobInformation blobInfo = blobInfoList.Single();
            bool isInfoDeleted=await _fileInfoRepo.RemoveItemByValue(fileHash);
            bool isFileDeleted=await _azureBlobRepo.DeleteFileAsync(blobInfo.BlobStorageName);
            return isFileDeleted&&isInfoDeleted;
        }
    }
}
