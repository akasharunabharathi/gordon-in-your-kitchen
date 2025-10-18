# gordon-in-your-kitchen
Gordon Ramsay on call when cooking?

# Gordon Ramsay Voice Agent

A RAG-enabled voice agent featuring Gordon Ramsay's culinary expertise, built with LiveKit for real-time voice conversation and enhanced with retrieval-augmented generation over cooking documentation.

## Project Overview

I love cooking, but having to watch videos to remember a step while in the kitchen, go to videos' descriptions to look for measurements, replay videos over and over again, and more – so I built a voice AI agent you can talk to when cooking! Users can engage in real-time voice conversations about cooking techniques, recipes, and culinary advice, with the agent drawing knowledge from a comprehensive student cookbook PDF.

![WhatsApp Image 2025-10-18 at 1 53 30 PM](https://github.com/user-attachments/assets/77c8eab3-1dee-4da9-a3ab-9053a4ef30a0)

*Creme Caramel that I made three years ago, inspired by Masterchef*

## Technical Architecture

### Backend (Python)
- **LiveKit Agent**: Real-time voice conversation handling
- **Speech-to-Text**: AssemblyAI Universal Streaming
- **Language Model**: OpenAI GPT-4o-mini
- **Text-to-Speech**: ElevenLabs Turbo v2.5
- **Voice Activity Detection**: Silero VAD
- **RAG System**: LangChain + OpenAI embeddings + vector search

### Frontend (React)
- **Framework**: React with LiveKit Components
- **Real-time Transcription**: Live display of both user and agent speech
- **Voice Controls**: Start/end call functionality
- **Audio Visualization**: Real-time audio feedback
- **Responsive UI**: Clean, cooking-themed interface

## Features

### Core Functionality
- **Real-time Voice Conversation**: Natural back-and-forth dialogue with sub-second latency
- **Live Transcription**: Both user speech and agent responses displayed in real-time
- **Gordon Ramsay Personality**: Authentic responses with British expressions and passionate cooking advice
- **RAG-Enhanced Knowledge**: Searches student cookbook for relevant cooking information
- **Persistent Conversation**: Full conversation history maintained during session

### Technical Features
- **Noise Cancellation**: Background noise filtering for clear audio
- **Voice Activity Detection**: Automatic speech detection and turn-taking
- **Error Handling**: Graceful degradation and connection recovery
- **Debug Interface**: Real-time status monitoring and diagnostics

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 16+
- LiveKit Cloud account
- OpenAI API key
- ElevenLabs API key

### Backend Setup

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd gordon-in-your-kitchen
pip install -r requirements.txt
```

2. **Configure environment variables**:
```bash
cp .env.example .env.local
# Edit .env.local with your API keys:
# LIVEKIT_API_KEY=your_livekit_key
# LIVEKIT_API_SECRET=your_livekit_secret
# OPENAI_API_KEY=your_openai_key
# ELEVENLABS_API_KEY=your_elevenlabs_key
```

3. **Add PDF document**:
```bash
# Place your cookbook PDF as 'student-cookbook.pdf' in the root directory
```

4. **Run the agent**:
```bash
python agent.py
```

### Frontend Setup

1. **Install dependencies**:
```bash
cd frontend
npm install
```

2. **Configure LiveKit credentials**:
```bash
# Update App.js with your LiveKit token and server URL
# For production, implement server-side token generation
```

3. **Start the development server**:
```bash
npm start
```

## File Structure

```
gordon-in-your-kitchen/
├── agent.py                 # Main LiveKit agent implementation
├── cookbook_pdf.py          # RAG system for PDF processing
├── student-cookbook.pdf     # Knowledge base document
├── requirements.txt         # Python dependencies
├── .env.local              # Environment variables
└── frontend/
    ├── src/
    │   ├── App.js          # Main React application
    │   └── App.css         # Styling
    ├── package.json        # Node dependencies
    └── public/
```

## Technical Implementation Details

### RAG System
- **Document Processing**: PDF loaded and chunked using PyPDFLoader
- **Embeddings**: OpenAI text-embedding-3-large for semantic search
- **Vector Store**: In-memory vector store for fast retrieval
- **Search Integration**: Triggered on each user turn to provide relevant context

### Voice Pipeline
- **STT**: AssemblyAI streaming for real-time transcription
- **LLM**: GPT-4o-mini for natural language understanding and generation
- **TTS**: ElevenLabs for high-quality voice synthesis
- **Audio Processing**: Noise cancellation and voice activity detection

### Real-time Communication
- **WebSocket Connection**: LiveKit WebSocket for low-latency communication
- **Transcription Forwarding**: Both user and agent speech transcribed and displayed
- **State Management**: React hooks for managing conversation state

## Usage

1. **Start the backend agent** in your development environment
2. **Open the frontend** in your web browser
3. **Click "Start Cooking Session"** to connect to the LiveKit room
4. **Speak naturally** about cooking topics
5. **View live transcription** of the entire conversation
6. **Ask specific questions** about recipes or techniques from the cookbook
7. **End the session** when finished

## Key Features Demonstrated

### Interview Requirements Met
- ✅ **LiveKit Integration**: Full voice agent pipeline with configurable components
- ✅ **Real-time Transcription**: Live display of all conversation participants
- ✅ **RAG Implementation**: Semantic search over PDF cookbook content
- ✅ **Creative Personality**: Gordon Ramsay character with authentic voice and responses
- ✅ **Tool Integration**: Ready for additional tool calls (restaurant finder, etc.)
- ✅ **Professional Frontend**: React-based interface with proper LiveKit integration

### Technical Highlights
- **Low Latency**: Sub-second response times for natural conversation flow
- **Robust Error Handling**: Connection recovery and graceful degradation
- **Scalable Architecture**: Modular design for easy extension and deployment
- **Production Ready**: Environment-based configuration and proper security practices

## Known Issues and Limitations

### Current Limitations
- **Rate Limiting**: LiveKit Cloud free tier has usage limits for STT/TTS
- **PDF Dependency**: Requires specific cookbook PDF for optimal RAG performance  
- **Token Management**: Frontend uses hardcoded tokens (should be server-generated for production)

### Potential Improvements
- **Tool Calls**: Add restaurant finder, ingredient supplier lookup, or recipe suggestions
- **Multi-PDF Support**: Allow users to upload their own cooking documents
- **Conversation Persistence**: Save conversation history across sessions
- **Voice Customization**: Allow users to adjust Gordon's voice characteristics
- **Mobile Optimization**: Responsive design improvements for mobile devices

## Development Notes

### Testing the RAG System
```python
# Test cookbook search directly:
from cookbook_pdf import search_cookbook
result = search_cookbook("How do I make risotto?")
print(result)
```

### Debugging Voice Issues
- Check LiveKit Cloud dashboard for usage limits
- Verify microphone permissions in browser
- Monitor console logs for transcription events
- Test with different STT/TTS providers if rate limited

### Performance Optimization
- Implement proper duplicate detection for transcriptions
- Add conversation chunking for long sessions
- Optimize vector search for larger documents
- Implement caching for frequently asked questions

## Contributing

This project was built as a technical demonstration for a take-home interview. The modular architecture allows for easy extension and improvement of individual components.

## License

This project is for educational and demonstration purposes.
