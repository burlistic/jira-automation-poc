using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Bicep.Practice.Services
{
    public static class ChatService
    {
        public class MessageItem
        {
            public int    Id      { get; set; }
            public string Name    { get; set; }
            public string Message { get; set; }

            public string ToString()
            {
                return $"({Id}) - {Name} : {Message}";
            }
        }

        // Fake database to store messages
        // Note that each time you debug, this will remove all stored messages.
        public static List<MessageItem> MessagesStore { get; set; } = new List<MessageItem>();


        [FunctionName("GetMessages")]
        public static async Task<IActionResult> GetMessages(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "messages")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation($"All messages sent to IP: {req.HttpContext.Connection.RemoteIpAddress} PORT: {req.HttpContext.Connection.RemotePort}");
            
            // original return payload (strings)
            // return new OkObjectResult(new { messages = MessagesStore.Select(m => m.ToString()) });

            // return objects in payload for frontend
            return new OkObjectResult(new { messages = MessagesStore});
        }


        [FunctionName("CreateMessage")]
        public static async Task<IActionResult> CreateMessage(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "messages")] MessageItem req,
            ILogger log)
        {
            // Check if Name and Message parameters given in body, else return bad request
            var name    = req.Name;
            var message = req.Message;
            
            var errMsgFString = "{0} was not provided or is empty";
            var missingValue  = String.Empty;

            if (String.IsNullOrEmpty(name))    missingValue = nameof(name);
            if (String.IsNullOrEmpty(message)) missingValue = nameof(message);

            if (!String.IsNullOrEmpty(missingValue))
            {
                var response = new BadRequestObjectResult(
                    new { errorMessage = String.Format(errMsgFString, missingValue) }
                );
                log.LogInformation(response.Value.ToString());

                return response;
            }

            // Assign an Id to the message
            req.Id = MessagesStore.Count() > 0 ? MessagesStore.MaxBy(m => m.Id).Id + 1 : 1;

            // Add message to MessageStore
            MessagesStore.Insert(0, req);
            log.LogInformation($"Message added to MessagesStore.\nId: {req.Id}\tSender: {name}\tMessage: {message}");

            // Return 200 response, message recieved
            return new OkObjectResult(new { msg = $"Message recieved from {name}" });
        }


        [FunctionName("DeleteMessage")]
        public static async Task<IActionResult> DeleteMessage(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "message/{id:int}")] HttpRequest req,
            ILogger log,
            int id)
        {
            if (id < 1) return new BadRequestObjectResult(new { errMsg = "Message Ids are not less than 1."});

            var msgToDelete = MessagesStore.FirstOrDefault(m => m.Id == id);

            if (msgToDelete == null) return new BadRequestObjectResult( new { errMsg = "Message Id not found in MessageStore."});
            
            MessagesStore.Remove(msgToDelete);

            return new OkObjectResult(new { msg = $"Message with id-{id} deleted."});
        }
    }
}