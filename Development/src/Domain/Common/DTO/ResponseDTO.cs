namespace Domain.Common
{
    public class ResponseDTO<T>
    {
        public bool Success { get; private set; }
        public bool Error => !Success;
        public string Message { get; set; } = "";
        public T Data { get; set; } = default!;

        public ResponseDTO(bool success, string message, T data = default!)
        {
            Success = success;
            Message = message;
            Data = data;
        }
    }


    public static class ResultDTO
    {
        public static ResponseDTO<T> Success<T>(T data = default!, string message = "")
        {
            return new ResponseDTO<T>(true, message, data);
        }

        public static ResponseDTO<T> Error<T>(string message)
        {
            return new ResponseDTO<T>(false, message);
        }
    }
}
