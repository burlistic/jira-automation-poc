# jira-automation-poc 🤖

### A PoC repo to test out JIRA automation for creating Change Request and fixed versions with issues tagging. Uses Azure Functions ⚡️, Bicep 💪 and Github Actions 🚀.  

<!--- ### Demo 🕹
* https://burlistic.github.io/jira-automation-poc/

    * Simple frontend to call the ***/environments*** endpoint of the Function App
        * Hosted with GitHub Pages 📄 -->

## Version Tagging 🏷
* External action looks for these substrings in commit messages to decide how to bump the main branch release version:
    * #none - no bump
    * #patch - bump to version x.x.+1
    * #minor - bump to version x.+1.0
    * #major - bump to version +1.0.0

## Folder Structure 🗂
* ***.devcontainer/*** 🐳
    * Contains docker container config to run on linux.  
    **Cannot debug Azure Function in macOS VSCode.**
        * Debugger does not attach properly to Function App
    <br><br>

* ***.github/*** 🐙
    * ***actions/***
        * Contains composite actions that workflows use to deploy infra and src
    * ***workflows/***
        * Contains the yaml files that GitHub Actions will look for event conditions in:
            * Deploy infra and src
            * Build and test dotnet project in src
            * Bump release version if push is to main branch
    <br><br>

* ***infra/*** 🧱
    * **main.bicep**  
        * The Bicep file used to define Azure resources to be provisioned.
    * ***modules/***  
        * Contains Bicep modules used by **main.bicep**
    * ***parameters/***
        * Contains parameter files to pass to ***main.bicep*** or other Bicep modules
    * ***az-cli-deploy/***
        * Contains a python scripts to manually deploy **main.bicep** to my RACWA Visual Studio subscription  
            * I cannot manually create a *Service Principal* to use GitHub Actions to deploy as my RAC personal account does not have the required permissions.  
    <br><br>

* ***src/*** ⚡️
    * ***PracticeFunctions/***
        * Azure functions project containing a single, simple function:
            * EchoEnvironment() - returns a message stating which deployment environment the request was sent to
    <br><br>

* ***tests/*** ✅❌
    * ***PracticeFunctions.UnitTests/***
        * Contains the Nunit project to run unit tests for the src/PracticeFunctions project
    * ***postman-collections/***
        * Contains a Postman collection to test local, dev and prd environments
    <br><br>
    
## Branch Protection 👮‍♀️
There are branch protection rules for branches
* ***main*** 👑
    * **PR required for merge**
    * Requires successful status check on GitHub Action jobs:
        * *build-and-test*
        * Originally had infra and function deployment as well but some pushes to main won't trigger those workflows
* ***dev*** 🧑‍💻
    * **Cannot be deleted**
        * Originally had more protections but these were removed when work was finished


## Authenticating GitHub Actions with Azure 🔐
To deploy to Azure with GitHub actions you need to add a secret to the repository *AZURE_CREDENTIALS*. 
See https://docs.microsoft.com/en-us/azure/developer/github/connect-from-azure?tabs=azure-portal%2Cwindows#use-the-azure-login-action-with-a-service-principal-secret