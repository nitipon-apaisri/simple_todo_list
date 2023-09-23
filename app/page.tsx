"use client";
import { Input, Checkbox, Space, Divider, Row, Col, Button } from "antd";
import { useEffect, useState } from "react";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import style from "./page.module.css";
const Home = () => {
    const [todos, setTodos] = useState<string[]>([]);
    const [done, setDone] = useState<string[]>([]);
    const [todo, setTodo] = useState<string>("");
    const [editTodo, setEditTodo] = useState<string>("");
    const [editTodoIndex, setEditTodoIndex] = useState<number | null>(null);
    const addTodo = (todo: string) => {
        setTodos([...todos, todo]);
        setTodo("");
        localStorage.setItem("todos", JSON.stringify([...todos, todo]));
    };
    const toggleDone = (e: CheckboxChangeEvent, index: number) => {
        if (e.target.checked) {
            setDone([...done, todos[index]]); // add to done
            setTodos(todos.filter((_, i) => i !== index)); // remove from todos
            setEditTodoIndex(null);
            setEditTodo("");
            localStorage.setItem("done", JSON.stringify([...done, todos[index]]));
            localStorage.setItem("todos", JSON.stringify(todos.filter((_, i) => i !== index)));
        } else {
            setTodos([...todos, done[index]]); // add to todos
            setDone(done.filter((_, i) => i !== index)); // remove from done
            localStorage.setItem("todos", JSON.stringify([...todos, done[index]]));
            localStorage.setItem("done", JSON.stringify(done.filter((_, i) => i !== index)));
        }
    };
    const edit = (index: number, value: string) => {
        setTodos(todos.map((todo, i) => (i === index ? value : todo)));
        setEditTodoIndex(null);
    };
    const toggleEditTodo = (index: number, value: string) => {
        setEditTodoIndex(index);
        setEditTodo(value);
    };
    const cancelEditTodo = () => {
        setEditTodoIndex(null);
        setEditTodo("");
    };
    useEffect(() => {
        // get todos from localStorage on page load
        const todos = localStorage.getItem("todos");
        const done = localStorage.getItem("done");
        if (todos) {
            setTodos(JSON.parse(todos));
        }
        if (done) {
            setDone(JSON.parse(done));
        }
    }, []);
    return (
        <div className={style.todo_list_wrapper}>
            <Row gutter={16}>
                <Col span={12}>
                    <h1>Todo List</h1>
                    <div className={style.list}>
                        {todos.map((todo, index) => (
                            <div key={index}>
                                <Space>
                                    <Space>
                                        <Checkbox checked={false} onChange={(e) => toggleDone(e, index)} />
                                        {editTodoIndex === index ? (
                                            <Input value={editTodo} onChange={(e) => setEditTodo(e.target.value)} onPressEnter={(e) => edit(index, (e.target as HTMLTextAreaElement).value)} />
                                        ) : (
                                            <span>{todo}</span>
                                        )}
                                    </Space>
                                    <Space>
                                        <span className={style.delete} onClick={() => setTodos(todos.filter((_, i) => i !== index))}>
                                            Delete
                                        </span>
                                        {editTodoIndex === index ? (
                                            <span className={style.edit} onClick={cancelEditTodo}>
                                                Cancel
                                            </span>
                                        ) : (
                                            <span className={style.edit} onClick={() => toggleEditTodo(index, todo)}>
                                                Edit
                                            </span>
                                        )}
                                    </Space>
                                </Space>
                            </div> // <-- new
                        ))}
                    </div>
                </Col>
                <Col span={12}>
                    <h1>Check</h1>
                    <div className={style.list}>
                        {done.map((todo, index) => (
                            <div key={index}>
                                <Space>
                                    <Checkbox onChange={(e) => toggleDone(e, index)} checked={true} />
                                    <span className={style.checked}>{todo}</span>
                                </Space>
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>

            <Divider />
            <Row gutter={16}>
                <Col span={22}>
                    <Input placeholder="Add Todo" value={todo} onChange={(e) => setTodo(e.target.value)} onPressEnter={(e) => addTodo(todo)} />
                </Col>
                <Col span={2}>
                    <Button type="primary" onClick={() => addTodo(todo)}>
                        Add
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default Home;
