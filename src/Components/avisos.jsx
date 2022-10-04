import Navbar from './navbar';
import Form from './form';
import { useState } from 'react';

function Avisos(){
    const [pagina, setPagina] = useState(<Form/>);
    return (
        <>
            <Navbar setPagina={setPagina}/>
            {pagina}
        </>
    );
}

export default Avisos
