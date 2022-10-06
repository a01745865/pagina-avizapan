import axios from "axios";
import { useEffect, useState } from "react";
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
const labelsMonth = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function labelsYearNotif(data){
    const years = []
    data.forEach(notif => {
        let fecha = new Date(notif.notification_posted);
        let año = fecha.getFullYear();
        if(!years.find(element => element === año)) years.push(año)
    });
    years.sort();
    return years;
}
function getOcurrenciesNotifDates(data, labels){
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
// -> Falta hacer los dataset dependiendo de las categorias
const dataSet = [
    {
        label: 'Vialidad',
        data: [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
    },
    {
        label: 'Climatológica',
        data: [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
    },
    {
        label: 'Sismológica',
        data: [],
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
    },
    {
        label: 'Protección Civil',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
    },
]

function getDataSetCategories(data, labels) {
    dataSet.forEach(category => {
        let categoryId = 0
        if (category.label === 'Vialidad') categoryId = 1
        else if (category.label === 'Climatológica') categoryId = 2
        else if (category.label === 'Sismológica') categoryId = 5
        else if (category.label === 'Protección Civil') categoryId = 6
        let newData = data.filter((notification) => notification.notification_categoryId === categoryId);
        let ocurrencies = getOcurrenciesNotifDates(newData, labels);
        category.data = ocurrencies;
    });
    return dataSet;
} 

/*Line Chart Users */
async function getUsersData({setUsersData}){
    try{
        const {data} = await axios.get(`${url}tokens/date`);
        setUsersData(data);
    }catch{
        setUsersData(null);
    }
}

function labelsYearUsers(data){
    const years = []
    data.forEach(user => {
        let fecha = new Date(user.added);
        let año = fecha.getFullYear();
        if(!years.find(element => element === año)) years.push(año)
    });
    years.sort();
    return years;
}

function getOcurrenciesUsersDates(data, labels){
    const tipo = labels[0] === 'Enero' ? 'mes' : 'año' ;
    const ocurrencies = [];
    labels.forEach(_ => {
        ocurrencies.push(0);
    });
    if (tipo === 'mes'){
        data.forEach(token => {
            var fecha = new Date(token.added);
            var mes = fecha.getMonth();
            ocurrencies[mes - 1] = ocurrencies[mes - 1] + 1;
        });
    } else{
        //Para que sirva esto falta saber como crear el array con los años que se tengan registrados
        data.forEach(token => {
            var fecha = new Date(token.added);
            var año = fecha.getFullYear();
            var index = labels.findIndex((year) => year === año);
            ocurrencies[index] = ocurrencies[index] + 1;
        });
    }
    return ocurrencies;
}

function Dashboard(){
    //Notifications Data
    const [data, setData] = useState();
    //Data for the PieChart of Notifications p/ category
    const [labelsCategory, setLabelsCategory] = useState([]);
    const [datasetCategory, setDatasetCategory] = useState([]);
    //Data for the LineChart of Notifications b/ date
    const titleNotifDate = 'Notificaciones por Fecha';
    const [labelsNotifDate, setLabelsNotifDate] = useState(labelsMonth);
    const [labelDataNotifDate, setLabelDataNotifDate] = useState('Notificaciones al mes');
    const [dataSetNotifDate, setDataSetNotifDate] = useState();
    const [labelsNotifType, setLabelsNotifType] = useState(false);
    const [setType, setSetType] = useState(false);
    //Dataset for the Notifications by Categories by Date
    const [dataSetsCategories, setDataSetsCategories] = useState(null);
    //Data for the LineChart of Users b/date
    const titleUsersDate = 'Usuarios por Fecha';
    const [labelsUsersDate, setLabelsUsersDate] = useState(labelsMonth);
    const [labelDataUsersDate, setLabelDataUsersDate] = useState('Usuarios al mes');
    const [dataSetUsersDate, setDataSetUsersDate] = useState();
    const [usersData, setUsersData] = useState();
    const [labelsUsersType, setLabelsUsersType] = useState(false);
    /**/

    //This helps to the functionality of the radio buttons of the stats
    useEffect(()=>{
        if (data){
            if(labelsNotifType){
                setLabelsNotifDate(labelsYearNotif(data));
                setLabelDataNotifDate('Notificaciones al año');
            }else{
                setLabelsNotifDate(labelsMonth);
                setLabelDataNotifDate('Notificaciones al mes');
            } 
        }
    }, [labelsNotifType]);

    useEffect(()=>{
        if(data && !dataSetsCategories) setDataSetNotifDate(getOcurrenciesNotifDates(data, labelsNotifDate));
    }, [labelsNotifDate]);

    useEffect(()=>{
        if(usersData){
            if(labelsUsersType){
                setLabelsUsersDate(labelsYearUsers(usersData));
                setLabelDataUsersDate('Usuarios al año');
            }else{ 
                setLabelsUsersDate(labelsMonth);
                setLabelDataUsersDate('Usuarios al mes');
            }
        }
    }, [labelsUsersType]);

    useEffect(()=>{
        if (usersData) setDataSetUsersDate(getOcurrenciesUsersDates(usersData, labelsUsersDate));
    }, [labelsUsersDate]);

    useEffect(()=>{
        if (setType && data && labelsNotifDate) setDataSetsCategories(getDataSetCategories(data, labelsNotifDate));
        else setDataSetsCategories(null);
    }, [setType, labelsNotifDate])

    //Data from the db
    if (!usersData) getUsersData({setUsersData});
    if (!data) datosNotificaciones({setData});
    //PieChart categories
    if (labelsCategory.length === 0) getLabelsCategory({setLabelsCategory});
    if (datasetCategory.length === 0 && data) setDatasetCategory(getDatasetCategory({data}));
    //Notifications
    if(!dataSetNotifDate && data && labelsNotifDate) setDataSetNotifDate(getOcurrenciesNotifDates(data, labelsNotifDate));
    //Users
    if(!dataSetUsersDate && usersData && labelsUsersDate) setDataSetUsersDate(getOcurrenciesUsersDates(usersData, labelsUsersDate));
    
    return(
        <div className="dashboard">
            <h1 className="dash-title">Estadísticas</h1>
            <div className="estadisticas">
                <div>
                    <Example labels={labelsCategory} dataset={datasetCategory} />
                </div>
                <div>
                    <ExampleLine text={titleNotifDate} labels={labelsNotifDate} label={labelDataNotifDate} ocurrencies={dataSetNotifDate} dataSets={dataSetsCategories} />
                    <div className="buttons-div">
                        <div class="d-flex my-switch align-items-center justify-content-center">
                            <h2 class="form-text text-1">General</h2>
                            <div id="switch-div" class="form-check form-switch form-check-inline">
                                <input id="revenue" class="form-check-input form-check-inline" type="checkbox" onChange={e => {setSetType(!setType);}} ></input>
                            </div>
                            <h2 class="form-text text-1">Categoría</h2>
                        </div>
                        <div class="d-flex my-switch align-items-center justify-content-center">
                            <h2 class="form-text text-1">Mes</h2>
                            <div id="switch-div" class="form-check form-switch form-check-inline">
                                <input id="revenue" class="form-check-input form-check-inline" type="checkbox" onChange={e => {setLabelsNotifType(!labelsNotifType);}} ></input>
                            </div>
                            <h2 class="form-text text-1">Año</h2>
                        </div>
                    </div>
                    
                </div>
                <div>
                    <ExampleLine text={titleUsersDate} labels={labelsUsersDate} label={labelDataUsersDate} ocurrencies={dataSetUsersDate}/>
                    <div className="buttons-div">
                        <div class="d-flex my-switch align-items-center justify-content-center">
                            <h2 class="form-text text-1">Mes</h2>
                            <div id="switch-div" class="form-check form-switch form-check-inline">
                                <input id="revenue" class="form-check-input form-check-inline" type="checkbox" onChange={e => {setLabelsUsersType(!labelsUsersType);}} ></input>
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