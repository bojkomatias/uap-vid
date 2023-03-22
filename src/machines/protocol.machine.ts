import { createMachine } from "xstate";

export const protocolMachine = createMachine({
   /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7ALugxugNgHQSoCGAZpgMQAKAqgEIAyAkgMoASA2gAwC6iFOlgBLTCPQA7QSAAeiAIwBmBYQBMSgCxKAHDx4BONWoCsagOwAaEAE9FRwgrWaDBniaWndxgL4-raFi4BIQAtmCYABboEAToUCI4pPgA+mAAbskArqTiUlQAgjQ0AEoA8gBqAKK8AkggyMJiEtL18ghO5uaEOiZGBuYKJuaaLgBs1nYdDk4ubh5eOr7+DRjYeEThUTFxCUmpGdm5LYSSWCmksKJQkpCFbGwsAOIAcrUyjaJ5raDt2gaOZwGTQ6HTzQaTRCmMaETQKMZjXomPR9AxjPwBNbBTYRaKxfDxRLJNKZfA5b6ES7XW4QKgAYTKAFlGVUXgAVd71T7NKQydqIpSEcxaJQmMbItTwkGQhAWVTmEz6fRqMFmMbmDGrIIbMK4nYEvbEw5k45SSlXEQ3O4FB7PN78D5Nb58xBi1SaNRoszCsZKdUGGVqHg6QgI9WGAzwsY8JQxzWBdYhLZ43ZEg6k8knPChcKSTB3BklEpVOlsqoAEU5Qi+LRdCDR3RMmkRziUsYUQyUgcGQsVSpVBjVGpWCexuu2+MJ+xJRwpeFQqDAOHztOLNseryrDSdtbaiAMOk0hCU810XVj5jGChlQ1USv00Z4HY0BnjWJ1sBwIjAeZE5ESM4mt8hTFOU1Rbtyzp7h0PCXoQfRKOYwZdMMuiaDK6qCjoIyuDoYwaJ4wZvtqISft+v7-jggGZmaZyYBcFpWrS652hBO68tBGjdL0Bh+u4wY8ToMrCiGUYIpoMZ6J46Iju+pFfj+4iUdRpqSOa1IFkyLLsmxNYcb8iAgmosKIpeSz6JoHgTLYiAKoKfb6DougxoYmjEYmRBkYpf4AcaNFqVSlo0vcG72nU1Y8j8ciIHxjhjBJ8Wis2YpWDZCBjG4sJRsiIw8IiCLuWOXkUb5GaqYQ2a5iu9JlEWJZlpWDpcuxUXtJeMIqk4orAoePAesJHjwfeTlSa5hUfgpJVUX55Xzouy53Gutqbk1EVQQZCDmE5gIuIqJ7KPFAZpb6xkKvoCgSZGbgFbJJFEKQyCBOk1p0nSVQ0A1umRXWyhtoQeXOOeCigltQnHcKPQ4Qe+FtkGOh+CsZwQHAHxyfgjp6a1iAALRHVM2POP997E-ew6YndxBkJQGPfdB-VpQoDj4YqnTDCYioeuNSZ6pOhrprOu5rYL0WyhJ6jisiI0KIMHYmBhgpzAesEKk2AxubdHnjimBppipFJ0QxGkQDT60iyqIZqBLoK6NLHZDIGYqEJG4Zbe4V7AyYXM4hOqbTjNFKBUxJvC+07Mhjxbb6AqbiXoG8VxQiB4uFoyFe1r+pTkaZVzugOaKZAwf6SLSwwksOgdpZPGSteaUWMZpjKqYF0eKqafJhnfN61m6ALkuK6F1jHROMZriuB2V7Rm26G1wioZhknvESdhafFUppUC0XkEhzFeOupZ6hzKCeG+p46vk5rq8+dN2cnAbgc0gPdbYcJuhz+JwPKDwQaexrRWTWv18N4BUYg-ZqmM6yikbLxEY8JgSM19HLNKIwTBOyjJoYU0sXDLHPn-ciACu5mkqvnY2YDaYbWZvBZmlsgwegjANQUo9oZDDMAMNQK9-5XwIWpOafcC6kNNu0Iw8oRQaA0NoYwahhIgiyuGcUh5GYXTTg9J6fChZF3aE4BQPB4LNl6JbBBAxUpTHVEeRCio4YgjbCoNOUgoDoBEJIKAj9oLDBvH1I8jC0SDhlmYBGPggA */
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
