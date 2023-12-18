using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Tools.Tools;
using Azure;
using Azure.Storage.Blobs.Models;

namespace AzureBlobStorageRepository
{
    public class AzureBlobRepository : IAzureBlobRepository
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly BlobContainerClient _containerClient;

        private static readonly long ONE_MEGABYTE = 1024 * 1024;
        private static readonly long FILE_SIZE_LIMIT = 10 * ONE_MEGABYTE; //10MB

        public AzureBlobRepository(IConfiguration configuration)
        {
            string connectionString = configuration["AzureBlobStorage:ConnectionString"]
                ?? throw new ArgumentNullException(nameof(connectionString), "Connection string is missing");
            string containerName = configuration["AzureBlobStorage:ContainerName"]
                ?? throw new ArgumentNullException(nameof(containerName), "Blob container name is missing");

            _blobServiceClient = new BlobServiceClient(connectionString);
            _containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            _containerClient.CreateIfNotExists();
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            if (file == null) throw new ArgumentNullException(nameof(file));
            if (file.Length > FILE_SIZE_LIMIT)
            {
                throw new CustomException.InvalidDataException($"File size larger than {FILE_SIZE_LIMIT / ONE_MEGABYTE}MB");
            }

            string blobName = $"{Guid.NewGuid()}_{file.FileName}";
            BlobClient blobClient = _containerClient.GetBlobClient(blobName);

            using (var stream = file.OpenReadStream())
            {
                await blobClient.UploadAsync(stream);
            }
            return blobName;
        }

        public async Task<Stream> DownloadFileAsync(string blobName)
        {
            BlobClient blobClient = _containerClient.GetBlobClient(blobName);

            try
            {
                return await blobClient.OpenReadAsync();
            }
            catch (RequestFailedException ex) when (ex.Status == 404)
            {
                throw new CustomException.DataNotFoundException("File not found");
            }
            catch (RequestFailedException ex)
            {
                throw new CustomException.InternalServerErrorException(ex.Message);
            }
        }
        public async Task<bool> DeleteFileAsync(string blobName)
        {
            BlobClient blob = _containerClient.GetBlobClient(blobName);
            try
            {
                var result = await blob.DeleteIfExistsAsync(snapshotsOption: DeleteSnapshotsOption.IncludeSnapshots);
                return result.Value;
            }
            catch (RequestFailedException ex) when (ex.Status == 404)
            {
                throw new CustomException.DataNotFoundException("File not found");
            }
            catch (RequestFailedException ex)
            {
                throw new CustomException.InternalServerErrorException(ex.Message);
            }
        }
    }
}
