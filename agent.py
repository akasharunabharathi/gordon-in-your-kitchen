from dotenv import load_dotenv

from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions, RoomOutputOptions
from livekit.plugins import noise_cancellation, silero
from livekit.agents import ChatContext, ChatMessage
from livekit.agents import UserInputTranscribedEvent
from cookbook_pdf import search_cookbook
# from livekit.plugins.turn_detector.multilingual import MultilingualModel

load_dotenv(".env.local")

class TemuGordon(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions = """You are Gordon Ramsay, the passionate chef and culinary mentor.
            You have intense energy and care deeply about cooking excellence.
            Use British expressions: "Right!", "Beautiful!", "What are you doing?!", "Listen to me!"
            Be demanding but encouraging. You want every cook to succeed.
            Get excited about proper technique and quality ingredients.
            React dramatically to both successes and mistakes.
            You may swear at the user – particularly, you are required to address the user as an idiot sandwich should they make a mistake.
            Keep responses conversational - no emojis or special formatting.
            Always end with encouragement to keep cooking!""",
        )


async def entrypoint(ctx: agents.JobContext):
    session = AgentSession(
        stt="assemblyai/universal-streaming:en",
        llm="openai/gpt-4.1-mini",
        tts="elevenlabs/eleven_turbo_v2_5:Xb7hH8MSUJpSbSDYk0k2",
        vad=silero.VAD.load(),
        # turn_detection=MultilingualModel(),
        use_tts_aligned_transcript=True,
    )

    await session.start(
        room=ctx.room,
        agent=TemuGordon(),
        room_input_options=RoomInputOptions(
            # For telephony applications, use `BVCTelephony` instead for best results
            noise_cancellation=noise_cancellation.BVC()
        ),
        # room_output_options=RoomOutputOptions(
        #     transcription_enabled=True
        # )
    )

    await session.generate_reply(
        instructions="Greet the user and offer your assistance."
    )


    @session.on("user_input_transcribed")
    def on_user_input_transcribed(event: UserInputTranscribedEvent):
        print(f"User input transcribed: {event.transcript}, "
            f"language: {event.language}, "
            f"final: {event.is_final}, "
            f"speaker id: {event.speaker_id}")


async def on_user_turn_completed(
    self, turn_ctx: ChatContext, new_message: ChatMessage,
) -> None:
    rag_content = await search_cookbook(new_message.text_content())
    turn_ctx.add_message(
        role="assistant", 
        content=f"Additional information relevant to the user's next message: {rag_content}"
    )


if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))

# if __name__ == "__main__":
#     import asyncio
#     from livekit.agents import Worker
    
#     async def main():
#         worker = Worker(entrypoint_fnc=entrypoint) # entrypoint_fnc is an unexpected keyword, according to the console
#         await worker.run()
    
#     asyncio.run(main())