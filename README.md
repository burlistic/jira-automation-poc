# bicep-practice
 A repo to practice using Bicep to deploy Azure resources through the Azure CLI and GitHub actions.

 ## Folder Structure
* ***.github/***  
    * ***workflows/***
        * Contains the yaml files that GitHub Actions will look for event conditions in.  
        (used to deploy Azure Resources and Function Code)

* ***infra/*** - Azure Infrastructure
    * **main.bicep**  
        * The Bicep file used to define Azure resources to be provisioned.
    * ***modules/***  
        * Contains Bicep modules used by **main.bicep**
    * ***parameters/***
        * Contains parameter files to pass to ***main.bicep*** or other Bicep modules
    * ***az-cli-deploy/***
        * Contains a python scripts to manually deploy ***main.bicep** to my RACWA Visual Studio subscription  
            * I cannot manually create a *Service Principal* to use GitHub Actions to deploy as my RAC personal account does not have the required permissions.  
            **TODO:** Oscar said there is a repo where you can create one

* ***src/*** - Azure Function App Code
    
### Branch Protection
There are branch protection rules for branches
* main
    * PR required for merge
    * Requires successful status check on GitHub Action job, *deploy*
* dev
    * PR required for merge


### Authenticating GitHub Actions with Azure 
To deploy to Azure with GitHub actions you need to add a secret to the repository *AZURE_CREDENTIALS*. 
See https://docs.microsoft.com/en-us/azure/developer/github/connect-from-azure?tabs=azure-portal%2Cwindows#use-the-azure-login-action-with-a-service-principal-secret