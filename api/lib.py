import json
import faiss
from sentence_transformers import SentenceTransformer

def init(encoding_model=None, dataset_json=None):
    model = SentenceTransformer(encoding_model)

    with open(dataset_json, "r", encoding="utf-8") as data_json:
        dataset = json.load(data_json)

    search_items = [
        {
            "img": f"images/{key}",
            "title": value
        }
        for key, value in dataset.items()
    ]
    texts = [item["title"] for item in search_items]

    embeddings = model.encode(texts)

    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)

    return index, model, search_items

def search_text(query_text, index, model, search_items, offset=0, limit=15):
    item_count = len(search_items)

    if limit <= 0 or offset < 0 or offset >= item_count:
        return []

    query_embedding = model.encode([query_text])
    result_count = min(item_count, offset + limit)
    _, indices = index.search(query_embedding, result_count)

    return [search_items[idx] for idx in indices[0][offset : offset + limit]]
