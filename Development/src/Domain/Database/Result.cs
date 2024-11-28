namespace Domain.Database
{
    public class Result
    {
        public bool Success { get; private set; }
        public bool Error => !Success;
        public string Message { get; set; } = "";

        private Result(bool isSuccessful, string message = "")
        {
            Success = isSuccessful;
            Message = message;
        }

        public static Result Good(string message = "")
        {
            return new Result(true, message);
        }


        public static Result Bad(string message = "")
        {
            return new Result(false, message);
        }
    }
}