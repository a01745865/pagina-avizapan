import Navbar from './navbar';
import Form from './form';
import { useState } from 'react';

function Avisos({setSuccess, adminId}){
    const [pagina, setPagina] = useState(<Form id={adminId}/>);
    return (
        <>
            <Navbar setSuccess={setSuccess} setPagina={setPagina}/>
            {pagina}
        </>
    );
}

export default Avisos
