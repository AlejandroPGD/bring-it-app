import React from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { cleanUserState, getActiveUser } from "../actions/index";
import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/Usuario.module.css";
import { Avatar, AvatarBadge } from "@chakra-ui/react";
import { SpinnerCircularFixed } from "spinners-react";
import {desactivateUser, cleanUsers, cleanBusiness} from '../actions'




const Usuario = () => {

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch(); 

  const history = useHistory();
  const business = useSelector((state) => state.business)


  useEffect(() => {
    dispatch(getActiveUser());
  }, [dispatch]);

 function handleDesactivate(e){
    e.preventDefault()
    dispatch(desactivateUser(user.email));
    dispatch(cleanUsers());
    history.push('/')
    
 }

 function handleCloseSessionBusiness(e){
    e.preventDefault()
    dispatch(cleanBusiness())
    history.push('/')
 }


 function handleCloseSesion(e){
    e.preventDefault()    
    dispatch(cleanUserState());
    history.push('/')
 }
  return (
    
    <div style={{height: '70vh', background: 'white', marginTop: '30vh'}}>
        {console.log(user, business)}
      {user !== 'clean' && Object.entries(user).length > 0 ? (
        <div>
          <div>
            <Avatar name={`${user.name} ${user.lastname}`} src="">
              <AvatarBadge boxSize="1.25em" bg="green.500" />
            </Avatar>
          </div>
          <div >
            <h1> {`Hola ${user.name} ${user.lastname} !`}</h1>
            <h1>Mi Email: {user.email}</h1>
            <h1>Mi Fecha De Nacimiento: {user.birthDate}</h1>
            <h1>Mi Número de Teléfono: {user.phone}</h1>
          </div>

          <div className={styles.contBotones}>
            <button
              className="btn btn-primary"
              onClick={() => history.push("/persona/misviajes")}
            >
              Mis Viajes
            </button>
            <button
              className="btn btn-primary"
              onClick={() => history.push("/persona/homeUserPurchase")}
            >
              Mis Compras
            </button>
            <button
              className="btn btn-primary"
              onClick={() => history.push("/persona/modificarPassword")}
            >
              Modificar Contraseña
            </button>           
            <button
              className="btn btn-primary"
              onClick={() => history.goBack()}
            >
              Volver
            </button>
            <button
              className="btn btn-primary"
              onClick={(e)=> handleCloseSesion(e)}
            >
              Cerrar Sesion
            </button>
            <button
              className="btn btn-primary"
              onClick={(e) => handleDesactivate(e)}
            >
              Desactivar Cuenta
            </button>
          </div>
        </div>
      ) : business !== 'clean'&& business !== 'Usuario no encontrado' && Object.entries(business).length > 0 ?(
        <div>
          <div>
            <Avatar name={`${business.businessName}`} src="">
              <AvatarBadge boxSize="1.25em" bg="green.500" />
            </Avatar>
          </div>
          <div >
            <h1> {`Hola ${business.businessName} !`}</h1>
            <h1>Mi Email: {business.email}</h1>          
            <h1>Mi Número de Teléfono: {business.phone}</h1>
          </div>

          <div className={styles.contBotones}>         
         
            <button
              className="btn btn-primary"
              onClick={() => history.push("/persona/modificarPassword")}
            >
              Modificar Contraseña
            </button>           
            <button
              className="btn btn-primary"
              onClick={() => history.push("/empresas")}
            >
             Gestionar Productos
            </button>           
            <button
              className="btn btn-primary"
              onClick={() => history.goBack()}
            >
              Volver
            </button>
            <button
              className="btn btn-primary"
              onClick={(e)=> handleCloseSessionBusiness(e)}
            >
              Cerrar Sesion
            </button>
            <button
              className="btn btn-primary"
            //   onClick={(e) => handleDesactivateBusiness(e)}
            onClick={()=> alert('falta esto')}
            >
              Desactivar Cuenta
            </button>
          </div>
        </div>




      ):(
        <div className={styles.spinner}>
          <SpinnerCircularFixed
            size={250}
            thickness={100}
            speed={100}
            color="rgba(210, 105, 30, 1)"
            secondaryColor="rgba(210, 105, 30, 0.23)"
          />
        </div>
      )}
    </div>
  );
};

export default Usuario;