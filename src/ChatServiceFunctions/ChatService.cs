using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Bicep.Practice.Services
{
    public static class ChatService
    {
        public class MessageItem
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Message { get; set; }

            public override string ToString()
            {
                return $"({Id}) - {Name} : {Message}";
            }
        }


        public class ResponseMessage
        {
            public string Message { get; set; }

            public ResponseMessage(string msg)
            {
                Message = msg;
            }

            public ResponseMessage(string msgType, string msg)
            {
                Message = String.Format("{}: {}", msgType, msg);
            }
        }


        // Fake database to store messages
        // Note that each time you debug, this will remove all stored messages.
        public static List<MessageItem> MessagesStore { get; set; } = new List<MessageItem>();


        [FunctionName("GetMessages")]
        public static IActionResult GetMessages(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "messages")] HttpRequest req,
            ILogger log)
        {
            var jsonPayload = new { messages = MessagesStore };

            log.LogInformation($"All messages sent to IP: {req.HttpContext.Connection.RemoteIpAddress} PORT: {req.HttpContext.Connection.RemotePort}");

            return new OkObjectResult(jsonPayload);
        }


        [FunctionName("CreateMessage")]
        public static IActionResult CreateMessage(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "messages")] MessageItem req,
            ILogger log)
        {
            // Check if Name and Message parameters given in body, else return bad request
            var name = req.Name;
            var message = req.Message;

            var errMsgFString = "{0} was not provided or is empty";
            var missingValue = String.Empty;

            // Check if required values given in request
            if (String.IsNullOrEmpty(name))
            {
                missingValue = nameof(name);
            }
            if (String.IsNullOrEmpty(message))
            {
                missingValue = nameof(message);
            }

            // If missing parameters in request 
            if (!String.IsNullOrEmpty(missingValue))
            {
                var errorMessage = new ResponseMessage("Error", String.Format(errMsgFString, missingValue));
                log.LogError(errorMessage.Message);

                return new BadRequestObjectResult(errorMessage);
            }

            // Assign an Id to the message
            req.Id = MessagesStore.Count() > 0 ? MessagesStore.MaxBy(m => m.Id).Id + 1 : 1;

            // Add message to MessageStore
            MessagesStore.Insert(0, req);

            var okMessage = new ResponseMessage($"Message recieved from {name}");
            log.LogInformation(okMessage.Message);

            return new OkObjectResult(okMessage);
        }


        [FunctionName("DeleteMessage")]
        public static IActionResult DeleteMessage(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "message/{id:int}")] HttpRequest req,
            ILogger log,
            int id)
        {
            // Check if valid msg ID
            if (id < 1)
            {
                var errorMessage = new ResponseMessage("Error", "Message Ids are not less than 1.");
                log.LogError(errorMessage.Message);

                return new BadRequestObjectResult(errorMessage);
            }

            // Try to retrieve msg
            var msgToDelete = MessagesStore.FirstOrDefault(m => m.Id == id);

            // Check if we could retrieve msg
            if (msgToDelete == null)
            {
                var errorMessage = new ResponseMessage("Error", "Message Id not found in MessageStore.");
                log.LogError(errorMessage.Message);

                return new BadRequestObjectResult(errorMessage);
            }

            // Delete msg
            MessagesStore.Remove(msgToDelete);

            var okMessage = new ResponseMessage($"Message with id {id} deleted.");
            log.LogInformation(okMessage.Message);

            return new OkObjectResult(okMessage);
        }
    }
}