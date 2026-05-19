import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AIService {
  private readonly logger = new Logger('AIService');
  private genAI: GoogleGenerativeAI | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    const apiKey = this.config.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.logger.log('✅ Gemini AI initialized');
    } else {
      this.logger.warn('⚠️  GEMINI_API_KEY not set — AI running in mock mode');
    }
  }

  private async callGemini(prompt: string): Promise<string> {
    if (!this.genAI) {
      // Mock response for demo
      return JSON.stringify({
        summary: 'AI analysis complete (mock mode - add GEMINI_API_KEY to enable real AI)',
        insights: ['Use microservices for scalability', 'Add caching layer for performance', 'Implement rate limiting'],
        score: 85,
        recommendations: ['Consider Redis caching', 'Add circuit breakers', 'Implement health checks'],
      });
    }

    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  async analyzeArchitecture(projectId: string, description: string) {
    const analysis = await this.prisma.aIAnalysis.create({
      data: { projectId, type: 'ARCHITECTURE', status: 'RUNNING', prompt: description },
    });

    try {
      const prompt = `You are an expert software architect. Analyze this system architecture and provide insights in JSON format:

Architecture Description: ${description}

Respond with a JSON object containing:
- summary: brief summary
- insights: array of key observations  
- score: architecture quality score (0-100)
- recommendations: array of improvement suggestions
- risks: potential risks or issues`;

      const result = await this.callGemini(prompt);

      await this.prisma.aIAnalysis.update({
        where: { id: analysis.id },
        data: { status: 'COMPLETED', result: { text: result } },
      });

      return { id: analysis.id, result };
    } catch (error) {
      await this.prisma.aIAnalysis.update({
        where: { id: analysis.id },
        data: { status: 'FAILED', error: String(error) },
      });
      throw error;
    }
  }

  async generateDocumentation(projectId: string, nodes: any[]) {
    const analysis = await this.prisma.aIAnalysis.create({
      data: { projectId, type: 'DOCUMENTATION', status: 'RUNNING' },
    });

    try {
      const nodesList = nodes.map((n) => `- ${n.type}: ${n.label}`).join('\n');
      const prompt = `Generate comprehensive technical documentation for this system architecture:

Components:
${nodesList}

Return a markdown-formatted technical document with:
1. System Overview
2. Component Descriptions  
3. Data Flow
4. Integration Points
5. Deployment Considerations`;

      const result = await this.callGemini(prompt);

      await this.prisma.aIAnalysis.update({
        where: { id: analysis.id },
        data: { status: 'COMPLETED', result: { documentation: result } },
      });

      return { id: analysis.id, documentation: result };
    } catch (error) {
      await this.prisma.aIAnalysis.update({
        where: { id: analysis.id },
        data: { status: 'FAILED', error: String(error) },
      });
      throw error;
    }
  }

  async analyzeComplexity(projectId: string, code: string) {
    const analysis = await this.prisma.aIAnalysis.create({
      data: { projectId, type: 'COMPLEXITY', status: 'RUNNING', prompt: code.substring(0, 500) },
    });

    try {
      const prompt = `Analyze this code for complexity and provide metrics in JSON format:

\`\`\`
${code.substring(0, 3000)}
\`\`\`

Return JSON with:
- cyclomaticComplexity: number (1-20+)
- cognitiveComplexity: number
- maintainabilityIndex: number (0-100)
- issues: array of specific issues found
- suggestions: array of refactoring suggestions`;

      const result = await this.callGemini(prompt);

      await this.prisma.aIAnalysis.update({
        where: { id: analysis.id },
        data: { status: 'COMPLETED', result: { text: result } },
      });

      return { id: analysis.id, result };
    } catch (error) {
      await this.prisma.aIAnalysis.update({
        where: { id: analysis.id },
        data: { status: 'FAILED', error: String(error) },
      });
      throw error;
    }
  }

  async getAnalyses(projectId: string) {
    return this.prisma.aIAnalysis.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
