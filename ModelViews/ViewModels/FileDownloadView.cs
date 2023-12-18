namespace ModelViews.ViewModels
{
    public class FileDownloadView
    {
        public required string FileName { get; set; }
        public required string ContentType { get; set; }
        public required Stream FileStream { get; set; }
    }
}
