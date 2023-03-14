import { z } from 'zod'

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// PROTOCOL SCHEMA
/////////////////////////////////////////

export const ProtocolSchema = z.object({
    id: z.string(),
    createdAt: z.coerce.date(),
    sections: z.lazy(() => SectionsSchema),
})

/////////////////////////////////////////
// REVIEWS SCHEMA
/////////////////////////////////////////

export const ReviewsSchema = z.object({
    id: z.string(),
})

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
    id: z.string(),
    email: z.string(),
    id_: z.string().nullable(),
    image: z.string().nullable(),
    lastLogin: z.coerce.date().nullable(),
    name: z.string().nullable(),
    password: z.string().nullable(),
    role: z.string(),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS SCHEMA
/////////////////////////////////////////

export const SectionsSchema = z.object({
    bibliography: z.lazy(() => BibliographySchema),
    budget: z.lazy(() => BudgetSchema),
    description: z.lazy(() => DescriptionSchema),
    duration: z.lazy(() => DurationSchema),
    identification: z.lazy(() => IdentificationSchema),
    introduction: z.lazy(() => IntroductionSchema),
    methodology: z.lazy(() => MethodologySchema),
    publication: z.lazy(() => PublicationSchema),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS BIBLIOGRAPHY SCHEMA
/////////////////////////////////////////

export const BibliographySchema = z.object({
    chart: z
        .lazy(() =>
            z.object({
                author: z.string(),
                title: z.string(),
                year: z.string(),
            })
        )
        .array(),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS BUDGET SCHEMA
/////////////////////////////////////////

export const BudgetSchema = z.object({
    expenses: z
        .lazy(() =>
            z.object({
                amount: z.string(),
                detail: z.string(),
                type: z.string(),
                year: z.string(),
            })
        )
        .array(),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS DESCRIPTION SCHEMA
/////////////////////////////////////////

export const DescriptionSchema = z.object({
    discipline: z.string(),
    field: z.string(),
    line: z.string(),
    objective: z.string(),
    type: z.string(),
    words: z.string(),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS DURATION SCHEMA
/////////////////////////////////////////

export const DurationSchema = z.object({
    duration: z.string(),
    modality: z.string(),
    chronogram: z
        .lazy(() =>
            z.object({
                semester: z.string(),
                task: z.string(),
            })
        )
        .array(),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS IDENTIFICATION SCHEMA
/////////////////////////////////////////

export const IdentificationSchema = z.object({
    assignment: z.string(),
    career: z.string(),
    sponsor: z.string(),
    title: z.string(),
    team: z
        .lazy(() =>
            z.object({
                hours: z.string(),
                last_name: z.string(),
                name: z.string(),
                role: z.string(),
            })
        )
        .array(),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS INTRODUCTION SCHEMA
/////////////////////////////////////////

export const IntroductionSchema = z.object({
    justification: z.string(),
    objectives: z.string(),
    problem: z.string(),
    state: z.string(),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS METHODOLOGY SCHEMA
/////////////////////////////////////////

export const MethodologySchema = z.object({
    analysis: z.string(),
    considerations: z.string(),
    design: z.string(),
    instruments: z.string(),
    participants: z.string(),
    place: z.string(),
    procedures: z.string(),
    type: z.string(),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS PUBLICATION SCHEMA
/////////////////////////////////////////

export const PublicationSchema = z.object({
    plan: z.string(),
    result: z.string(),
})
