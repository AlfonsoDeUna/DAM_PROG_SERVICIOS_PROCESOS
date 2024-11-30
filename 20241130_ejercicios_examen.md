# Ejercicios preparar examen


## Ejercicios básicos de hilos
---

### **Ejercicio 1: Cajero Automático**  
Un banco tiene un cajero automático que funciona como un sistema productor-consumidor. El sistema central del banco (productor) repone efectivo en el cajero, mientras que los clientes (consumidores) retiran dinero. Implementa un programa que simule este flujo, con un buffer que represente el efectivo disponible y una capacidad máxima que limite la cantidad de dinero en el cajero. Asegúrate de que los clientes esperen si el cajero está vacío y el sistema central espere si está lleno.

---

### **Ejercicio 2: Transferencias entre Cuentas**  
Un banco maneja transferencias entre cuentas mediante un sistema compartido. Los productores son las transacciones entrantes, que aumentan el saldo de las cuentas, y los consumidores son las transferencias salientes, que lo disminuyen. Simula este escenario con un buffer que represente el flujo de transferencias en proceso, asegurando que nunca se realicen transferencias que dejen las cuentas con saldo negativo y que las transacciones se procesen en orden.

---

### **Ejercicio 3: Almacén de Productos**  
Una empresa maneja un almacén donde los trabajadores (productores) descargan cajas y los transportistas (consumidores) las recogen para su distribución. Implementa un sistema en el que el almacén tiene una capacidad limitada y el flujo de cajas debe gestionarse de manera que los trabajadores esperen si el almacén está lleno y los transportistas esperen si está vacío. Simula el llenado y vaciado del almacén con un buffer compartido.

---

### **Ejercicio 4: Sistema de Reservas de Asientos en un Cine**  
Un cine gestiona sus reservas mediante un sistema en el que los clientes (productores) solicitan entradas y los empleados (consumidores) confirman o rechazan las reservas. Simula este sistema con un buffer que represente la capacidad de las salas, asegurándote de que las reservas se procesen en orden y no se exceda la cantidad máxima de asientos disponibles.

---

### **Ejercicio 5: Cocina de Restaurante**  
En un restaurante, los chefs (productores) preparan platos que se colocan en una barra, y los camareros (consumidores) los recogen para llevarlos a las mesas. Implementa un sistema que gestione este flujo, con un buffer que represente los platos en la barra y una capacidad máxima que impida que los chefs coloquen más platos de los que caben. Asegúrate de que los camareros esperen si la barra está vacía y los chefs esperen si está llena.

---

## SINCRONIZAR HILOS

Aquí tienes cinco enunciados variados, dos de ellos relacionados con bancos y cuentas, y los otros con contextos diferentes:

---

### **Ejercicio 1: Cajero Automático**  
Un banco tiene un cajero automático que funciona como un sistema productor-consumidor. El sistema central del banco (productor) repone efectivo en el cajero, mientras que los clientes (consumidores) retiran dinero. Implementa un programa que simule este flujo, con un buffer que represente el efectivo disponible y una capacidad máxima que limite la cantidad de dinero en el cajero. Asegúrate de que los clientes esperen si el cajero está vacío y el sistema central espere si está lleno.

---

### **Ejercicio 2: Transferencias entre Cuentas**  
Un banco maneja transferencias entre cuentas mediante un sistema compartido. Los productores son las transacciones entrantes, que aumentan el saldo de las cuentas, y los consumidores son las transferencias salientes, que lo disminuyen. Simula este escenario con un buffer que represente el flujo de transferencias en proceso, asegurando que nunca se realicen transferencias que dejen las cuentas con saldo negativo y que las transacciones se procesen en orden.

---

### **Ejercicio 3: Almacén de Productos**  
Una empresa maneja un almacén donde los trabajadores (productores) descargan cajas y los transportistas (consumidores) las recogen para su distribución. Implementa un sistema en el que el almacén tiene una capacidad limitada y el flujo de cajas debe gestionarse de manera que los trabajadores esperen si el almacén está lleno y los transportistas esperen si está vacío. Simula el llenado y vaciado del almacén con un buffer compartido.

---

### **Ejercicio 4: Sistema de Reservas de Asientos en un Cine**  
Un cine gestiona sus reservas mediante un sistema en el que los clientes (productores) solicitan entradas y los empleados (consumidores) confirman o rechazan las reservas. Simula este sistema con un buffer que represente la capacidad de las salas, asegurándote de que las reservas se procesen en orden y no se exceda la cantidad máxima de asientos disponibles.

---

### **Ejercicio 5: Cocina de Restaurante**  
En un restaurante, los chefs (productores) preparan platos que se colocan en una barra, y los camareros (consumidores) los recogen para llevarlos a las mesas. Implementa un sistema que gestione este flujo, con un buffer que represente los platos en la barra y una capacidad máxima que impida que los chefs coloquen más platos de los que caben. Asegúrate de que los camareros esperen si la barra está vacía y los chefs esperen si está llena.

---

### De productor consumidor
Aquí tienes algunos enunciados contextualizados en un estilo relacionado con bancos y cuentas:

---

### **Ejercicio 1: Cajero Automático**
Un banco tiene un cajero automático que funciona como un productor-consumidor. El productor es el sistema central del banco, que repone efectivo en el cajero, y el consumidor son los clientes que retiran dinero. Implementa un sistema que permita simular este escenario con un buffer de capacidad limitada que represente la cantidad de billetes disponibles en el cajero. Asegúrate de que el sistema funcione correctamente cuando el cajero está lleno (esperar para reponer) o vacío (esperar para retirar).

---

### **Ejercicio 2: Transferencias entre Cuentas**
En un sistema bancario, los productores son los usuarios que realizan depósitos en sus cuentas y los consumidores son usuarios que realizan transferencias o retiros. Implementa un sistema en el que varias cuentas compartan un buffer común que represente el saldo total disponible para transferencias. Asegúrate de que las transferencias se procesen correctamente, evitando saldos negativos, y que los depósitos se acumulen en orden de llegada.

---

### **Ejercicio 3: Operaciones en Ventanilla**
Un banco maneja las solicitudes de sus clientes a través de un sistema de ventanilla. Los productores son los clientes que ingresan solicitudes de depósitos, retiros o consultas, y el consumidor es el empleado que procesa dichas solicitudes. Implementa un sistema que permita manejar estas solicitudes en un orden FIFO, asegurándote de que no se acumulen más solicitudes de las que la ventanilla puede manejar en un momento dado.

---

### **Ejercicio 4: Procesamiento de Pagos**
Un banco debe procesar una lista de pagos programados para sus clientes. Los productores son los sistemas de clientes que envían las órdenes de pago, y el consumidor es el sistema central que las procesa en un orden secuencial. Implementa un sistema que permita manejar este flujo, asegurando que las órdenes de pago no se pierdan si el sistema de procesamiento está ocupado y que los clientes esperen si el buffer de órdenes está lleno.

---

### **Ejercicio 5: Cajero Automático Multibanco**
Un banco tiene un sistema multibanco en el que varios cajeros automáticos comparten un buffer común para el manejo de efectivo. Los productores son los sistemas centrales que reponen efectivo en los cajeros, y los consumidores son los clientes que retiran dinero desde distintos cajeros. Implementa un sistema que permita simular este escenario, asegurándote de que el flujo de efectivo sea sincronizado y que los clientes no intenten retirar más dinero del disponible.

---


