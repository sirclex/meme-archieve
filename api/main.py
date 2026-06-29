from fastapi import FastAPI
from lib import init, search_text
from dotenv import load_dotenv
import os

load_dotenv()

faiss_index, encoding_model, search_items = init(
    os.getenv("ENCODING_MODEL"),
    os.getenv("DATASET_JSON")
)
result_per_page = int(os.getenv("RESULT_PER_PAGE"))
total_items = len(search_items)

app = FastAPI()

@app.get("/")
def hello():
    return {"message": "Hola world!"}

@app.get("/search")
def search(text = "", offset: int = 0):
    items = search_text(
        text,
        faiss_index,
        encoding_model,
        search_items,
        offset=offset,
        limit=result_per_page,
    )

    return {
        "items": items,
        "has_more": offset + len(items) < total_items,
    }
