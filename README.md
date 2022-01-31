# cicd-practice 🤖
 A repo to practice CI/CD 🤖 with Azure Functions ⚡️, Bicep 💪 and Github Actions 🚀.

 ## Project Board 📋
https://github.com/thomas-cleary/cicd-practice/projects/1

## Git Workflow 🧬
Using Gitflow as of this PR https://github.com/thomas-cleary/cicd-practice/pull/36 (previously wasn't merging main back into dev)

## Folder Structure 🗂
* ***.devcontainer/*** 🐳
    * Contains docker container config to run on linux.  
    **Cannot debug Azure Function in macOS VSCode.**
        * Debugger does not attach properly to Function App
    <br><br>

* ***.github/*** 🐙
    * ***workflows/***
        * Contains the yaml files that GitHub Actions will look for event conditions in.  
        (used to deploy Azure Resources and Function Code)
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
            **TODO:** Oscar said there is a repo where you can create
    <br><br>

* ***src/*** ⚡️
    * ToDoService/
        * Azure functions for a simple ToDo list API
        **(not implemented yet)**
    <br><br>

* ***testing/*** ✅
    * Contains files for testing:
        * **Postman collection** - for Function App HTTP endpoints
    <br><br>
    
### Branch Protection 👮‍♀️
There are branch protection rules for branches
* main
    * PR required for merge
    * Requires successful status check on GitHub Action jobs:
        * *deploy-infra*
        * *deploy-functions*
* dev
    * PR required for merge


### Authenticating GitHub Actions with Azure 🔑
To deploy to Azure with GitHub actions you need to add a secret to the repository *AZURE_CREDENTIALS*. 
See https://docs.microsoft.com/en-us/azure/developer/github/connect-from-azure?tabs=azure-portal%2Cwindows#use-the-azure-login-action-with-a-service-principal-secret