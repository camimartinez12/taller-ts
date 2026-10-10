// Taller de TypeScript: Conceptos Fundamentales
// Para ejecutar: npx tsc (transpila a JavaScript) y luego node dist/main.js

// Importa la función sumar desde el archivo utils.ts (se usa en el ejercicio 10)
import { sumar } from './utils';

// ---------- 1. Tipado estático ----------
// Después del nombre de la variable se escribe su tipo (: string, : number, : boolean).
// TypeScript revisa esos tipos antes de ejecutar el código.
let productoNombre: string = "Laptop";   // solo acepta texto
let productoPrecio: number = 1200;       // solo acepta números
let productoEnStock: boolean = true;     // solo acepta true o false

// ❌ El editor te mostrará un error aquí: no se puede guardar un texto en una variable number
// productoPrecio = "mil doscientos";

console.log(productoNombre, productoPrecio, productoEnStock);

// ---------- 2. any y unknown ----------
// any: desactiva la revisión de tipos (se pierde la ventaja de TypeScript).
// unknown: tampoco se sabe el tipo, pero obliga a comprobarlo antes de usar la variable.
// Aquí se simula la respuesta de una API: JSON.parse convierte el texto en un objeto.
let datosAPI: unknown = JSON.parse('{"nombre": "tablet", "precio": 300}');

// Se verifica que sea un objeto y que no sea null antes de acceder a sus propiedades
if (typeof datosAPI === 'object' && datosAPI !== null) {
  // ✅ Comprobación para acceder de forma segura
  // "as" le indica a TypeScript qué forma tiene el objeto
  let producto = datosAPI as { nombre: string, precio: number };
  console.log(producto.nombre);
}

// ---------- 3. void y never ----------
// void: la función no devuelve ningún valor, solo hace algo (aquí, imprimir un mensaje)
function registrarMensaje(mensaje: string): void {
  console.log("LOG:", mensaje);
}

// never: la función nunca termina normalmente, porque siempre lanza un error
function detenerProceso(razon: string): never {
  throw new Error(`Proceso detenido: ${razon}`);
}

registrarMensaje("Aplicación iniciada");

// detenerProceso("error fatal"); // ❌ Si se llama, el programa se detiene aquí

// ---------- 4. Arrays, tuplas y enums ----------
// Array: lista de elementos del mismo tipo, puede crecer o reducirse
let usuariosIDs: number[] = [101, 102, 103];

// Tupla: array de tamaño fijo, con un tipo definido para cada posición (latitud, longitud)
let gpsCoordenadas: [number, number] = [40.7128, -74.0060];

// Enum: conjunto de constantes con nombre. Por dentro son números: Pendiente = 0, Enviada = 1...
enum EstadoOrden { Pendiente, Enviada, Entregada, Cancelada };
let miOrdenEstado: EstadoOrden = EstadoOrden.Enviada;

// miOrdenEstado imprime 1 y EstadoOrden[miOrdenEstado] imprime su nombre: "Enviada"
console.log(usuariosIDs, gpsCoordenadas, miOrdenEstado, EstadoOrden[miOrdenEstado]);

// ---------- 5. Union types, type aliases e intersection types ----------
// Type alias: un nombre propio para un tipo.
// Union type (|): el valor puede ser de un tipo o del otro.
type ID = string | number;
let miId: ID = "a-123"; // también sería válido: let miId: ID = 123;

type Empleado = { nombre: string, email: string };

// Intersection type (&): combina tipos. Un Desarrollador tiene todo lo de Empleado
// y además lenguaje y senioridad (que solo puede ser "junior" o "senior").
type Desarrollador = Empleado & { lenguaje: string, senioridad: "junior" | "senior" };

// El objeto debe tener las cuatro propiedades; si falta una, TypeScript marca error
let nuevoDev: Desarrollador = {
  nombre: "Carlos",
  email: "carlos@empresa.com",
  lenguaje: "TypeScript",
  senioridad: "junior"
};

console.log(miId, nuevoDev);

// ---------- 6. Parámetros de funciones ----------
// nombre = 'Desconocido' -> valor por defecto: se usa si no se envía el argumento
// titulo?                -> parámetro opcional: puede no enviarse (queda undefined)
// ...amigos              -> parámetro rest: recibe cualquier cantidad de argumentos en un array
// : string (al final)    -> tipo de dato que devuelve la función
function saludar(nombre: string = 'Desconocido', titulo?: string, ...amigos: string[]): string {
  // Si hay título, lo pone antes del nombre; si no, deja solo el nombre
  let saludo = titulo ? `${titulo} ${nombre}` : nombre;

  // Si se enviaron amigos, los une separados por coma y los agrega al saludo
  if (amigos.length > 0) {
    saludo += `, y tus amigos ${amigos.join(', ')}`;
  }
  return `Hola, ${saludo}.`;
}

console.log(saludar()); // Hola, Desconocido.
console.log(saludar("Ana")); // Hola, Ana.
console.log(saludar("Pedro", "Sr.")); // Hola, Sr. Pedro.
console.log(saludar("Maria", undefined, "Juan", "Pedro")); // Hola, Maria, y tus amigos Juan, Pedro.
console.log(saludar(undefined, undefined, "Juan", "Pedro")); // Hola, Desconocido, y tus amigos Juan, Pedro.

// ---------- 7. Interfaces ----------
// Una interfaz define la "forma" que debe tener un objeto
interface Usuario {
  readonly id: number; // solo lectura: no se puede cambiar después de crear el objeto
  nombre: string;      // obligatoria
  email?: string;      // opcional: el objeto puede no tenerla
}

// Es válido crearlo sin email porque esa propiedad es opcional
let usuario: Usuario = { id: 10, nombre: "Luis" };
// usuario.id = 11; // ❌ Error, es de solo lectura
usuario.email = "luis@correo.com"; // ✅ Válido

console.log(usuario);

// ---------- 8. Clases y modificadores de acceso ----------
// Una clase es un plano para crear objetos. Los modificadores controlan quién ve cada miembro:
// public    -> se puede usar desde cualquier parte
// protected -> solo dentro de la clase y de las clases que heredan de ella
// private   -> solo dentro de la misma clase
class Vehiculo {
  protected ruedas: number;

  // El constructor se ejecuta al crear el objeto con "new"
  constructor(ruedas: number) {
    this.ruedas = ruedas;
  }
  public arrancar(): void {
    console.log("El vehículo está arrancando.");
  }
}

// "extends" indica herencia: Coche recibe las propiedades y métodos de Vehiculo
class Coche extends Vehiculo {
  public marca: string;
  private _velocidad: number = 0;

  constructor(ruedas: number, marca: string) {
    super(ruedas); // llama al constructor de la clase padre (Vehiculo)
    this.marca = marca;
  }

  // Puedes acceder a 'this.ruedas' porque es 'protected'
  public getInfo(): void {
    console.log(`Este coche tiene ${this.ruedas} ruedas.`);
  }

  // Métodos que manipulan la propiedad 'private'
  public acelerar(cantidad: number): void {
    this._velocidad += cantidad;
  }
}

const miCoche = new Coche(4, "Toyota"); // crea un objeto de la clase Coche
miCoche.arrancar();   // método heredado de Vehiculo
miCoche.getInfo();    // método propio de Coche
miCoche.acelerar(50); // cambia _velocidad por medio de un método público
// miCoche._velocidad = 100; // ❌ Error, es privado

// ---------- 9. Genéricos ----------
// <T> es un tipo "variable": se decide cuál es al momento de usar la clase.
// Así una sola clase Cola sirve para números, textos o cualquier otro tipo,
// sin tener que escribir una clase distinta para cada uno.
class Cola<T> {
  private items: T[] = [];

  // Agrega un elemento al final de la cola
  agregar(item: T): void {
    this.items.push(item);
  }

  // Saca y devuelve el primer elemento (undefined si la cola está vacía)
  obtenerPrimerElemento(): T | undefined {
    return this.items.shift();
  }
}

// Aquí T es number: esta cola solo acepta números
const colaNumeros = new Cola<number>();
colaNumeros.agregar(10);
colaNumeros.agregar(20);
const primerNumero = colaNumeros.obtenerPrimerElemento(); // Tipo: number
console.log(primerNumero);

// Aquí T es string: esta cola solo acepta textos
const colaCadenas = new Cola<string>();
colaCadenas.agregar('Pepe');
colaCadenas.agregar('Maria');
const primerNombre = colaCadenas.obtenerPrimerElemento(); // Tipo: string
console.log(primerNombre);

// ---------- 10. Módulos ----------
// Los módulos permiten dividir el código en varios archivos.
// sumar está definida en utils.ts y se importó en la primera línea de este archivo.
const resultado = sumar(5, 10);
console.log(`El resultado de la suma es: ${resultado}`);
