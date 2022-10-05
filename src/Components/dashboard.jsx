import axios from "axios";
import { useState } from "react";
import "../Styles/styleDashboard.css";
//Charts
import Example from "./Charts/pieChart";
import ExampleLine from "./Charts/lineChart";
import PruebaMap from "./map";

const url = "http://localhost:4000/";

async function datosNotificaciones({setData}){
    try{
        const {data} = await axios.get(`${url}notifications`);
        setData(data);
    }catch{
        setData(null);
    }
}

/*Pie Char*/
//Obtener los labels 
async function getLabelsCategory({setLabelsCategory}){
    try{
        const labelsCategory = []
        const {data} = await axios.get(`${url}categories`);
        await data.forEach(category => {
            labelsCategory.push(category.category.toUpperCase());
        });
        if (labelsCategory.length > 0) setLabelsCategory(labelsCategory);
    }catch{
        setLabelsCategory([]);
    }
}
//Obtener el dataset - cantidad de notificaciones por categorias
function getDatasetCategory({data}){
    // 1 - vialidad
    // 2 - climatologica
    // 5 - sismologica
    // 6 - proteccion civil
    const datasetCategory = [0, 0, 0, 0]
    data.forEach(notification => {
        if (notification.notification_categoryId === 1) datasetCategory[0] += 1;
        else if (notification.notification_categoryId === 2) datasetCategory[1] += 1;
        else if (notification.notification_categoryId === 5) datasetCategory[2] += 1;
        else if (notification.notification_categoryId === 6) datasetCategory[3] += 1;
    });
    return datasetCategory;
}
 
/*Line Chart Notifications*/
//Definir el text - titulo 
//Definir Labels - Sera los años o meses
const labelsNotifDateMonth = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
//Definir el label de data set - Será breve descr
//Definir data - Ocurrencias dependiendo del tiempo (meses, años)
function getOcurrenciesPDate(data, labels){
    const tipo = labels[0] === 'Enero' ? 'mes' : 'año' ;
    const ocurrencies = [];
    labels.forEach(_ => {
        ocurrencies.push(0);
    });
    if (tipo === 'mes'){
        data.forEach(notification => {
            var fecha = new Date(notification.notification_posted);
            var mes = fecha.getMonth();
            ocurrencies[mes - 1] = ocurrencies[mes - 1] + 1;
        });
    } else{
        //Para que sirva esto falta saber como crear el array con los años que se tengan registrados
        data.forEach(notification => {
            var fecha = new Date(notification.notification_posted);
            var año = fecha.getFullYear();
            var index = labels.findIndex((year) => year === año);
            ocurrencies[index] = ocurrencies[index] + 1;
        });
    }
    return ocurrencies;
}
/*Line Chart Users */
//Obtener la informacion de los usuarios
async function getUsersData({setUsersData}){
    try{
        const {data} = await axios.get(`${url}tokens/date`);
        setUsersData(data);
    }catch{
        setUsersData(null);
    }
}


function Dashboard(){
    //Notifications Data
    const [data, setData] = useState();
    //Data for the PieChart of Notifications p/ category
    const [labelsCategory, setLabelsCategory] = useState([]);
    const [datasetCategory, setDatasetCategory] = useState([]);
    //Data for the LineChart of Notifications b/ date
    const titleNotifDate = 'Notificaciones por Fecha';
    const [labelsNotifDate, setLabelsNotifDate] = useState(labelsNotifDateMonth);
    const [labelDataNotifDate, setLabelDataNotifDate] = useState('Notificaciones al mes');
    const [dataSetNotifDate, setDataSetNotifDate] = useState();
    //Data for the LineChart of Users b/date
    const titleUsersDate = 'Usuarios por Fecha';
    const [labelsUsersDate, setLabelsUsersDate] = useState();
    const [labelDataUsersDate, setLabelDataUsersDate] = useState('Usuarios al mes');
    const [dataSetUsersDate, setDataSetUsersDate] = useState();
    const [usersData, setUsersData] = useState();
    /**/
    if (!usersData) getUsersData({setUsersData});
    if (!data) datosNotificaciones({setData});
    if (labelsCategory.length === 0) getLabelsCategory({setLabelsCategory});
    if (datasetCategory.length === 0 && data) setDatasetCategory(getDatasetCategory({data}));
    if (!dataSetNotifDate && data && labelDataNotifDate) setDataSetNotifDate(getOcurrenciesPDate(data, labelsNotifDate));

    return(
        <div className="dashboard">
            <h1 className="dash-title">Estadísticas</h1>
            <div className="estadisticas">
                <div>
                    <Example labels={labelsCategory} dataset={datasetCategory} />
                </div>
                <div>
                    <ExampleLine text={titleNotifDate} labels={labelsNotifDate} label={labelDataNotifDate} ocurrencies={dataSetNotifDate}/>
                    <div className="buttons-div">
                        <div class="d-flex my-switch align-items-center justify-content-center">
                            <h2 class="form-text text-1">General</h2>
                            <div id="switch-div" class="form-check form-switch form-check-inline">
                                <input id="revenue" class="form-check-input form-check-inline" type="checkbox"></input>
                            </div>
                            <h2 class="form-text text-1">Categoría</h2>
                        </div>
                        <div class="d-flex my-switch align-items-center justify-content-center">
                            <h2 class="form-text text-1">Mes</h2>
                            <div id="switch-div" class="form-check form-switch form-check-inline">
                                <input id="revenue" class="form-check-input form-check-inline" type="checkbox"></input>
                            </div>
                            <h2 class="form-text text-1">Año</h2>
                        </div>
                    </div>
                    
                </div>
                <div>
                    <ExampleLine text={titleUsersDate} labels={labelsNotifDate} label={labelDataUsersDate} ocurrencies={dataSetNotifDate}/>
                    <div className="buttons-div">
                        <div class="d-flex my-switch align-items-center justify-content-center">
                            <h2 class="form-text text-1">Mes</h2>
                            <div id="switch-div" class="form-check form-switch form-check-inline">
                                <input id="revenue" class="form-check-input form-check-inline" type="checkbox"></input>
                            </div>
                            <h2 class="form-text text-1">Año</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="estad">
                <PruebaMap/>
            </div>
        </div>
    );
}

export default Dashboard