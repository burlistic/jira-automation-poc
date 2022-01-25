// Deploys resources needed for a function app

// Parameters ----------------------------------------------------------------- 
@description('The name of the environment this resource group should represent.')
@allowed([
  'dev'
  'prd'
])
param environmentName string

@description('The azure region into which the resources should be deployed')
param location string

@description('The name of the project these resources are being provisioned for.')
@minLength(1)
@maxLength(19) // need 2 chars for 'sa' at end + 3 for env name (max length is 24 for storage account)
param projectName string


// Variables -----------------------------------------------------------------
@description('Name for function app storage account')
var storageAccountNamePrefix = replace(projectName, '-', '') // Name cannot contain '-' chars

@description('Tags for the resources')
var resourceTags = {
  environment: environmentName
}


// Resources -----------------------------------------------------------------
resource storageAccount 'Microsoft.Storage/storageAccounts@2021-06-01' = {
  name: '${storageAccountNamePrefix}sa${environmentName}'
  location: location
  tags: resourceTags
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
  }
}


// Outputs -------------------------------------------------------------------
