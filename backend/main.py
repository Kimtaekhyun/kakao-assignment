import os
from datetime import datetime, date
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends, status, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Date, func
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from pydantic import BaseModel, ConfigDict
from dotenv import load_dotenv


dotenv_path = os.path.join(os.path.dirname(__file__), ".env.local")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
else:
    load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")



engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=True)
    is_completed = Column(Boolean, default=False)
    target_date = Column(Date, default=date.today, nullable=False)
    created_at = Column(DateTime, server_default=func.now())


Base.metadata.create_all(bind=engine)


class TodoCreate(BaseModel):
    title: str
    content: Optional[str] = None
    target_date: Optional[date] = None

class TodoUpdate(BaseModel):
    title: str
    content: Optional[str] = None
    is_completed: bool
    target_date: Optional[date] = None

class TodoResponse(BaseModel):
    id: int
    title: str
    content: Optional[str] = None
    is_completed: bool
    target_date: date
    created_at: datetime


    model_config = ConfigDict(from_attributes=True)

app = FastAPI(title="FastAPI Todo API", version="1.0.0")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Todo API",
        "status": "healthy"
    }




@app.get("/todos", response_model=List[TodoResponse], status_code=status.HTTP_200_OK)
def read_todos(
    filter: Optional[str] = None,
    search: Optional[str] = None,
    week: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Todo)


    if filter == "active":
        query = query.filter(Todo.is_completed == False)
    elif filter == "completed":
        query = query.filter(Todo.is_completed == True)


    if search:
        search_filter = Todo.title.contains(search) | Todo.content.contains(search)
        query = query.filter(search_filter)


    if week:
        try:
            year_str, week_str = week.split("-W")
            year = int(year_str)
            wk = int(week_str)

            start_date = date.fromisocalendar(year, wk, 1)
            end_date = date.fromisocalendar(year, wk, 7)
            query = query.filter(Todo.target_date >= start_date, Todo.target_date <= end_date)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid week format. Expected YYYY-Www (e.g., 2026-W26)"
            )

    todos = query.order_by(Todo.target_date.asc(), Todo.id.desc()).all()
    return todos


@app.post("/todos", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    db_todo = Todo(
        title=todo.title,
        content=todo.content,
        target_date=todo.target_date if todo.target_date else date.today()
    )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo


@app.put("/todos/{id}", response_model=TodoResponse, status_code=status.HTTP_200_OK)
def update_todo(id: int, todo_update: TodoUpdate, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == id).first()
    if not db_todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {id} not found"
        )

    db_todo.title = todo_update.title
    db_todo.content = todo_update.content
    db_todo.is_completed = todo_update.is_completed
    if todo_update.target_date:
        db_todo.target_date = todo_update.target_date

    db.commit()
    db.refresh(db_todo)
    return db_todo


@app.delete("/todos/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(id: int, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == id).first()
    if not db_todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {id} not found"
        )

    db.delete(db_todo)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
