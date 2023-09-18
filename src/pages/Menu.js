import React,{useState,useEffect} from 'react';
import Cookies from 'universal-cookie';
import '../css/Menu.css';
import {useNavigate } from 'react-router-dom'
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../components/functions';

const ShowPedidos = () =>{

    const navigate = useNavigate();
    const cookies = new Cookies();

    const cerrarSesion=()=>{
        cookies.remove('usuarioID', {path: '/'});
        cookies.remove('usuario', {path: '/'});
        cookies.remove('rolID', {path: '/'});
        cookies.remove('abreviatura',{path: '/'});
        cookies.remove('token', {path: '/'});
        navigate('/');
    }

    useEffect(()=>{
        if(!cookies.get('usuarioID')){
            navigate('/');
        }
    },[]);

    const url='https://localhost:7222/api/pedido/filtroPedido';
    const [pedidos,setPedididos]=useState([]);
    const [pedidoID,setPedidoID]=useState('');
    const [fecha,setFecha]=useState('');
    const [vendedor,setVendedor]=useState('');
    const [dni,setDni]=useState('');
    const [cliente,setCliente]=useState('');

    const url2='https://localhost:7222/api/pedido/detallePedido';
    const [detallePedido,setDetallePedidido]=useState([]);
    const [productoID,setProductoID]=useState('');
    const [producto,setProducto]=useState('');
    const [cantidad,setCantidad]=useState('');
    const [precioUnitari,setPrecioUnitario]=useState('');
    const [subTotal,setSubTotal]=useState('');

    useEffect( ()=>{
        getPedidos();
    },[]);

    const getPedidos = async() => {
        let a = document.getElementById('IpedidoID').value;
        let b = document.getElementById('Idni').value;
        if(a==''){
            a=0;
        }
        await axios.post(url,{'pedidoID':a,'dni':b},{
            headers:{
                'Authorization':'Bearer ' + cookies.get('token')
            }})
        .then(Response=>{
            return Response.data;
        }).then(response=>{
            if(response.data.length>0){
                var respuesta=response;
                setPedididos(respuesta.data);
            }else{
                alert('Pedido no encontrado...');
            }
            console.log(respuesta.data);
        }).catch(error=>{
            console.log(error);
        })
        document.getElementById('IpedidoID').value='';
        document.getElementById('Idni').value='';
    }

    const getDetallePedido = async(pedidoID) => {
        await axios.post(url2,{'pedidoID':pedidoID},{
            headers:{
                'Authorization':'Bearer ' + cookies.get('token')
            }})
        .then(Response=>{
            return Response.data;
        }).then(response=>{
            if(response.data.length>0){
                var respuesta=response;
                setDetallePedidido(respuesta.data[0].detallePedido);

            }else{
                alert('Su Token expiro inicie sesion nuevamente.');
            }
            console.log(respuesta.data[0].detallePedido);
        }).catch(error=>{
            console.log(error);
        })
    }

    
    const openModal = (op,pedidoID,fecha,vendedor,dni,cliente)=>{
        getDetallePedido(pedidoID);
        if(op==1){
            setPedidoID(pedidoID);
            setFecha(fecha);
            setVendedor(vendedor);
            setDni(dni);
            setCliente(cliente);
        }
    }

    return(
        <div className="menu">
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-md-4 offset-4'>
                        <div className='d-grid mx-auto'>
                            <br></br>
                            <div>
                                <center><label>Filtros</label></center>
                                
                                <hr></hr>
                            </div>
                            <div className='input-group mb-3'>
                                <span clasname='input-group-text'><i clasname='fa-solid fa-gift'></i></span>
                                <input type='text' id='IpedidoID' className='form-control' placeholder='productoID'></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span clasname='input-group-text'><i clasname='fa-solid fa-gift'></i></span>
                                <input type='text' id='Idni' className='form-control' placeholder='DNI'></input>
                            </div>

                            <button className='btn btn-dark' onClick={()=>getPedidos()} >
                                <i className='fa-solid fa-circle-plus'></i>Consultar
                            </button>

                        </div>
                    </div>
                </div>
                <div className='row mt-3'>
                    <div className='col-12 col-lg-12 offset-0 offset-lg-12'>
                        <div className='table-responsive'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr><th>PedidoID</th><th>Fecha</th><th>Vendedor</th><th>dni</th><th>Cliente</th><th>Ver</th></tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    { pedidos.map((pedido,pedidoID)=>(
                                        <tr key={pedido.pedidoID}>
                                            <td>{(pedido.pedidoID)}</td>
                                            <td>{pedido.fecha}</td>
                                            <td>{pedido.vendedor}</td>
                                            <td>{pedido.dni}</td>
                                            <td>{pedido.cliente}</td>
                                            <td>
                                                <center>
                                                    <button onClick={()=>openModal(1,pedido.pedidoID,pedido.fecha,pedido.vendedor,pedido.dni,pedido.cliente)} 
                                                        className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalDetalle'>
                                                        <i className='fa-solid fa-edit'></i> Detalle
                                                    </button>
                                                </center>
                                            </td>
                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div id='modalDetalle' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>Detalle Pedidos</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
                        </div>
                        <div className='modal-body'>
                        <input type='hidden' id='pedidoID'></input>


                            <div className="row mt-12">
                                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <label>pedidoID:</label>
                                    <input type="text" id='pedidoID' className='form-control' value={pedidoID} disabled="disabled"  onChange={(e)=> setPedidoID(e.target.value)}></input>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-7 col-xs-12">
                                    <label>Fecha: </label>
                                    <input type="text" id='fecha' className='form-control' value={fecha} disabled="disabled"  onChange={(e)=> setFecha(e.target.value)}></input>
                                </div>
                            </div>

                            <div className="row mt-12">
                                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <label>Vendedor:</label>
                                    <input type="text" id='vendedor' className='form-control' value={vendedor} disabled="disabled"  onChange={(e)=> setVendedor(e.target.value)}></input>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <label>DNI: </label>
                                    <input type="text" id='dni' className='form-control' value={dni} disabled="disabled"  onChange={(e)=> setDni(e.target.value)}></input>
                                </div>
                            </div>
                            
                            <div className="row mt-12">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <label>Cliente:</label>
                                    <input type="text" id='cliente' className='form-control' value={cliente} disabled="disabled"  onChange={(e)=> setCliente(e.target.value)}></input>
                                </div>
                            </div>

                            <hr></hr>

                            <div className='row mt-12'>
                                <div className='col-12 col-lg-12 offset-0 offset-lg-12'>
                                    <div className='table-responsive'>
                                        <table className='table table-bordered'>
                                            <thead>
                                                <tr><th>productoID</th><th>producto</th><th>cantidad</th><th>precioUnitario</th><th>subtotal</th></tr>
                                            </thead>
                                            <tbody className='table-group-divider'>
                                                { detallePedido.map((detallepedido,productoID)=>(
                                                    <tr key={detallepedido.productoID}>
                                                        <td>{(detallepedido.productoID)}</td>
                                                        <td>{detallepedido.producto}</td>
                                                        <td>{detallepedido.cantidad}</td>
                                                        <td>{detallepedido.precioUnitario}</td>
                                                        <td>{detallepedido.subTotal}</td>
                                                    </tr>
                                                ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className='modal-footer'>
                                <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>cerrar</button>
                        </div>
                    </div>

                </div>
            </div>
            <div className='container-fluid'>
                <center> 
                    <button className='btn btn-danger' onClick={()=>cerrarSesion()}>
                        Cerrar Sesión
                    </button>
                </center>
            </div>

        </div>
    )
}




export default ShowPedidos;