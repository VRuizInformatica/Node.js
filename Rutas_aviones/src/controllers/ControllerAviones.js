const Model = require('../models/ModelsAviones');
const Graph = require('node-dijkstra');

module.exports = {
    getAllCiudades: (req, res) => {
        Model.getAllCiudades((err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener ciudades' });
            res.json(results);
        });
    },

    createCiudad: (req, res) => {
        const { nombre, poblacion, km2 } = req.body;
        if (!nombre || !poblacion || !km2) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }
        Model.createCiudad(nombre, poblacion, km2, (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al crear ciudad' });
            res.status(201).json({ message: 'Ciudad creada', id: results.insertId });
        });
    },

    updateCiudad: (req, res) => {
        const { id } = req.params;
        const { nombre, poblacion, km2 } = req.body;
        if (!nombre || !poblacion || !km2) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }
        Model.updateCiudad(id, nombre, poblacion, km2, (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar ciudad' });
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Ciudad no encontrada' });
            }
            res.json({ message: 'Ciudad actualizada' });
        });
    },

    deleteCiudad: (req, res) => {
        const { id } = req.params;
        Model.deleteCiudad(id, (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al eliminar ciudad' });
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Ciudad no encontrada' });
            }
            res.json({ message: 'Ciudad eliminada' });
        });
    },

    getAllEnlaces: (req, res) => {
        Model.getAllEnlaces((err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener enlaces' });
            res.json(results);
        });
    },

    createEnlace: (req, res) => {
        const { idOrigen, idDestino, tiempo } = req.body;
        if (!idOrigen || !idDestino || tiempo === undefined) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }
        Model.createEnlace(idOrigen, idDestino, tiempo, (err) => {
            if (err) return res.status(500).json({ error: 'Error al crear enlace' });
            res.status(201).json({ message: 'Enlace creado' });
        });
    },

    updateEnlace: (req, res) => {
        const { idOrigen, idDestino } = req.params;
        const { tiempo } = req.body;
        if (tiempo === undefined) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }
        Model.updateEnlace(idOrigen, idDestino, tiempo, (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar enlace' });
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Enlace no encontrado' });
            }
            res.json({ message: 'Enlace actualizado' });
        });
    },

    deleteEnlace: (req, res) => {
        const { idOrigen, idDestino } = req.params;
        Model.deleteEnlace(idOrigen, idDestino, (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al eliminar enlace' });
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Enlace no encontrado' });
            }
            res.json({ message: 'Enlace eliminado' });
        });
    },

    getRuta: async (req, res) => {
        const { origen, destino, omit } = req.query;
        console.log("DEBUG: origen=", origen, "destino=", destino, "omit=", omit);

        // Validar parámetros
        if (!origen || !destino) {
            return res.status(400).json({
                error: 'Faltan parámetros: origen y destino son obligatorios'
            });
        }

        try {
            // 1. Mapear ID->Nombre
            const ciudades = await Model.getAllCiudadesAsync();
            const cityMap = {};
            ciudades.forEach((c) => {
                cityMap[String(c.id)] = c.nombre;
            });

            // 2. Obtener todos los enlaces
            const enlaces = await Model.getAllEnlacesForRuta();

            // 3. Construir la adyacencia para node-dijkstra
            const adj = {};
            enlaces.forEach(e => {
                const o = String(e.idOrigen).trim();
                const d = String(e.idDestino).trim();

                const peso = parseInt(e.tiempo);

                if (!adj[o]) adj[o] = {};
                adj[o][d] = peso;
            });

            // 4. Eliminar completamente la ciudad omitida, si está definida
            const omitID = omit ? String(omit).trim() : null;
            if (omitID) {
                console.log(`Eliminando la ciudad omitida: ${omitID}`);
                // Borrar el nodo omitID
                delete adj[omitID];

                // Borrar referencias a omitID en otros nodos
                for (const nodo in adj) {
                    if (adj[nodo][omitID]) {
                        console.log(`  -> Borrando enlace ${nodo} -> ${omitID}`);
                        delete adj[nodo][omitID];
                    }
                }
            }

            console.log("DEBUG adj final =>", JSON.stringify(adj, null, 2));

            // 5. Crear el grafo con node-dijkstra
            const grafo = new Graph();
            for (const nodo in adj) {
                grafo.addNode(nodo, adj[nodo]);
            }

            // 6. Calcular la ruta con menor 'tiempo'
            const resultado = grafo.path(String(origen), String(destino), { cost: true });

            if (!resultado || !resultado.path) {
                return res.status(404).json({
                    error: 'No se encontró una ruta entre las ciudades dadas'
                });
            }

            // 7. Convertir IDs a nombres
            const rutaIDs = resultado.path;
            const rutaNombres = rutaIDs.map((id) => cityMap[id] || `ID:${id}`);

            // 8. Responder
            return res.json({
                origen: cityMap[origen] || `ID:${origen}`,
                destino: cityMap[destino] || `ID:${destino}`,
                ruta: rutaNombres,
                costo: resultado.cost, // es la suma de 'tiempo'
                omitido: omitID ? (cityMap[omitID] || `ID:${omitID}`) : null
            });

        } catch (error) {
            console.error('Error calculando la ruta:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    },
};
