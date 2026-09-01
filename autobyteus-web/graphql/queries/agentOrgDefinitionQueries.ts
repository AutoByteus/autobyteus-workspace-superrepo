import { gql } from 'graphql-tag'
export const GetAgentOrgDefinitions = gql`
  query GetAgentOrgDefinitions {
    agentOrgDefinitions {
      id name description instructions category avatarUrl revision
      handoffs { from to rules }
      members { memberName ref refType refScope }
      defaultLaunchConfig { llmModelIdentifier runtimeKind llmConfig }
    }
  }
`
export const GetAgentOrgEndpointCatalog = gql`
  query GetAgentOrgEndpointCatalog($id: String!) {
    agentOrgEndpointCatalog(id: $id) {
      from { kind address memberName definitionId coordinatorAddress coordinatorMemberName }
      to { kind address memberName definitionId coordinatorAddress coordinatorMemberName }
    }
  }
`
