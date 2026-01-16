import { NextRequest, NextResponse } from 'next/server';
import { searchPolicy } from '@/lib/senso';

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();
        const apiKey = process.env.SENSO_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'Senso API Key not configured' },
                { status: 500 }
            );
        }

        const data = await searchPolicy(message, apiKey);

        // Senso usually provides an 'answer' and 'results' (chunks)
        // We strictly check if the answer is valid or if results exist.
        // If the answer looks like a fallback/empty from Senso, we use our custom fallback.

        const isUnknown =
            !data.answer ||
            data.answer.toLowerCase().includes("i don't know") ||
            data.answer.toLowerCase().includes("not mentioned") ||
            data.results.length === 0;

        if (isUnknown) {
            return NextResponse.json({
                answer: 'This information is not specified in the Access Control Policy.',
                citation: null
            });
        }

        // Format the answer with the citation as requested
        // We pick the first result as the main source for citation
        const sourceTitle = data.results[0]?.title || 'Access Control Policy';
        const finalAnswer = `${data.answer}\n\n[Source: ${sourceTitle}]`;

        return NextResponse.json({
            answer: finalAnswer,
            citation: data.results[0]?.chunk_text || null
        });

    } catch (error) {
        console.error('Chat Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
