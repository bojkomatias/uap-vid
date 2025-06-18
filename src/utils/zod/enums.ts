import { z } from 'zod'

/////////////////////////////////////////
// SHARED ENUMS
/////////////////////////////////////////

export const RoleSchema = z.enum([
  'RESEARCHER',
  'SECRETARY',
  'METHODOLOGIST',
  'SCIENTIST',
  'ADMIN',
])

export const ProtocolStateSchema = z.enum([
  'DRAFT',
  'PUBLISHED',
  'METHODOLOGICAL_EVALUATION',
  'SCIENTIFIC_EVALUATION',
  'ACCEPTED',
  'ON_GOING',
  'DELETED',
  'DISCONTINUED',
  'FINISHED',
])

export const ReviewTypeSchema = z.enum([
  'METHODOLOGICAL',
  'SCIENTIFIC_INTERNAL',
  'SCIENTIFIC_EXTERNAL',
])

export const ReviewVerdictSchema = z.enum(['APPROVED', 'REJECTED', 'PENDING'])

// Commented out schemas for future reference
// const ActionSchema = z.enum([
//     'CREATE',
//     'EDIT',
//     'EDIT_BY_OWNER',
//     'PUBLISH',
//     'ASSIGN_TO_METHODOLOGIST',
//     'ASSIGN_TO_SCIENTIFIC',
//     'REVIEW',
//     'ACCEPT', //This action is made by the secretary. Accept the protocol to be evalualuated by the VID committee
//     'APPROVE', //This approval is made by the admin and approve the protocol and mark it as ON_GOING
//     'DISCONTINUE',
//     'FINISH',
//     'DELETE',
//     'GENERATE_ANUAL_BUDGET',
//     'VIEW_ANUAL_BUDGET',
// ])

// const AccessSchema = z.enum([
//     'PROTOCOLS',
//     'USERS',
//     'EVALUATORS',
//     'REVIEWS',
//     'CONVOCATORIES',
//     'ACADEMIC_UNITS',
//     'TEAM_MEMBERS',
//     'MEMBER_CATEGORIES',
//     'ANUAL_BUDGETS',
// ])
