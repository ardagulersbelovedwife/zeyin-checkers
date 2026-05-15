import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { moveHistory } = await req.json();
    
    // In a real scenario, this would send `moveHistory` to OpenAI or an actual checkers engine API
    // Here we return a mock JSON analysis.
    
    const analysis = {
      summary: "You played a solid opening but made a critical tactical mistake in the mid-game.",
      mistakes: [
        {
          moveNumber: 12,
          description: "Moving to the edge left your back row vulnerable to a chained jump.",
          betterAlternative: "You should have kept your defensive structure intact."
        }
      ],
      improvementScore: 85
    };

    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json({ error: "Failed to analyze game" }, { status: 500 });
  }
}
