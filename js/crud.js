//Conexion base de datos
var db = openDatabase("registroDB","1.0","Base de datos de registro del parqueadero",2*1024*124);
// crear tabla
//var t_producto = "CREATE TABLE  producto(id real uniqute,nombre text, valor number)";
var t_registro = "CREATE TABLE  registro(id INTEGER PRIMARY KEY AUTOINCREMENT, placa VARCHAR (6) NOT NULL,marca VARCHAR (50) NOT NULL,color VARCHAR (50) NOT NULL)";
// creamos la query de inseercion
var t_registro_insert ="INSERT INTO registro(placa,marca,color) VALUES(?,?,?)";
//queryde consulta
var t_registro_consult ="SELECT * FROM registro ORDER BY id DESC";
var t_registro_delete ="DROP TABLE registro";
//consultar secuencia
var t_registro_sequence= " select sec_codigolibros.currval from dual";

let numerofilas;

var idModificar;
var modificando=false;

function NumeroSecuencia(){
    db.transaction(function (tx) {
        var sql = " select *from all_sequences;";
        tx.executeSql(sql,[],function() {},function (tx, result) {
            console.log(result);
        },
        function(tx,error){
            console.log("Hubo un error: " + error.message);
        });
        
    });
}

function limpiar() {
    document.getElementById("placa").value = "";
    document.getElementById("marca").value = "";
    document.getElementById("color").value = "";
  };

function modificarProducto(r){
    idModificar= r.id.substring(9);
    console.log(idModificar);
    //idModificar=r.id[(r.id.length-1)];
    db.transaction(function (tx){
        tx.executeSql(t_registro_consult,undefined,function(tx,result){
            if (result.rows.length) {
                for (let index = 0; index < result.rows.length; index++) {
                    var row=result.rows.item(index);
                    if(idModificar==row.id){
                        document.getElementById("boleto").value=(row.id);
                        document.getElementById("placa").value=(row.placa);
                        document.getElementById("marca").value =(row.marca);
                        document.getElementById("color").value= (row.color);
                    }
                    
                }
            }
        },
        function(tx,error){
            console.log("Hubo un error: " + error.message);
        });
    });
    modificando=true;
}
function  eliminarProducto(r){
    //var i=r.parentNode.parentNode.rowIndex;
    //document.getElementById("customers").deleteRow(i);
    //console.log(i);
    var i= r.id.substring(8);
    console.log(i);
    //var i=r.id[(r.id.length-1)];
    db.transaction(function (tx) {
        var sql = "DELETE FROM registro WHERE id="+i+";";
        tx.executeSql(sql,[],function() {},function (tx, result) {
            console.log(result);
        },
        function(tx,error){
            console.log("Hubo un error: " + error.message);
        });
        
    });
    cargarDatos()
    
};


function consultarNumeros(){
    db.transaction(function(tx) {
        tx.executeSql(t_registro_consult,undefined,function(tx, result){
            document.getElementById("boleto").value=(result.rows.length+1);
            
        })
    });
};


function cargarDatos(){
            db.transaction(function(tx) {
                tx.executeSql(t_registro_consult,undefined,function(tx, result){
                    if (result.rows.length) {
                        document.getElementById("filas").innerHTML="";
                         {
                            var row = result.rows.item(i);
                            var placa = row.placa;
                            var id = row.id;
                            var marca = row.marca;
                            var color = row.color;
                            var fila ='<tr id="fila' + id +'"><td><span>X' + id +'</span></td><td><span>' + placa +'</span></td><td><span>' + marca +'</span></td><td><span>' + color +'</span></td><td><button id="modificar'+id+'" onclick="modificarProducto(this)"><img src="img/modificar.png"/></button></td><td><button id="eliminar'+id+'" onclick="eliminarProducto(this)"><img src="img/eliminar.png"/></button></td></tr>';
                            var btn= document.createElement("TR");
                            btn.innerHTML=fila;
                            document.getElementById("filas").appendChild(btn);
                        }
                    }else {
                        document.getElementById("filas").innerHTML="No existen registros";
                             
                    }
                },
                function (tx, err) {
                    alert(err.message);
                });
            });
            //var filaTotal=document.getElementById("listaProductos").rows.length;
            //var filaTotal= document.getElementById('filas');
            //var fi= document.getElementsByTagName("tr").length;
            //var ff= fi.length;
            //console.log(fi);
};

function borrarTabla(){
    /*db.transaction(function (tx) {
        tx.executeSql(t_registro_delete,[],function() {},function (tx, err) {
            alert(err.message);
        });
    });*/
    db.transaction(function (tx) {
        tx.executeSql("DROP TABLE registro",[],function() {},function (tx, result) {
            console.log(result);
        },
        function(tx,error){
            console.log("Hubo un error: " + error.message);
        });
});
 crearTabla();
}

//*/
function agregar(){
    var placa = document.getElementById("placa").value;
    var marca = document.getElementById("marca").value;
    var color = document.getElementById("color").value;
    if(modificando==false){
        db.transaction(function (tx) {
            tx.executeSql(t_registro_insert,[placa, marca,color],function() {},function (tx, err) {
                alert(err.message);
            });
        });
    }else{
        modificando=false;
        db.transaction(function (tx) {
            var sql="UPDATE registro SET placa='"+ placa +"',marca='"+ marca +"',color='"+ color +"' WHERE id="+ idModificar +"";
            tx.executeSql(sql,undefined,function() {
                console.log("modificado correctamente");
            },
            function(tx,error){
                console.log("Hubo un error: " + error.message);
            });

        });
    }
    limpiar();
    cargarDatos();
    consultarNumeros();
};

function crearTabla(){
    db.transaction(function(tx){
        tx.executeSql(t_registro,[],function (tx,result) {
            console.log("la tabla se creo con exito")
        },
        function(tx,error){
            console.log("Hubo un error: " + error.message);
        });
    });
};

(function(){
    //creacion de tabla
    consultarNumeros();
    db.transaction(function(tx){
        tx.executeSql(t_registro,[],function (tx,result) {
            console.log("la tabla se creo con exito")
        },
        function(tx,error){
            console.log("Hubo un error: " + error.message);
        });
    });
    cargarDatos();
    NumeroSecuencia();
    
    


})();