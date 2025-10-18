from dotenv import load_dotenv

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_core.vectorstores import InMemoryVectorStore

load_dotenv(".env.local")

file_path = "student-cookbook.pdf"
loader = PyPDFLoader(file_path)

docs = loader.load()

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000, chunk_overlap=200, add_start_index=True
)

all_splits = text_splitter.split_documents(docs)

embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
vector_store = InMemoryVectorStore(embeddings)
ids = vector_store.add_documents(documents=all_splits)

async def search_cookbook(question: str, k: int = 3) -> str:
    """Search the cookbook for relevant information"""
    results = vector_store.similarity_search(question, k=k)
    
    # Combine the relevant chunks
    context = "\n\n".join([doc.page_content for doc in results])
    return context

# Test it works
test_result = search_cookbook("How do I make risotto?")
print("COOKBOOK KNOWLEDGE:")
print(test_result)