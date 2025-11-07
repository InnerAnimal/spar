import { z } from 'zod'

export const tnrRequestSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address: z.string().min(1, 'Street address is required'),
  address2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(5, 'Valid ZIP code is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),
  howManyCats: z.string().min(1, 'This field is required'),
  anyInjuredOrSick: z.string().min(1, 'This field is required'),
  howLongHadThem: z.string().optional(),
  areTheyFixed: z.string().optional(),
  additionalInformation: z.string().optional(),
})

export type TNRRequestData = z.infer<typeof tnrRequestSchema>
