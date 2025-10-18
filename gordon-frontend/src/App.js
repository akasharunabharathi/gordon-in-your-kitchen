import React, { useState, useEffect } from 'react';
import { 
  LiveKitRoom, 
  RoomAudioRenderer, 
  useVoiceAssistant,
  useRoomContext
} from '@livekit/components-react';
import '@livekit/components-styles';

function App() {
  const [connected, setConnected] = useState(false);

  if (!connected) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Gordon Ramsay Voice Agent</h1>
        <button 
          onClick={() => setConnected(true)}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Start Cooking Session
        </button>
      </div>
    );
  }

  return (
    <LiveKitRoom
      token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NjA3OTM1MTUsImlkZW50aXR5IjoiMiIsImlzcyI6IkFQSVF3UEZnMmpwZ2M2RSIsIm5iZiI6MTc2MDc5MjYxNSwic3ViIjoiMiIsInZpZGVvIjp7ImNhblB1Ymxpc2giOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWUsInJvb20iOiJraXRjaGVuIiwicm9vbUpvaW4iOnRydWV9fQ.k92TQiPLJy8J_BzNsPY5eAl6LuzTov6UzN56J3ZYHGI"
      serverUrl="wss://gordon-in-your-kitchen-nj3p71l6.livekit.cloud"
      audio={true}
      video={false}
      onConnected={() => {
        console.log('Connected to Gordon\'s kitchen!');
      }}
      onDisconnected={(reason) => {
        console.log('Left the kitchen:', reason);
        setConnected(false);
      }}
    >
      <VoiceInterface />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}

function VoiceInterface() {
  const { state, agentTranscriptions } = useVoiceAssistant();
  const room = useRoomContext();
  const [transcriptHistory, setTranscriptHistory] = useState([]);

  // Listen for all transcription events from the room
  useEffect(() => {
    if (!room) return;

    const handleTranscription = (transcription, participant) => {
      console.log('Transcription received:', {
        text: transcription.text,
        participant: participant.identity,
        final: transcription.final
      });

      if (transcription.final && transcription.text.trim()) {
        setTranscriptHistory(prev => [...prev, {
          id: Date.now() + '-' + participant.identity,
          speaker: participant.identity === '2' ? 'You' : 'Gordon',
          text: transcription.text,
          timestamp: new Date().toLocaleTimeString(),
          type: participant.identity === '2' ? 'user' : 'agent'
        }]);
      }
    };

    // Listen for transcription events
    room.on('transcriptionReceived', handleTranscription);

    return () => {
      room.off('transcriptionReceived', handleTranscription);
    };
  }, [room]);

  // Fallback: Use agent transcriptions if room events don't work
  useEffect(() => {
    if (agentTranscriptions && agentTranscriptions.length > 0) {
      const latestSegment = agentTranscriptions[agentTranscriptions.length - 1];
      if (latestSegment.final && latestSegment.text.trim()) {
        setTranscriptHistory(prev => {
          // Check if we already have this transcript
          const exists = prev.some(t => 
            t.type === 'agent' && 
            t.text === latestSegment.text &&
            Date.now() - parseInt(t.id.split('-')[0]) < 2000
          );
          
          if (!exists) {
            return [...prev, {
              id: Date.now() + '-agent',
              speaker: 'Gordon',
              text: latestSegment.text,
              timestamp: new Date().toLocaleTimeString(),
              type: 'agent'
            }];
          }
          return prev;
        });
      }
    }
  }, [agentTranscriptions]);

  // Simple way to simulate user messages for testing
  const addTestUserMessage = () => {
    setTranscriptHistory(prev => [...prev, {
      id: Date.now() + '-test',
      speaker: 'You',
      text: 'How do I make perfect scrambled eggs?',
      timestamp: new Date().toLocaleTimeString(),
      type: 'user'
    }]);
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      padding: '20px',
      gap: '20px'
    }}>
      {/* Transcript Panel */}
      <div style={{ 
        flex: 2,
        border: '2px solid #FF6B35',
        borderRadius: '10px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#FF6B35' }}>
            Live Transcript 🍳
          </h2>
          <button 
            onClick={addTestUserMessage}
            style={{
              padding: '5px 10px',
              backgroundColor: '#1976D2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Test User Message
          </button>
        </div>
        
        <div style={{ 
          flex: 1,
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '15px',
          overflow: 'auto',
          backgroundColor: '#fafafa',
          marginBottom: '20px'
        }}>
          {transcriptHistory.length === 0 ? (
            <div style={{ 
              color: '#666', 
              fontStyle: 'italic',
              textAlign: 'center',
              marginTop: '50px'
            }}>
              <p>Start talking to see the conversation here...</p>
              <p style={{ fontSize: '12px' }}>
                If you don't see your messages, click "Test User Message" above
              </p>
            </div>
          ) : (
            transcriptHistory.map((entry) => (
              <div 
                key={entry.id} 
                style={{ 
                  marginBottom: '15px',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: entry.type === 'user' ? '#E3F2FD' : '#FFF3E0'
                }}
              >
                <div style={{ 
                  fontSize: '12px', 
                  color: '#666', 
                  marginBottom: '5px' 
                }}>
                  <strong style={{ 
                    color: entry.type === 'user' ? '#1976D2' : '#F57C00' 
                  }}>
                    {entry.speaker}
                  </strong>
                  <span style={{ marginLeft: '10px' }}>
                    {entry.timestamp}
                  </span>
                </div>
                <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                  {entry.text}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setTranscriptHistory([])}
            style={{
              padding: '8px 16px',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear Transcript
          </button>
        </div>
      </div>

      {/* Status Panel */}
      <div style={{ 
        flex: 1,
        border: '2px solid #4CAF50',
        borderRadius: '10px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#4CAF50' }}>
          Kitchen Status
        </h3>
        
        <div style={{ marginBottom: '20px' }}>
          <p><strong>Agent State:</strong></p>
          <div style={{
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: 
              state === 'listening' ? '#E8F5E8' :
              state === 'speaking' ? '#FFF3E0' :
              state === 'thinking' ? '#E3F2FD' : '#F5F5F5',
            color:
              state === 'listening' ? '#2E7D32' :
              state === 'speaking' ? '#F57C00' :
              state === 'thinking' ? '#1976D2' : '#666',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            {state === 'listening' && '🎤 Listening...'}
            {state === 'speaking' && '🗣️ Gordon Speaking...'}
            {state === 'thinking' && '🤔 Thinking...'}
            {!state && '⏸️ Idle'}
          </div>
        </div>

        {/* Debug info */}
        <div style={{ 
          fontSize: '12px', 
          color: '#666',
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px'
        }}>
          <p><strong>Debug:</strong></p>
          <p>Agent transcriptions: {agentTranscriptions?.length || 0}</p>
          <p>Total messages: {transcriptHistory.length}</p>
        </div>

        {/* Meme Container */}
        <div style={{ 
          marginTop: 'auto',
          border: '2px dashed #ccc',
          borderRadius: '10px',
          padding: '30px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🧑‍🍳</div>
          <p style={{ margin: '0', color: '#666' }}>
            <strong>Gordon Ramsay Meme</strong>
          </p>
          <p style={{ fontSize: '12px', color: '#999', margin: '5px 0 0 0' }}>
            "WHERE'S THE LAMB SAUCE?!"
          </p>
        </div>

        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: '20px',
            padding: '12px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          End Cooking Session
        </button>
      </div>
    </div>
  );
}

export default App;