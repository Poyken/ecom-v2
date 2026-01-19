import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService implements OnModuleInit {
  private readonly logger = new Logger(AiService.name);
  private genAI: GoogleGenerativeAI;
  private model: any;
  private embeddingModel: any;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY is not set. AI features will be disabled.');
      return;
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    this.embeddingModel = this.genAI.getGenerativeModel({ model: 'text-embedding-004' });
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.embeddingModel) return [];
    try {
      const result = await this.embeddingModel.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      this.logger.error(`Error generating embedding: ${error.message}`);
      return [];
    }
  }

  async syncProductEmbedding(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { 
          brand: true,
          categories: { include: { category: true } }
      }
    });

    if (!product) return;

    const categories = product.categories.map(c => c.category.name).join(', ');
    const content = `Product: ${product.name}. Brand: ${product.brand.name}. Categories: ${categories}. Description: ${product.description || ''}`;
    
    const embedding = await this.generateEmbedding(content);
    if (embedding.length > 0) {
      // Use raw SQL to update vector field as Prisma doesn't support it directly in standard methods
      await this.prisma.$executeRaw`
        UPDATE "Product" 
        SET "embedding" = ${embedding}::vector 
        WHERE "id" = ${productId}
      `;
      this.logger.log(`Synced embedding for product: ${product.name}`);
    }
  }

  async semanticSearch(tenantId: string, query: string, limit = 5) {
    const embedding = await this.generateEmbedding(query);
    if (embedding.length === 0) return [];

    // Cosine similarity search using pgvector
    const results: any[] = await this.prisma.$queryRaw`
      SELECT 
        id, name, slug, description, "minPrice", "maxPrice",
        1 - ("embedding" <=> ${embedding}::vector) as similarity
      FROM "Product"
      WHERE "tenantId" = ${tenantId} AND "deletedAt" IS NULL AND "embedding" IS NOT NULL
      ORDER BY similarity DESC
      LIMIT ${limit}
    `;

    return results;
  }

  async chat(tenantId: string, userMessage: string, history: { role: string, content: string }[] = []) {
    if (!this.model) return { text: "AI is currently unavailable. Please set up GEMINI_API_KEY." };

    // 1. Retrieval: Get relevant products
    const relatedProducts = await this.semanticSearch(tenantId, userMessage, 3);
    
    const context = relatedProducts.length > 0 
      ? `Relevant products in our store:\n${relatedProducts.map(p => `- ${p.name}: ${p.description} (Price: ${p.minPrice}-${p.maxPrice} VND)`).join('\n')}`
      : "No direct product matches found. Assist the user with general inquiries or guide them to browse categories.";

    // 2. Generate response with RAG
    const prompt = `
      You are a helpful and professional shopping assistant for an ecommerce store.
      Strict Rule: Only recommend products that are explicitly listed in the Context below.
      If the user's request doesn't match any products in the Context, inform them politely and offer to help them browse the general categories.
      Keep answers concise and friendly in Vietnamese.

      Context:
      ${context}

      User says: ${userMessage}
    `;

    try {
      const chat = this.model.startChat({
        history: history.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }],
        })),
      });

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      
      return {
        text: response.text(),
        suggestedProducts: relatedProducts
      };
    } catch (error) {
      this.logger.error(`Error in AI Chat: ${error.message}`);
      return { text: "Xin lỗi, tôi gặp trục trặc kỹ thuật. Hãy thử lại sau nhé!" };
    }
  }

  async syncAllEmbeddings(tenantId: string) {
    const products = await this.prisma.product.findMany({
        where: { tenantId, deletedAt: null },
        select: { id: true }
    });

    this.logger.log(`Bulk syncing embeddings for ${products.length} products for tenant ${tenantId}`);
    
    // Process in sequence to avoid hitting AI rate limits too hard
    for (const product of products) {
        await this.syncProductEmbedding(product.id).catch(e => 
            this.logger.error(`Failed to sync embedding for ${product.id}: ${e.message}`)
        );
    }
  }
}
