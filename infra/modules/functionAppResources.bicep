// Deploys resources needed for a function app

// Parameters ----------------------------------------------------------------- 
@description('The name of the environment this resource group should represent.')
@allowed([
  'dev'
  'prd'
])
param environmentName string


@description('The name of the project these resources are being provisioned for.')
@minLength(1)
@maxLength(19) // need 2 chars for 'sa' at end + 3 for env name (max length is 24 for storage account)
param projectName string

@description('Tags for the resources')
param resourceTags object

// Variables -----------------------------------------------------------------
@description('Name for function app storage account')
var storageAccountNameSuffix = replace(projectName, '-', '') // Name cannot contain '-' chars


@description('The function app runtime to use')
var functionRuntime = 'dotnet'

@description('The function app extension version to use')
var functionAppExtensionVersion = '~4'

@description('Config for function app')
var functionAppConfig = [
  {
    name: 'AzureWebJobsStorage'
    value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${listKeys(storageAccount.id, storageAccount.apiVersion).keys[0].value}'
  }
  {
    name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
    value: appInsights.properties.InstrumentationKey
  }
  {
    name: 'APPINSIGHTS_CONNECTIONSTRING'
    value: 'Instrumentationkey=${appInsights.properties.InstrumentationKey}'
  }
  {
    name: 'FUNCTIONS_EXTENSION_VERSION'
    value: functionAppExtensionVersion
  }
  {
    name: 'FUNCTIONS_WORKER_RUNTIME'
    value: functionRuntime
  }
]

// Resources -----------------------------------------------------------------
resource storageAccount 'Microsoft.Storage/storageAccounts@2021-06-01' = {
  name: 'sta${environmentName}${storageAccountNameSuffix}'
  location: resourceGroup().location
  tags: resourceTags
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: 'ains-${environmentName}-${projectName}'
  location: resourceGroup().location
  tags: resourceTags
  kind: 'web'
  properties: {
    Application_Type: 'web'
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2020-12-01' = {
  name: 'asp-${environmentName}-${projectName}'
  location: resourceGroup().location
  tags: resourceTags
  kind: 'linux'
  sku: {
    name: 'Y1' // Consumption plan SKU = 'Y1'
  }
  properties: {
    reserved: true // required for operating system to be set to 'Linux'
  }
}

resource functionApp 'Microsoft.Web/sites@2021-02-01' = {
  name: 'fa-${environmentName}-${projectName}'
  location: resourceGroup().location
  kind: 'functionapp'
  tags: resourceTags
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      appSettings: functionAppConfig
    }
  }
}


// Outputs -------------------------------------------------------------------
