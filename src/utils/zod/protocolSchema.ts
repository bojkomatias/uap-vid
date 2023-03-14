import { z } from 'zod'

const IdentificationSchema = z.object({
    assignment: z.string(),
    career: z.string().min(1, { message: 'Este campo no puede estar vacío' }),
    sponsor: z.string(),
    title: z
        .string()
        .min(6, { message: 'El titulo debe tener mínimo 6 caracteres' }),
    team: z
        .object({
            hours: z.string(),
            last_name: z
                .string()
                .min(1, { message: 'Este campo no puede estar vacío' }),
            name: z
                .string()
                .min(1, { message: 'Este campo no puede estar vacío' }),
            role: z
                .string()
                .min(1, { message: 'Este campo no puede estar vacío' }),
        })
        .array(),
})

const DurationSchema = z.object({
    duration: z.string(),
    modality: z.string(),
    chronogram: z
        .object({
            semester: z.string(),
            task: z.string(),
        })
        .array(),
})

const BudgetSchema = z.object({
    expenses: z
        .object({
            amount: z.string(),
            detail: z
                .string()
                .min(1, { message: 'Este campo no debe estar vacío' }),
            type: z
                .string()
                .min(1, { message: 'Este campo no debe estar vacío' }),
            year: z.string(),
        })
        .array(),
})

const DescriptionSchema = z.object({
    discipline: z.string(),
    field: z.string(),
    line: z.string(),
    objective: z.string(),
    type: z.string(),
    words: z.string(),
})

const IntroductionSchema = z.object({
    justification: z.string(),
    objectives: z.string(),
    problem: z.string(),
    state: z.string(),
})

const MethodologySchema = z.object({
    analysis: z.string(),
    considerations: z.string(),
    design: z.string(),
    instruments: z.string(),
    participants: z.string(),
    place: z.string(),
    procedures: z.string(),
    type: z.string(),
})

const PublicationSchema = z.object({
    plan: z.string(),
    result: z.string(),
})

const BibliographySchema = z.object({
    chart: z
        .object({
            author: z
                .string()
                .min(1, { message: 'Este campo no debe estar vacío' }),
            title: z
                .string()
                .min(1, { message: 'Este campo no debe estar vacío' }),
            year: z.string(),
        })
        .array(),
})

const SectionsSchema = z.object({
    identification: IdentificationSchema,
    duration: DurationSchema,
    budget: BudgetSchema,
    description: DescriptionSchema,
    introduction: IntroductionSchema,
    methodology: MethodologySchema,
    publication: PublicationSchema,
    bibliography: BibliographySchema,
})

export const protocolSchema = z.object({
    id: z.string(),
    createdAt: z.number(),
    sections: SectionsSchema,
})

export type protocol = z.infer<typeof protocolSchema>

export default protocolSchema
