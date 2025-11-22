'use server';

/**
 * @fileOverview AI-powered FAQ for Zensolve Infotech.
 *
 * This file defines a Genkit flow for answering frequently asked questions about Zensolve's services.
 * It takes a user's question as input and returns an AI-generated answer.
 *
 * @param {string} question - The user's question about Zensolve's services.
 * @returns {string} answer - The AI-generated answer to the question.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FAQInputSchema = z.object({
  question: z.string().describe('The user\'s question about Zensolve\'s services.'),
});
export type FAQInput = z.infer<typeof FAQInputSchema>;

const FAQOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the question.'),
});
export type FAQOutput = z.infer<typeof FAQOutputSchema>;

export async function askAiFaq(input: FAQInput): Promise<FAQOutput> {
  return aiFaqFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiFaqPrompt',
  input: {schema: FAQInputSchema},
  output: {schema: FAQOutputSchema},
  prompt: `You are a helpful AI assistant for Zensolve Infotech Solution Private Limited.
  Your goal is to answer questions about the company.
  Use the following information to answer the user's question.

  Company Name: Zensolve Infotech Solution Private Limited
  Incorporation Date: January 15, 2024
  Registered Office: 452, RAMNAGAR BHAGALPUR ROAD Godda Godda Godda , Jharkhand - 814133
  Directors: Anand Kumar, Rupesh Kumar Thakur
  Industry: Placement Services, IT consulting and services
  Website: www.infozensolve.in
  LinkedIn: Zensolve Corporation

  Services Offered:
  - Placement services: Helping businesses find top-tier candidates for their job openings and assisting individuals with job searches.
  - IT consulting and services: Providing IT consulting and services to ensure the right information is available to the right people at the right time.
  - Business solutions: Offering tailored application frameworks and end-to-end business solutions.

  Business hours:
  - Monday to Friday: 10:30 am to 5:00 pm
  - Saturday: 10:30 am to 1:30 pm.

  Answer the following question clearly and concisely:

  Question: {{{question}}}
  `,
});

const aiFaqFlow = ai.defineFlow(
  {
    name: 'aiFaqFlow',
    inputSchema: FAQInputSchema,
    outputSchema: FAQOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
