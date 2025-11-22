"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles } from 'lucide-react';
import { askAiFaq, type FAQOutput } from '@/ai/flows/ai-faq';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AiFaq = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<FAQOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const result = await askAiFaq({ question });
      setAnswer(result);
    } catch (err) {
      setError('Sorry, something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Have a question? Ask our AI assistant or check our common queries.
          </p>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-primary" />
              Ask our AI Assistant
            </CardTitle>
            <CardDescription>
              Get instant answers to your questions about Zensolve's services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., 'What kind of mobile apps do you develop?'"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !question.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Asking...
                  </>
                ) : (
                  'Ask'
                )}
              </Button>
            </form>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isLoading && (
              <div className="mt-4 space-y-2">
                 <div className="h-4 bg-muted rounded w-1/4"></div>
                 <div className="h-4 bg-muted rounded w-full"></div>
                 <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            )}
            
            {answer && (
              <div className="mt-6 p-4 bg-secondary rounded-lg">
                <h4 className="font-semibold text-foreground">Answer:</h4>
                <p className="text-muted-foreground mt-2">{answer.answer}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AiFaq;
