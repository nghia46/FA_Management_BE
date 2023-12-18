using Microsoft.AspNetCore.Http;
namespace AzureBlobStorageRepository
{
    public interface IAzureBlobRepository
    {
        Task<string> UploadFileAsync(IFormFile file);
        Task<Stream> DownloadFileAsync(string blobName);
        Task<bool> DeleteFileAsync(string blobName);
    }
}
