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
var projectName = 'bicep-practice'


// Resources -----------------------------------------------------------------
resource resourceGroup 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: '${projectName}-rg-${environmentName}'
  location: location
  tags: {
    environment: environmentName
  }
}

module functionAppResources 'modules/functionAppResources.bicep' = {
  scope: resourceGroup
  name: 'functionAppResources-${environmentName}' 
  params: {
    environmentName: environmentName
    location: location
    projectName: projectName
  }
}

// Outputs -------------------------------------------------------------------


