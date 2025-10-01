import { use, useEffect, useState } from "react";
import style from './Todo.module.css'
import toast from "react-hot-toast";


function TodoList() {

    const [tasks, tasksState] = useState(JSON.parse((localStorage.getItem('tasks'))) || []);

    const [newTask, setNewTask] = useState('');

    const [editIndex,setEditIndex] = useState(null);
    const [editText,setEditText] = useState('');

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks])

    function inputChange(e) {
        setNewTask(e.target.value);
    }

    function editInputChange(e) {
        setEditText(e.target.value);
    }

    function addTask() {

        if (!newTask.trim() == '') {
            tasksState([...tasks, newTask]);

            setDeadlines([...deadlines,date]);
            
            //toast
            toast.success('Task Added!')
            setNewTask("");
            setDate("");

        } else {
            toast.error("No Task Mentioned..!")
        }
    }

    function deleteTask(index) {
        const updateTasks = tasks.filter((elem, i) => {
            if (index == i) {
                return false;
            } else {
                return true;
            }
        });
        const updateDeadline=deadlines.filter((elem,i)=>{
            if (index == i) {
                return false;
            } else {
                return true;
            }
        });

        toast.success('Task Removed..🗑️')
        tasksState(updateTasks);
        setDeadlines(updateDeadline);
    }

    function moveUp(index) {
        if (!index == 0) {

            //for tasks
            const updateTasks = [...tasks];
            [updateTasks[index], updateTasks[index - 1]] = [updateTasks[index - 1], updateTasks[index]];
            tasksState(updateTasks);

            //for deadlines
            const updateDeadlines = [...deadlines];
            [updateDeadlines[index], updateDeadlines[index - 1]] = [updateDeadlines[index - 1], updateDeadlines[index]];
            setDeadlines(updateDeadlines);

        }
    }

    function moveDown(index) {
        if (index != tasks.length - 1) {

            //for tasks
            const updateTasks = [...tasks];
            [updateTasks[index], updateTasks[index + 1]] = [updateTasks[index + 1], updateTasks[index]];
            tasksState(updateTasks);

            //for deadlines
            const updateDeadlines = [...deadlines];
            [updateDeadlines[index], updateDeadlines[index + 1]] = [updateDeadlines[index + 1], updateDeadlines[index]];
            setDeadlines(updateDeadlines);

        }
    }

    function editTask(index,elem) {

        setEditIndex(index);
        setEditText(elem);
        
    }

    function cancelEdit() {
        setEditIndex(null);
    }

    function saveEdit() {
       const updatedTask = tasks.map((task,index)=>{
            if(index==editIndex) {
                return editText
            }else {
                return task;
            }
        });

        tasksState(updatedTask);
        toast.success("Task Updated..");
        setEditIndex(null);
    }

    //completed functionalitty

    const [completeIndex,setCompleteIndex] = useState(JSON.parse(localStorage.getItem('completedTasks')) || []);

    useEffect(()=>{
        localStorage.setItem('completedTasks',JSON.stringify(completeIndex))
    },[completeIndex]);


    function completed(index) {
        if(completeIndex.includes(index)) {
            setCompleteIndex(completeIndex.filter((elem)=>{
                if(elem==index) {
                    return false;
                }else {
                    return true;
                }
            }));
        } else {
            const updateIndex=[...completeIndex,index];
            setCompleteIndex(updateIndex);
        }
    }

    //deadlineFunctionality

    const[date,setDate]=useState('');
    const [deadlines,setDeadlines]=useState(JSON.parse(localStorage.getItem('deadlines')) || []);

    useEffect(()=>{
        localStorage.setItem('deadlines',JSON.stringify(deadlines));
    },[deadlines]);

    function dateChange(event) {
        setDate(event.target.value);
    } 

    //pending task..!
    useEffect(()=>{
        const today=new Date;
        const formated=today.toISOString().split('T')[0];
        
        deadlines.forEach((date,index)=>{
            let d1=new Date(formated);
            let d2=new Date(date);

            if(d1.getTime()>d2.getTime()) {
                toast.error(`${tasks[index]} Not Completed..!!`);
            }
        })
    },[]);
    

    return <>
        <span className={style.taskBox}>
        <input className={style.inputbox} placeholder="Enter a new Task.." onChange={inputChange} value={newTask}></input>
        <span><input type="date" className={style.datePicker} onChange={dateChange} value={date}></input></span>
        <button className={style.btn} onClick={addTask}>ADD</button>
        </span>
        <ol>
            {tasks.map((elem, index) => {

                return (
                    <li key={index}>
                        {
                        (editIndex==index) ? (
                            <>
                            <input className={style.inputEdit} onChange={editInputChange} value={editText}></input>
                            <button className={style.editbtn} onClick={saveEdit}>Save</button>
                            <button className={style.deletebtn} onClick={cancelEdit}>Cancel</button>
                            </>
                        ) : (
                            <>
                            <input type="checkbox" className={style.checkbox} checked={completeIndex.includes(index)} onChange={()=>completed(index)}></input>
                            <span className={

                                (completeIndex.includes(index)) ? style.completed : style.text

                            }>{elem}</span>
                            {(completeIndex.includes(index)) ? <span className={style.statusBadge}>Completed</span> : 
                            <>
                                <span className={style.deadlineText}>Deadline:{(deadlines[index]) ? deadlines[index].split('-').reverse().join('/') : 'Today'}</span>
                                <button className={style.editbtn} onClick={()=>editTask(index,elem)}> <i className="fas fa-pen"></i></button>
                                <button className={style.deletebtn} onClick={() => deleteTask(index)}><i className="fas fa-trash"></i></button>
                                <button className={style.upbtn} onClick={() => moveUp(index)}><i className="fas fa-arrow-up"></i></button>
                                <button className={style.downbtn} onClick={() => moveDown(index)}><i className="fas fa-arrow-down"></i></button>
                            </>
                            }
                            
                            </>
                        )}
                    </li>

                )
            })}
        </ol>
    </>
}

export default TodoList;