import Navbar from './navbar';
import Form from './form';
import { useState } from 'react';

function Avisos({setSuccess}){
    const [pagina, setPagina] = useState(<Form/>);
    return (
        <>
            <Navbar setSuccess={setSuccess} setPagina={setPagina}/>
            {pagina}
        </>
    );
}

export default Avisos
