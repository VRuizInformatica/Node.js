import requests

class Aviones:
    API_URL_NODE = "http://localhost:3000"
    API_URL_SPRING = "http://localhost:8080"
    API_URL = API_URL_NODE

    def set_server(server_type):
        if server_type.lower() == "node":
            Aviones.API_URL = Aviones.API_URL_NODE
        else:
            Aviones.API_URL = Aviones.API_URL_SPRING
        print(f"Usando servidor: {Aviones.API_URL}")

    def mostrar_localizaciones():
        try:
            response = requests.get(f"{Aviones.API_URL}/ciudades")
            if response.status_code == 200:
                ciudades = response.json()
                print("\nLocalizaciones disponibles (ID - Nombre):")
                for ciudad in ciudades:
                    print(f"  {ciudad['id']} - {ciudad['nombre']}")
            else:
                print("Error al obtener las localizaciones.")
        except requests.ConnectionError:
            print("No se pudo conectar al servidor.")

    def calcular_ruta(origen, destino, omit=None):
        try:
            params = {"origen": origen, "destino": destino}
            if omit:
                params["omit"] = omit.strip()

            response = requests.get(
                f"{Aviones.API_URL}/ruta",
                params=params
            )
            return response.json()
        except requests.ConnectionError:
            return {"error": "No se pudo conectar al servidor"}

    def simular_vuelo(ruta):
        if not ruta or len(ruta) < 2:
            print("Ruta insuficiente para simular vuelo.")
            return

        print(f"\nIniciando simulación de vuelo en la ruta: {ruta}")
        for i in range(len(ruta) - 1):
            actual = ruta[i]
            siguiente = ruta[i+1]
            input(f"Pulsa Enter para volar de {actual} a {siguiente}...")
            print(f"Llegaste a {siguiente}.\n")
        print("Fin de la simulación.\n")


class Program:
    def main():
        while True:
            print("\n=== MENÚ PRINCIPAL ===")
            print("1. Seleccionar servidor (Node.js o SpringBoot)")
            print("2. Mostrar todas las localizaciones")
            print("3. Calcular y simular la mejor ruta (sin omitir)")
            print("4. Calcular y simular la mejor ruta omitiendo una ciudad")
            print("5. Salir")
            opcion = input("Elige una opción (1-5): ")

            if opcion == "1":
                server = input("Elige el servidor (node/spring): ")
                Aviones.set_server(server)

            elif opcion == "2":
                Aviones.mostrar_localizaciones()

            elif opcion == "3":
                origen = input("Introduce el ID de la ciudad de origen: ")
                destino = input("Introduce el ID de la ciudad de destino: ")
                resultado = Aviones.calcular_ruta(origen, destino)
                if "error" in resultado:
                    print(f"Error: {resultado['error']}")
                else:
                    ruta = resultado.get("ruta", [])
                    distancia = resultado.get("distancia", "N/A")
                    print(f"\nRuta calculada: {ruta}")
                    print(f"distancia total: {distancia}")
                    Aviones.simular_vuelo(ruta)

            elif opcion == "4":
                origen = input("Introduce el ID de la ciudad de origen: ")
                destino = input("Introduce el ID de la ciudad de destino: ")
                omit_id = input("Introduce el ID de la ciudad a omitir: ")
                resultado = Aviones.calcular_ruta(origen, destino, omit_id)
                if "error" in resultado:
                    print(f"Error: {resultado['error']}")
                else:
                    ruta = resultado.get("ruta", [])
                    distancia = resultado.get("distancia", "N/A")
                    print(f"\nRuta calculada (omitiendo ID {omit_id}): {ruta}")
                    print(f"Distancia ttotal: {distancia}")
                    Aviones.simular_vuelo(ruta)

            elif opcion == "5":
                print("Saliendo del programa.")
                break

            else:
                print("Opción no válida, intenta de nuevo.")


if __name__ == "__main__":
    Program.main()
