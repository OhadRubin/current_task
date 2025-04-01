from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Task model
class Task(BaseModel):
    id: str
    name: str
    timeframe: str
    completed: bool

# Task input model (for creating/updating)
class TaskCreate(BaseModel):
    name: str
    timeframe: str
    completed: Optional[bool] = False

# In-memory database
tasks = [
    {"name": "Finish ray implementation", "timeframe": "20 hours", "completed": False, "id": "1"},
    {"name": "Finish database project", "timeframe": "6 days", "completed": False, "id": "2"},
    {"name": "Finish courses", "timeframe": "4.5 months", "completed": False, "id": "3"},
    {"name": "Finish PhD", "timeframe": "4.42 years", "completed": False, "id": "4"},
    {"name": "Succeed", "timeframe": "33.15 years", "completed": False, "id": "5"},
]

@app.get("/")
def read_root():
    return {"message": "Task API is running"}

@app.get("/tasks", response_model=List[Task])
def get_tasks():
    return tasks

@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: str):
    for task in tasks:
        if task["id"] == task_id:
            return task
    raise HTTPException(status_code=404, detail="Task not found")

@app.post("/tasks", response_model=Task)
def create_task(task: TaskCreate):
    new_task = task.dict()
    new_task["id"] = str(uuid4())[:8]  # Generate a short ID
    tasks.append(new_task)
    return new_task

@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: str, task_update: TaskCreate):
    for i, task in enumerate(tasks):
        if task["id"] == task_id:
            updated_task = task_update.dict()
            updated_task["id"] = task_id
            tasks[i] = updated_task
            return updated_task
    raise HTTPException(status_code=404, detail="Task not found")

@app.patch("/tasks/{task_id}/toggle", response_model=Task)
def toggle_task_completion(task_id: str):
    for i, task in enumerate(tasks):
        if task["id"] == task_id:
            tasks[i]["completed"] = not tasks[i]["completed"]
            return tasks[i]
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    for i, task in enumerate(tasks):
        if task["id"] == task_id:
            deleted_task = tasks.pop(i)
            return {"message": f"Task '{deleted_task['name']}' deleted successfully"}
    raise HTTPException(status_code=404, detail="Task not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
