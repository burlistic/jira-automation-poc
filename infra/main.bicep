// Deploys various Azure resources to mimick the function app I want to create and deploy

// To deploy a Resource Group the scope needs to be the subscription it is deployed into
targetScope = 'subscription'

// Parameters ----------------------------------------------------------------
@description('The name of the environment resources should be deployed to should represent.')
@allowed([
  'dev'
  'prd'
])
param environmentName string

// Variables -----------------------------------------------------------------
@description('The azure region into which the resources should be deployed')
var location = 'australiaeast'

@description('A prefix for the resource group')
var projectName = 'jira-automation-poc'

@description('Tags to apply to resources in this deployment')
var resourceTags = {
  environment: environmentName
  location: location
  project: projectName
}

// Resources -----------------------------------------------------------------
resource resourceGroup 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${environmentName}-${projectName}'
  location: location
  tags: resourceTags
}

module functionAppResources 'modules/functionAppResources.bicep' = {
  scope: resourceGroup
  name: 'functionAppResources-${environmentName}'
  params: {
    environmentName: environmentName
    projectName: projectName
    resourceTags: resourceTags
  }
}

// Outputs -------------------------------------------------------------------
