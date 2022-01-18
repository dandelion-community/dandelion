/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AttributionCardQuery
// ====================================================

export interface AttributionCardQuery_attributions {
  __typename: "Attribution";
  icon: string;
  text: string;
}

export interface AttributionCardQuery {
  attributions: (AttributionCardQuery_attributions | null)[] | null;
}
