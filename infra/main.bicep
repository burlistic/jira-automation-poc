// Deploys various Azure resources to mimick the function app I want to create and deploy

// To deploy a Resource Group the scope needs to be the subscription it is deployed into
targetScope = 'subscription'

@description('The name of the environment resources should be deployed to should represent.')
@allowed([
  'dev'
  'prd'
])
param environmentName string

@description('The azure region into which the resources should be deployed')
var location = 'australiaeast'

@description('A prefix for the resource group')
var resourceGroupNamePrefix = 'bicep-practice'

module resourceGroup 'modules/resourceGroup.bicep' = {
  name: '${resourceGroupNamePrefix}-rg-${environmentName}'
  params: {
    environmentName: environmentName
    resourceGroupLocation: location
    resourceGroupNamePrefix: resourceGroupNamePrefix
  }
}
