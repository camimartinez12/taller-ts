// Taller de TypeScript
// Se corre con: npx tsc y después node dist/main.js

// Traigo la función sumar del archivo utils.ts (la uso al final)
import { sumar } from './utils';

// ---------- 1. Tipado estático ----------
// Después del nombre le pongo el tipo de dato a cada variable
let productoNombre: string = "Laptop";   // texto
let productoPrecio: number = 1200;       // número
let productoEnStock: boolean = true;     // true o false

// ❌ Esto da error porque el precio es number y le estoy dando un texto
// productoPrecio = "mil doscientos";

console.log(productoNombre, productoPrecio, productoEnStock);

// ---------- 2. any y unknown ----------
// any: acepta cualquier cosa y no revisa nada
// unknown: no sé qué tipo es, entonces tengo que revisarlo antes de usarlo
// Esto simula datos que llegan de una API
let datosAPI: unknown = JSON.parse('{"nombre": "tablet", "precio": 300}');

// Reviso que sea un objeto y que no esté vacío
if (typeof datosAPI === 'object' && datosAPI !== null) {
  // ✅ Ya lo revisé, ahora le digo qué forma tiene
  let producto = datosAPI as { nombre: string, precio: number };
  console.log(producto.nombre);
}

// ---------- 3. void y never ----------
// void: la función no devuelve nada, solo imprime
function registrarMensaje(mensaje: string): void {
  console.log("LOG:", mensaje);
}

// never: la función nunca termina bien porque siempre lanza un error
function detenerProceso(razon: string): never {
  throw new Error(`Proceso detenido: ${razon}`);
}

registrarMensaje("Aplicación iniciada");

// detenerProceso("error fatal"); // ❌ Si la llamo, el programa se para aquí

// ---------- 4. Arrays, tuplas y enums ----------
// Array: lista de números, puede tener los que sean
let usuariosIDs: number[] = [101, 102, 103];

// Tupla: solo puede tener 2 números (latitud y longitud)
let gpsCoordenadas: [number, number] = [40.7128, -74.0060];

// Enum: lista de opciones con nombre. Por dentro son números: 0, 1, 2, 3
enum EstadoOrden { Pendiente, Enviada, Entregada, Cancelada };
let miOrdenEstado: EstadoOrden = EstadoOrden.Enviada;

// Sale 1 (el número) y después "Enviada" (el nombre)
console.log(usuariosIDs, gpsCoordenadas, miOrdenEstado, EstadoOrden[miOrdenEstado]);

// ---------- 5. Union types, type aliases e intersection types ----------
// Con type le pongo un nombre a un tipo
// El | significa que puede ser texto o número
type ID = string | number;
let miId: ID = "a-123";

type Empleado = { nombre: string, email: string };

// El & junta los dos: un Desarrollador tiene lo de Empleado y además lenguaje y senioridad
type Desarrollador = Empleado & { lenguaje: string, senioridad: "junior" | "senior" };

// Tiene que tener las 4 propiedades o da error
let nuevoDev: Desarrollador = {
  nombre: "Carlos",
  email: "carlos@empresa.com",
  lenguaje: "TypeScript",
  senioridad: "junior"
};

console.log(miId, nuevoDev);

// ---------- 6. Parámetros de funciones ----------
// nombre = 'Desconocido': si no mando nombre, usa ese
// titulo?: es opcional, puedo no mandarlo
// ...amigos: puedo mandar todos los amigos que quiera
function saludar(nombre: string = 'Desconocido', titulo?: string, ...amigos: string[]): string {
  // Si hay título lo pongo antes del nombre
  let saludo = titulo ? `${titulo} ${nombre}` : nombre;

  // Si mandé amigos, los agrego al saludo
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
// La interfaz dice qué propiedades debe tener el objeto
interface Usuario {
  readonly id: number; // no se puede cambiar después
  nombre: string;      // obligatorio
  email?: string;      // opcional
}

// Lo puedo crear sin email porque es opcional
let usuario: Usuario = { id: 10, nombre: "Luis" };
// usuario.id = 11; // ❌ Error, el id no se puede cambiar
usuario.email = "luis@correo.com"; // ✅ Este sí se puede

console.log(usuario);

// ---------- 8. Clases y modificadores de acceso ----------
// public: se puede usar desde cualquier parte
// protected: solo en la clase y en las que heredan de ella
// private: solo dentro de la misma clase
class Vehiculo {
  protected ruedas: number;

  // El constructor se ejecuta cuando creo el objeto con new
  constructor(ruedas: number) {
    this.ruedas = ruedas;
  }
  public arrancar(): void {
    console.log("El vehículo está arrancando.");
  }
}

// Coche hereda de Vehiculo, entonces también tiene ruedas y arrancar
class Coche extends Vehiculo {
  public marca: string;
  private _velocidad: number = 0;

  constructor(ruedas: number, marca: string) {
    super(ruedas); // llama al constructor de Vehiculo
    this.marca = marca;
  }

  // Aquí puedo usar ruedas porque es protected
  public getInfo(): void {
    console.log(`Este coche tiene ${this.ruedas} ruedas.`);
  }

  // La velocidad es private, solo la cambio con este método
  public acelerar(cantidad: number): void {
    this._velocidad += cantidad;
  }
}

const miCoche = new Coche(4, "Toyota"); // creo mi coche
miCoche.arrancar();   // viene de Vehiculo
miCoche.getInfo();
miCoche.acelerar(50);
// miCoche._velocidad = 100; // ❌ Error, es private

// ---------- 9. Genéricos ----------
// La T es un tipo que escojo cuando uso la clase
// Así la misma Cola me sirve para números, textos, etc.
class Cola<T> {
  private items: T[] = [];

  // Mete un elemento al final
  agregar(item: T): void {
    this.items.push(item);
  }

  // Saca el primero que entró
  obtenerPrimerElemento(): T | undefined {
    return this.items.shift();
  }
}

// Cola de números
const colaNumeros = new Cola<number>();
colaNumeros.agregar(10);
colaNumeros.agregar(20);
const primerNumero = colaNumeros.obtenerPrimerElemento(); // sale 10
console.log(primerNumero);

// Cola de textos
const colaCadenas = new Cola<string>();
colaCadenas.agregar('Pepe');
colaCadenas.agregar('Maria');
const primerNombre = colaCadenas.obtenerPrimerElemento(); // sale Pepe
console.log(primerNombre);

// ---------- 10. Módulos ----------
// Uso la función sumar que está en el otro archivo
const resultado = sumar(5, 10);
console.log(`El resultado de la suma es: ${resultado}`);
