import { z } from 'zod'

const limitedText = (max: number) => z.string().trim().max(max, `Use ${max} characters or fewer`)

/** The school profile: validated in the form and on every API response. */
export const schoolProfileSchema = z.object({
  schoolName: z
    .string()
    .trim()
    .min(2, 'Enter the school’s full name')
    .max(120, 'Use 120 characters or fewer'),
  shortName: limitedText(10),
  email: z.email('Enter a valid email address, like office@school.in'),
  phone: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || /^\+?[\d\s-]{7,16}$/.test(value),
      'Enter a valid phone number, like +91 98765 43210',
    ),
  principalName: limitedText(80),
  country: z.string().min(1, 'Choose a country'),
  address: limitedText(300),
  // Logo, favicon and signature belong to Branding (features/branding), not the profile.
})
