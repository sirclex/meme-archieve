from fastapi import FastAPI
from lib import init, search_text
from dotenv import load_dotenv
import os

load_dotenv()

faiss_index, encoding_model, dataset = init(
    os.getenv("ENCODING_MODEL"),
    os.getenv("DATASET_JSON")
)

app = FastAPI()

@app.get("/")
def hello():
    return {"message": "Hola world!"}

@app.get("/search")
def search(text):
    return search_text(text, faiss_index, encoding_model, list(dataset.values()), dataset)