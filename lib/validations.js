import {z} from 'zod';

// Register from validation
export const registerSchema = z.object({
  name: z
  .string()
  .min(2, {message: 'Name must be at least 2 characters'})
  .max(50, {message: 'Name must be less than 50 characters'}),

  email: z.email({message: 'Invalid email address'}),
  
  password: z
  .string()
    .min(6, {message: 'Password must be at least 6 characters'})    
    .max(15, {message: 'Password must be less than 1 characters'})
    .regex(/[A-Z]/, {message: 'Password must contain at least one uppercase letter'})
    .regex(/[0-9]/, {message: 'Password must contain at least one number'})
});  


// Login form validation 
export const loginSchema = z.object({
  email: z.email({message: 'Invalid email address'}),
  password: z.string().min(6, {message: 'Enter your password'}),
}); 