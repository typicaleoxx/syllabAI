# SyllabAI

SyllabAI turns messy syllabus PDFs and pasted syllabus text into structured deadlines, risk aware priorities, weekly study plans, and calendar ready tasks.

## Problem

Syllabus documents are long, inconsistent, and hard to act on.

Students often miss important deadlines because assignments, exams, and grading weights are scattered across pages. Most tools require manual entry, which is time consuming and unreliable.

## Solution

SyllabAI converts raw syllabus content into a clear academic plan.

It extracts deadlines, evaluates risk based on timing and weight, and generates a weekly plan so students know exactly what to work on and when.

## Core Features

- Upload syllabus PDF or paste syllabus text  
- Extract assignments, exams, deadlines, and instructor contacts  
- Compute risk levels based on due date and weight  
- Generate a weekly study plan  
- Dashboard showing upcoming work and priorities  
- Multi syllabus support in one view  
- Calendar export as ICS file  
- Chat assistant for planning help  

## System Flow

Input syllabus PDF or text  
Text extraction  
AI based structured parsing  
Schema validation  
Risk scoring  
Planner generation  
Dashboard and calendar output  

## Tech Stack

Frontend  
Next.js 14  
React 18  
TypeScript  
Tailwind CSS  

Backend  
FastAPI  
Pydantic  
Uvicorn  

AI and Parsing  
Groq API  
PyPDF2  

## Engineering Challenges

Handling inconsistent syllabus formats  
Syllabus documents vary heavily in structure. The solution was to use LLM based parsing with structured prompts and enforce a strict schema using Pydantic to normalize the output.

Ensuring reliable AI extraction  
AI responses can be inconsistent. Input text was sanitized before sending to the model, and output validation was added to prevent malformed data from reaching the frontend.

Designing meaningful risk scoring  
Simple deadline sorting is not enough. Risk levels were computed using both due dates and assignment weights to better reflect academic impact.

Frontend and backend integration  
Managing communication between Next.js and FastAPI required handling CORS, environment based API URLs, and ensuring consistent request formats across endpoints.

Working with PDF text extraction  
PDF parsing is unreliable depending on formatting. PyPDF2 was used for extraction, with the understanding that scanned or poorly formatted PDFs may reduce accuracy.

## Why This Project Matters

SyllabAI is not just a parser. It is a decision support system for students.

Instead of showing raw deadlines, it prioritizes work based on risk and transforms static syllabus content into a structured and actionable plan.

This project reflects real world engineering skills including API design, data validation, AI integration, and full stack development.

## Status

Originally built during a hackathon and now being actively improved into a more complete academic planning system.

Current focus areas include better UI, editable extracted data, and stronger planning logic.

## Demo

https://syllab-ai-five.vercel.app

## License

See the LICENSE file for full terms.

Copyright (c) 2026 Sneha Lama.

The live application can be used for personal and academic purposes.