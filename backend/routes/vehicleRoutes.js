const express = require('express');
const Vehicle = require('../models/Vehicle');

const router = express.Router();

// Add a new vehicle
router.post('/', async (req, res) => {
    try {
        const { name, status } = req.body;
        const newVehicle = new Vehicle({ name, status });
        await newVehicle.save();
        res.status(201).json(newVehicle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update vehicle status
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            { status, lastUpdated: Date.now() },
            { new: true }
        );
        res.status(200).json(updatedVehicle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch all vehicles
router.get('/', async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.status(200).json(vehicles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a vehicle by ID
// Delete a vehicle by ID
router.delete('/vehicles/:id', async (req, res) => {
    try {
        const vehicleId = req.params.id;
        // Check if vehicle exists
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Vehicle exists, proceed with deletion
        await Vehicle.findByIdAndDelete(vehicleId);
        res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error('Error deleting vehicle:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
  





module.exports = router;
