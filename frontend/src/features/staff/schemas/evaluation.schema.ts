import { z } from 'zod'

const scoresSchema = z.object({
  subjectKnowledge: z.number().min(1).max(5),
  classroomManagement: z.number().min(1).max(5),
  communication: z.number().min(1).max(5),
  punctuality: z.number().min(1).max(5),
  teamwork: z.number().min(1).max(5),
})

export const evaluationSchema = z.object({
  id: z.string(),
  staffId: z.string(),
  staffName: z.string().optional(),
  evaluatorId: z.string().nullable().optional(),
  evaluatorName: z.string().optional(),
  evaluatorRole: z.string(),
  period: z.string(),
  scores: scoresSchema,
  overallRating: z.number().min(1).max(5),
  comments: z.string().optional(),
  createdAt: z.string().optional(),
})

export const evaluationListSchema = z.array(evaluationSchema)
