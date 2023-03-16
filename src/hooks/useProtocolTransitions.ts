import React from 'react'

const createStateMachine = () => {
   return null
}

const PUBLISH = (currentProtocolState: string) => {
   //validate if the protocol is on draft state & have all the mandatory fields. Also check if the role is researcher
   //If not, return an error
   //If yes, change the state to methodological_evaluation - not_assigned
   // Machine.send({ type: "PUBLISH" }).
}

const ASSIGN_METODOLOGIST = () => {
   //validate if the protocol is on methodological_evaluation state and have zero or one metodologist assigned. Also check if the role is research_secretary
}

const ASSIGN_SCIENTIST = () => {
   //validate if the protocol is on scientific_evaluation state and have zero or one scientist assigned. Also check if the role is research_secretary
}

const COMMENT_METODOLOGY = () => {
   //validate if the protocol is on methodological_evaluation state and have one metodologist assigned. Also check if the role is metodologist
}

const COMMENT_SCIENCE = () => {
   //validate if the protocol is on scientific_evaluation state and have one scientist assigned. Also check if the role is scientist
}

const CORRECT_METODOLOGY = () => {
   //validate if the protocol is on methodological_evaluation state and have one metodologist assigned and also at least one comment. Also check if the role is researcher
}

const CORRECT_SCIENCE = () => {
   //validate if the protocol is on scientific_evaluation state and have one scientist assigned and also at least one comment. Also check if the role is researcher
}

const REASSIGN_METODOLOGIST = () => {
   //validate if the protocol is on methodological_evaluation state and have one metodologist assigned. Also check if the role is research_secretary
}

const REASSIGN_SCIENTIST = () => {
   //validate if the protocol is on scientific_evaluation state and have one scientist assigned. Also check if the role is research_secretary
}

const APPROVE = () => {
   //validate if the protocol is on methodological_evaluation state and have one metodologist assigned. Also check if the role is research_secretary
}

const ACCEPT = () => {
   //validate if the protocol is on approved state and have one scientist assigned. Also check if the role is research_secretary
}

export { PUBLISH, ASSIGN_METODOLOGIST, ASSIGN_SCIENTIST, COMMENT_METODOLOGY, COMMENT_SCIENCE, CORRECT_METODOLOGY, CORRECT_SCIENCE, REASSIGN_METODOLOGIST, REASSIGN_SCIENTIST, APPROVE, ACCEPT }


