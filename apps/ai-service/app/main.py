#!/usr/bin/env python3
"""
DevVerse AI - FastAPI AI Service
Powered by Google Gemini API
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel
from typing import Optional, List, Any, Dict
import os
import json
from datetime import datetime

app = FastAPI(
    title="DevVerse AI Service",
    description="AI-powered architecture analysis using Google Gemini",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
gemini_model = None

if GEMINI_API_KEY:
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel("gemini-1.5-flash")
        print("✅ Gemini AI initialized")
    except Exception as e:
        print(f"⚠️  Failed to initialize Gemini: {e}")
else:
    print("⚠️  GEMINI_API_KEY not set - running in mock mode")


# Pydantic Models
class AnalyzeRequest(BaseModel):
    description: str
    project_id: Optional[str] = None

class DocumentationRequest(BaseModel):
    nodes: List[Dict[str, Any]] = []
    project_id: Optional[str] = None

class ComplexityRequest(BaseModel):
    code: str
    language: Optional[str] = "python"

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    ai_enabled: bool
    version: str


async def call_gemini(prompt: str) -> str:
    """Call Gemini API or return mock response"""
    if not gemini_model:
        return json.dumps({
            "summary": "Mock AI analysis (set GEMINI_API_KEY for real AI)",
            "insights": ["Add caching layer", "Use circuit breakers", "Implement health checks"],
            "score": 82,
            "recommendations": ["Consider Redis for caching", "Add rate limiting", "Use async processing"],
        })
    
    try:
        response = await gemini_model.generate_content_async(prompt)
        return response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")


# Routes
@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="ok",
        timestamp=datetime.utcnow().isoformat(),
        ai_enabled=gemini_model is not None,
        version="1.0.0",
    )


@app.post("/analyze/architecture")
async def analyze_architecture(request: AnalyzeRequest):
    prompt = f"""You are an expert software architect. Analyze this system architecture and provide insights in JSON format.

Architecture Description:
{request.description}

Return a JSON object with these exact keys:
- summary: string (brief summary)
- insights: array of strings (key observations)
- score: number (0-100, architecture quality)
- recommendations: array of strings (improvement suggestions)
- risks: array of strings (potential risks)
- patterns: array of strings (detected design patterns)

Return ONLY valid JSON, no markdown."""

    result = await call_gemini(prompt)
    return {"status": "completed", "result": result, "timestamp": datetime.utcnow().isoformat()}


@app.post("/analyze/documentation")
async def generate_documentation(request: DocumentationRequest):
    nodes_text = "\n".join([f"- {n.get('type', 'SERVICE')}: {n.get('label', 'Unknown')}" for n in request.nodes])
    
    prompt = f"""Generate comprehensive technical documentation for this system.

Components:
{nodes_text if nodes_text else "No specific components provided"}

Create a detailed markdown document with:
1. ## System Overview
2. ## Architecture Components
3. ## Data Flow
4. ## Integration Points  
5. ## Deployment Guide
6. ## Security Considerations

Use proper markdown formatting."""

    result = await call_gemini(prompt)
    return {"status": "completed", "documentation": result, "timestamp": datetime.utcnow().isoformat()}


@app.post("/analyze/complexity")
async def analyze_complexity(request: ComplexityRequest):
    prompt = f"""Analyze this {request.language} code for complexity metrics. Return JSON.

```{request.language}
{request.code[:3000]}
```

Return JSON with:
- cyclomaticComplexity: number (1-20+)
- cognitiveComplexity: number
- maintainabilityIndex: number (0-100, higher is better)
- linesOfCode: number
- issues: array of strings
- suggestions: array of strings

Return ONLY valid JSON."""

    result = await call_gemini(prompt)
    return {"status": "completed", "metrics": result, "timestamp": datetime.utcnow().isoformat()}


@app.post("/analyze/security")
async def analyze_security(request: AnalyzeRequest):
    prompt = f"""Analyze this system architecture for security vulnerabilities. Return JSON.

System: {request.description}

Return JSON with:
- riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
- vulnerabilities: array of {{issue, severity, recommendation}}
- score: number (0-100, security score)
- complianceNotes: array of strings

Return ONLY valid JSON."""

    result = await call_gemini(prompt)
    return {"status": "completed", "security": result, "timestamp": datetime.utcnow().isoformat()}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
