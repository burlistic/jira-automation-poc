using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace PracticeFunctions
{
    public class EchoEnvironmentResponse
    {
        public string Message { get; set; }
        public string Environment { get; set; }

        public EchoEnvironmentResponse(string environment)
        {
            Message = String.Format("This response was sent from the '{0}' environment.", environment);
            Environment = environment;
        }
    }

    public static class PracticeFunctions
    {
        [FunctionName("EchoEnvironment")]
        public static IActionResult EchoEnvironment(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "environment")] HttpRequest req,
            ILogger log)
        {
            // Could try and use executionEnvironment to progromatically set name
            log.LogInformation("EchoEnvironment Function processed a request."); 

            var echoEnvironmentResponse = new EchoEnvironmentResponse(GetEnvironmentVariable("ENVIRONMENT_NAME"));
            return new OkObjectResult(echoEnvironmentResponse);

        }

        private static string GetEnvironmentVariable(string name)
        {
            return System.Environment.GetEnvironmentVariable(name, EnvironmentVariableTarget.Process);
        }
    }
}
