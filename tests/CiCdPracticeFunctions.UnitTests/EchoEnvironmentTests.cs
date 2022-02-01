using CiCd.Practice;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NUnit.Framework;
using System.Net;

namespace CiCdPracticeFunctions.UnitTests
{
    [TestFixture] 
    public class EchoEnvironmentTests
    {
        private readonly ILogger logger = TestFactory.CreateLogger();

        [Test]
        public void EchoEnvironment_WhenCalled_ShouldReturnOkStatusCode()
        {
            // Arrange
            var request = TestFactory.CreateHttpRequest();
            var expectedResponseCode = (int) HttpStatusCode.OK;
        
            // Act
            var response = PracticeFunctions.EchoEnvironment(request, logger) as ObjectResult;

            // Assert
            Assert.That(expectedResponseCode, Is.EqualTo(response?.StatusCode));
        }

        [Test]
        public void EchoEnvironment_WhenCalled_ShouldReturnObjectResult()
        {
            // Arrange
            var request = TestFactory.CreateHttpRequest();
        
            // Act
            var response = PracticeFunctions.EchoEnvironment(request, logger) as ObjectResult;

            // Assert
            Assert.That(response, Is.Not.Null);
        }
    }
}