// Deploys a Resource Group to a selected Azure Subscription
// Version 1.0.0
// Last updated - 24 Jan 2022
targetScope = 'subscription'

@description('The name of the environment this resource group should represent.')
@allowed([
  'dev'
  'prd'
])
param environmentName string

@description('A prefix for the resource group name <prefix-rg> (At most 58 chars to fit length limit)')
@minLength(1)
@maxLength(58) // 64 - length(rgNameSuffix)
param resourceGroupNamePrefix string

@description('The azure region into which the ResourceGroup should be deployed')
@allowed([
  'australiaeast'
  'australiasoutheast'
])
param resourceGroupLocation string



@description('A suffix for the resource group name <rgNamePrefix-rgNameSuffix>')
var resourceGroupAcronym = 'rg'

resource resourceGroup 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: '${resourceGroupNamePrefix}-${resourceGroupAcronym}-${environmentName}'
  location: resourceGroupLocation
  tags: {
    environment: environmentName
  }
}
