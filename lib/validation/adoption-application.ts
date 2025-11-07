import { z } from 'zod'

export const adoptionApplicationSchema = z.object({
  // Personal Information
  petInterested: z.string().min(1, 'Required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  birthday: z.string().optional(),
  employerInfo: z.string().optional(),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),

  // Housing and Living Arrangements
  address: z.string().min(1, 'Street address is required'),
  address2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(5, 'Valid ZIP code is required'),
  ownOrRent: z.string().min(1, 'Required'),
  yardFenced: z.string().min(1, 'Required'),
  petsAllowed: z.string().min(1, 'Required'),
  howLongAtAddress: z.string().min(1, 'Required'),
  animalPrimaryLocation: z.string().min(1, 'Required'),
  ifMovePetsNotAllowed: z.string().min(1, 'Required'),
  adultsAndChildrenCount: z.string().min(1, 'Required'),
  childrenAges: z.string().optional(),
  hoursAlonePerDay: z.string().min(1, 'Required'),
  whoResponsible: z.string().min(1, 'Required'),
  everyoneCommitted: z.string().min(1, 'Required'),
  anyoneAllergies: z.string().min(1, 'Required'),
  animalRole: z.string().min(1, 'Required'),
  activityLevel: z.string().min(1, 'Required'),

  // Animal Behavior and Cost
  handlePottyAccidents: z.string().min(1, 'Required'),
  behaviorsNotTolerate: z.string().min(1, 'Required'),
  handleBehaviorIssues: z.string().min(1, 'Required'),
  monthlyPreventativesBudget: z.string().min(1, 'Required'),
  annualVetBudget: z.string().min(1, 'Required'),
  everTakenToShelter: z.string().min(1, 'Required'),
  everAppliedToAdopt: z.string().min(1, 'Required'),
  applicationApproved: z.string().optional(),

  // Animal History and Care
  howManyPetsInLife: z.string().min(1, 'Required'),
  lostPetInLast5Years: z.string().min(1, 'Required'),
  currentPets: z.string().min(1, 'Required'),
  currentPetsList: z.string().optional(),
  petsHousebroken: z.string().optional(),
  petsSpayedNeutered: z.string().optional(),
  petsVaccinesUpToDate: z.string().optional(),
  wherePetsLive: z.string().optional(),
  heartwormPreventative: z.string().optional(),
  vetInfo: z.string().optional(),

  // Signatures and Agreement
  certificationSignature: z.string().min(1, 'Signature is required'),
  agreementSignature: z.string().min(1, 'Signature is required'),
  spayNeuterInitial: z.string().optional(),
  vaccineSeriesInitial: z.string().optional(),
  referenceCheckInitial: z.string().optional(),
  mistreatmentInitial: z.string().min(1, 'This initial is required'),

  // Payment
  paymentMethod: z.string().min(1, 'Payment method is required'),
  additionalDonation: z.string().optional(),
})

export type AdoptionApplicationData = z.infer<typeof adoptionApplicationSchema>
