import { createMachine } from "xstate";

export const protocolMachine = createMachine({
   id: "protocol",
   initial: "draft",
   context: {
      rol: "user",
   },
   states: {
      draft: {
         on: {
            PUBLISH: "methodological_evaluation",
         },
      },
      methodological_evaluation: {
         id: "methodological_evaluation",
         initial: "not_assigned",
         states: {
            not_assigned: {
               on: {
                  ASSIGN: "assigned",
               },
            },
            assigned: {
               on: {
                  COMMENT: "commented",
                  ASSIGN: "assigned",
               },
            },
            commented: {
               on: {
                  CORRECTED: "corrected",
               },
            },
            corrected: {
               on: {
                  REASSIGN: "assigned",
               },
            },
         },
         on: {
            APPROVE: [{
               target: "scientific_evaluation",
               in: "#protocol.methodological_evaluation.assigned"
            }]

         }
      },
      scientific_evaluation: {
         id: "scientific_evaluation",
         initial: "not_assigned",
         states: {
            not_assigned: {
               on: {
                  ASSIGN: "assigned",
               },
            },
            assigned: {
               on: {
                  COMMENT: "commented",
                  ASSIGN: "assigned",
               },
            },
            commented: {
               on: {
                  CORRECTED: "corrected",
               },
            },
            corrected: {
               on: {
                  REASSIGN: "assigned",
               },
            },
         },
         on: {
            APPROVE: [{
               target: "approved",
               in: "#scientific_evaluation.assigned"
            }]
         }
      },
      approved: {
         id: "approved",
         on: {
            ACCEPTED: "ongoing",
         },
      },
      ongoing: {

      },

   }
});
