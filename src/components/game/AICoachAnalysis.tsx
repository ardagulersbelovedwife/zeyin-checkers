'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, ArrowRight } from 'lucide-react';

export function AICoachAnalysis({ moveHistory }: { moveHistory: any[] }) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAnalysis = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moveHistory })
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-xl bg-zinc-900/30 border-zinc-800/50 text-zinc-300 shadow-none rounded-2xl mt-8">
      <CardHeader className="border-b border-zinc-800/50 pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium tracking-tight flex items-center gap-2 text-zinc-100">
          <Brain className="w-5 h-5 text-zinc-400" />
          <span>Post-Game Analysis</span>
        </CardTitle>
        <Button 
          onClick={fetchAnalysis} 
          disabled={isLoading}
          variant="outline"
          className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 text-sm h-8"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Game'}
        </Button>
      </CardHeader>
      
      {analysis && (
        <CardContent className="pt-6 space-y-6">
          <div className="bg-zinc-800/20 border border-zinc-800/50 rounded-xl p-4">
            <p className="text-zinc-300 font-light leading-relaxed text-sm">{analysis.summary}</p>
          </div>
          
          <div>
            <h4 className="text-xs font-medium tracking-wider text-zinc-500 mb-4 uppercase">Critical Mistakes</h4>
            <div className="space-y-4">
              {analysis.mistakes.map((m: any, i: number) => (
                <div key={i} className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
                  <div className="flex items-center gap-2 mb-2 text-xs font-medium text-red-400/80">
                    <span>Move #{m.moveNumber}</span>
                  </div>
                  <p className="text-zinc-300 text-sm mb-3 font-light">{m.description}</p>
                  <div className="flex items-start gap-2 bg-zinc-800/30 p-3 rounded-lg border border-zinc-800">
                    <ArrowRight className="w-4 h-4 text-emerald-400/80 shrink-0 mt-0.5" />
                    <p className="text-emerald-400/90 text-sm font-light">{m.betterAlternative}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
