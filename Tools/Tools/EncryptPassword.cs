using System.Security.Cryptography;

namespace Tools.Tools;

public class EncryptPassword
{
    public static string Encrypt(string text)
    {
        SHA512 sha512 = SHA512.Create();
        byte[] input = System.Text.Encoding.ASCII.GetBytes(text);
        byte[] hashBytes = sha512.ComputeHash(input);
        return Convert.ToHexString(hashBytes);
    }
    
}