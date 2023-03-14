import { on } from "events";
import { createMachine } from "xstate";

export const protocolMachine = createMachine({
   /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7ALugxugNgHQSoCGAZpgMQAKAqgEIAyAkgMoASA2gAwC6iFOlgBLTCPQA7QSAAeiAIwBmBYQBMSgCxKAnAHYArDzUKAbAA4lBgDQgAnop1rCCtZp06Dm14fNqAvv62aFi4BIQAtmCYABboEAToUCI4pPgA+mAAbmkArqTiUlQAgjQ0AEoA8gBqAKK8AkggyMJiEtJN8gg+eoTmBjpKpgZGapYG5rYO3U4uakY82iYK+ubmgcEY2HhEUbHxicmpGdl5Be2EkljppLCiUJKQJWxsLADiAHINMi2ihR2gLraHRzUZ6EymHTDTRTRQGUyECZKJRqNQ8HjghQGBQbZpbMK7aJxBL4JIpNKZHL4fL-Qi3e6PCBUADClQAsmzah8ACrfJq-NpSGRdCxKQh6LS6YzzAyGHSwhBqPSqPTuHTmTEjLw8JS4kLbcJ7YmHcknKk0i54CJRSSYJ6s8rlWrM7m1AAifKEf3awsQUN6Xgs2NV6r8agVSpVao1Ji1mh1evxO0iRIOpKOFNO1POUkIeFQqDAODtTKdxRe7y+-B+rX+voQ6s0hClspUCh4Rj0egVWJ4hA8HnMOnjSkWI1MidCydgOBEYFtInIKUpZ3+JTKVTqnuatZ9nUUGIRAyU4I0PFMVn0CtMEr6IfhflMmhjk4NRBnc4XS5wK+ztKumA3HcIgPE85avJ824CnW+6KiefTHoYCiuIsniTPYiAXuYzbImowymIs57uK+BKEB+87iN+v4Wrm9IgYyLLspyPJQbuQqwc+ziaBYhiIQYujhhhCCGGKaqDDw5iuCO6xBHiU7hORX7LlmNGSHm6DWhR9qVI6zquh61b8mxAJyIgeimAiYxSd4GpmJo3ZCSJhBiaOkluDqMmbPJ76zhRi7KeaOZqfmhbFk8ZYVpBhleoKJldHolhzO4wxeF2OgYteKLimqKIDkO-EkcmpDICEWRgcyzK1DQ+msd67GAooyJiuebjmaYaLDuZ163hq7gPnhz4SoEslXBAcA-EmBA1nVcWIAAtPKQlzW4hDomt60bXohXhCQFCYNNsX1pognTCszjtWqXg+BMASyfqpFGmmZLHNRQUHTBDWKvG6j4QYJioViliZYi61DDwHgXbqd2TYS+wks9maBf+1x0aBEDvXun1jNheHwn97buIDSg9rKq2WCiaIYrG57bbDxrpqar20qjjIY-VpkICM2H9IM-qA1iJO9BJuGU5qNPQ95KZwyaL0qUF6mabakBs7NCCPn0VmooYwxODYQlKs4biDpqIwjrTUv0wjZqrpa6AFkWJYq-WyGov2A6GNjJ7qiTIJIhT6JixOEtvmRvlKT+csfTuM31roCpeAY6jRmM8ayuD5uKZRAU27mAFAQyytGTHsEapl3O4fhhFPjoGdh1nEdIxcLOFzFUddFYAaDCJ2KDEoGp69MWF9BX8JV8RwekZn-kNznwUaTajtF4dsHtYn8JGxK5kePCCpOQO4ludJtefvXTO2-bYXo0vbd+iY4qSje4Lwu1DmD94OEopX8bV+bxWlS30dl6fVcO2RE3FzCmCkrKAixMhI3ibCePqFgBoaihl5EOUgoDoBEJIKATtYKyh7IsJs+8BqILRDJQIQA */
   id: "protocol",
   initial: "draft",
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
