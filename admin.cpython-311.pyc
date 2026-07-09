import json
import uuid
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path

try:
    from pymongo import MongoClient
except Exception:  # pragma: no cover
    MongoClient = None


def utc_now():
    return datetime.now(timezone.utc).isoformat()


class Store:
    """Small storage adapter.

    Uses MongoDB when MONGO_URI is set. Otherwise stores collections as JSON files.
    This keeps the project easy to run for demos while remaining compatible with MongoDB Atlas.
    """

    def __init__(self, mongo_uri="", mongo_db_name="hope_app", data_dir="data"):
        self.mongo_uri = mongo_uri or ""
        self.mongo_db_name = mongo_db_name
        self.data_dir = Path(data_dir)
        self.client = None
        self.db = None

        if self.mongo_uri and MongoClient is not None:
            self.client = MongoClient(self.mongo_uri)
            self.db = self.client[self.mongo_db_name]
            self.kind = "mongodb"
        else:
            self.data_dir.mkdir(parents=True, exist_ok=True)
            self.kind = "json"

    def _file(self, collection):
        return self.data_dir / f"{collection}.json"

    def _load(self, collection):
        path = self._file(collection)
        if not path.exists():
            path.write_text("[]", encoding="utf-8")
        return json.loads(path.read_text(encoding="utf-8") or "[]")

    def _save(self, collection, docs):
        self._file(collection).write_text(json.dumps(docs, indent=2), encoding="utf-8")

    def all(self, collection):
        if self.db is not None:
            docs = list(self.db[collection].find({}, {"_id": 0}))
            return docs
        return self._load(collection)

    def find(self, collection, predicate=None, limit=None):
        docs = self.all(collection)
        if predicate:
            docs = [doc for doc in docs if predicate(doc)]
        if limit:
            docs = docs[: int(limit)]
        return docs

    def find_one(self, collection, predicate):
        matches = self.find(collection, predicate, limit=1)
        return matches[0] if matches else None

    def get(self, collection, item_id):
        return self.find_one(collection, lambda doc: doc.get("id") == item_id)

    def count(self, collection):
        if self.db is not None:
            return self.db[collection].count_documents({})
        return len(self._load(collection))

    def insert(self, collection, doc):
        item = deepcopy(doc)
        item.setdefault("id", str(uuid.uuid4()))
        now = utc_now()
        item.setdefault("createdAt", now)
        item["updatedAt"] = now

        if self.db is not None:
            self.db[collection].insert_one(deepcopy(item))
        else:
            docs = self._load(collection)
            docs.append(item)
            self._save(collection, docs)
        return item

    def update(self, collection, item_id, patch):
        now = utc_now()
        if self.db is not None:
            update = deepcopy(patch)
            update["updatedAt"] = now
            self.db[collection].update_one({"id": item_id}, {"$set": update})
            return self.get(collection, item_id)

        docs = self._load(collection)
        for index, doc in enumerate(docs):
            if doc.get("id") == item_id:
                docs[index].update(deepcopy(patch))
                docs[index]["updatedAt"] = now
                self._save(collection, docs)
                return docs[index]
        return None

    def delete(self, collection, item_id):
        if self.db is not None:
            result = self.db[collection].delete_one({"id": item_id})
            return result.deleted_count > 0
        docs = self._load(collection)
        remaining = [doc for doc in docs if doc.get("id") != item_id]
        self._save(collection, remaining)
        return len(remaining) != len(docs)
