# Voice Feedback Demo for AI Medical Scribe Instructions

A proof-of-concept SvelteKit application demonstrating how voice feedback can dynamically update LLM instructions in real-time for medical documentation. This demo showcases a feature that could be integrated into AI medical scribe applications to allow healthcare providers to customize documentation behavior through natural voice commands.

## 🎯 Overview

This demo simulates a feature for an AI medical scribe where users can:
- Provide voice feedback to modify LLM instructions
- See real-time updates to documentation behavior
- Track version history of instruction changes
- Improve prompts through LLM optimization

**Example Use Case**: A physician dictating an HPI (History of Present Illness) can say "Avoid writing severe when talking about symptoms" and the system will automatically update its instructions to reflect this preference.

## ✨ Key Features

- **Voice Input Integration**: Capture and process voice feedback through browser microphone
- **Dynamic Instruction Updates**: LLM-powered contextual placement of feedback into existing instructions
- **Version Control**: In-memory tracking of instruction changes with comparison capabilities
- **Instruction Optimization**: "Improve my instructions" feature to enhance prompt effectiveness
- **Real-time Preview**: See how updated instructions affect documentation output

## 🛠️ Tech Stack

- **Framework**: SvelteKit with TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Vitest with Playwright
- **Package Manager**: pnpm
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cleo
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test` - Run unit tests
- `pnpm check` - Type checking

## 📱 Demo Usage

1. **Initial Setup**: The demo starts with pre-configured instructions for generating emergency medicine HPIs

2. **Voice Feedback**:
   - Click the microphone button to start recording
   - Speak your instruction modification (e.g., "Avoid using medical jargon")
   - The system will process your feedback and update instructions

3. **View Changes**:
   - See the updated instructions in real-time
   - Compare with previous versions
   - Test the new behavior with sample inputs

4. **Optimize Instructions**:
   - Click "Improve my instructions" to enhance prompt clarity
   - Review suggested improvements before applying

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Voice Input    │────▶│  LLM Processor   │────▶│  Instructions   │
│  (Browser API)  │     │  (Context-aware) │     │    Storage      │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                │                          │
                                ▼                          ▼
                        ┌──────────────────┐     ┌─────────────────┐
                        │  Instruction     │     │    Version      │
                        │   Optimizer      │     │    History      │
                        └──────────────────┘     └─────────────────┘
```

### Key Components

- **Voice Capture**: Uses Web Audio API for microphone access
- **Feedback Processing**: LLM analyzes voice feedback and determines appropriate instruction modifications
- **Instruction Management**: Maintains current instructions with contextual updates
- **Version Control**: Tracks all changes in memory for the demo session

## 💡 Implementation Notes

- This is a **demo application** - production implementation would require:
  - Persistent storage for instructions and version history
  - User authentication and permission management
  - HIPAA compliance for medical applications
  - Robust error handling and fallback mechanisms

- The LLM integration is designed to:
  - Understand context from existing instructions
  - Place feedback appropriately within the instruction structure
  - Maintain instruction coherence and effectiveness

## 🔮 Future Enhancements

- **Multi-user Support**: Allow different providers to maintain personal instruction sets
- **Template Library**: Pre-built instruction templates for various specialties
- **Advanced Version Control**: Branching, merging, and rollback capabilities
- **Analytics**: Track which instruction modifications improve documentation quality
- **Export/Import**: Share instruction sets between providers or institutions

## 📝 License

This is a demonstration project. For production use in medical applications, ensure compliance with all relevant healthcare regulations and standards.

## 🤝 Contributing

This is a demo project, but suggestions and feedback are welcome for the concept and implementation approach.