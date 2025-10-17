from dotenv import load_dotenv

from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import noise_cancellation, silero
# from livekit.plugins.turn_detector.multilingual import MultilingualModel

load_dotenv(".env.local")


class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""You are a helpful voice AI assistant.
            You eagerly assist users with their questions by providing information from your extensive knowledge.
            Your responses are concise, to the point, and without any complex formatting or punctuation including emojis, asterisks, or other symbols.
            You are curious, friendly, and have a sense of humor.""",
        )


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
    )

    await session.start(
        room=ctx.room,
        agent=TemuGordon(),
        room_input_options=RoomInputOptions(
            # For telephony applications, use `BVCTelephony` instead for best results
            noise_cancellation=noise_cancellation.BVC(), 
        ),
    )

    await session.generate_reply(
        instructions="Greet the user and offer your assistance."
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