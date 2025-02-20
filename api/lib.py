import json
import faiss
from sentence_transformers import SentenceTransformer

def init(encoding_model=None, dataset_json=None):
    model = SentenceTransformer(encoding_model)

    data_json = open(dataset_json, "r")
    dataset = json.load(data_json)

    texts = list(dataset.values())

    embeddings = model.encode(texts)

    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)

    return index, model, dataset

def search_text(query_text, index, model, texts, dataset, k=15):
    query_embedding = model.encode([query_text])
    distances, indices = index.search(query_embedding, k)
    similar_texts = [texts[idx] for idx in indices[0]]

    image_paths = []

    for key, value in dataset.items():
        if (value in similar_texts):
            img_item = {
                "img": f"images/{key}",
                "title": value
            }
            image_paths.append(img_item)

    return image_paths