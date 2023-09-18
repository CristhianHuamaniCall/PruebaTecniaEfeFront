import React,{useState,useEffect} from 'react';
import md5 from 'md5';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'universal-cookie';
import axios from 'axios';
import '../css/Login.css';
import {useNavigate } from 'react-router-dom'

function Login(props){

    const navigate = useNavigate();
    const baseUrl="https://localhost:7222/api/usuario/login";
    const cookies = new Cookies();

    const [form,setForm]= useState({
        username:'',
        password:''
        });
    const handleChange=e=>{
        const{name,value} = e.target;
        setForm({
            ...form,[name]: value
        });
    }

    const IniciarSesion=async()=>{
        await axios.post(baseUrl,{'usuario':form.username,'password':form.password})
        .then(Response=>{
            return Response.data;
        }).then(response=>{
            if(response.data.length>0){
                var respuesta=response;
                
                cookies.set('usuarioID',respuesta.data[0].usuarioID, {path: '/'});
                cookies.set('usuario',respuesta.data[0].usuario, {path: '/'});
                cookies.set('rolID',respuesta.data[0].rolID, {path: '/'});
                cookies.set('abreviatura',respuesta.data[0].abreviatura, {path: '/'});
                cookies.set('token',respuesta.data[0].token, {path: '/'});
                navigate('/menu');

            }else{
                alert('El Usuario o la contraseña no son correctos');
            }
        }).catch(error=>{
            console.log(error);
        })
    }

    useEffect(()=>{
        if(cookies.get('usuarioID')){
            navigate('/menu');            
        }
    },[]);


    return(

        <div className="containerPrincipal">
            <div className="containerLogin">
                <div className="form-group">
                    <label>Usuario: </label>
                    <br/>
                    <input type="text" className="form-control" name="username" onChange={handleChange}/>
                    <br/>
                    <label>Contraseña: </label>
                    <br/>
                    <input type="password" className="form-control" name="password" onChange={handleChange} />
                    <br />
                    <button className="btn btn-primary" onClick={()=>IniciarSesion()}>Iniciar Sesión </button>
                </div>
            </div>
        </div>    

    );
}

export default Login;