import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/styles.css'; // Add CSS styling in a separate file

const VehicleTable = () => {
    const [vehicles, setVehicles] = useState([]);
    const [newVehicle, setNewVehicle] = useState({ name: '', status: 'Active' });

    // Fetch all vehicles
    const fetchVehicles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/vehicles');
            setVehicles(response.data);
        } catch (err) {
            console.error('Error fetching vehicles:', err.message);
        }
    };

    // Add a new vehicle
    const addVehicle = async () => {
        if (!newVehicle.name.trim()) {
            alert('Vehicle name is required.');
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/vehicles', newVehicle);
            setNewVehicle({ name: '', status: 'Active' });
            fetchVehicles();
        } catch (err) {
            console.error('Error adding vehicle:', err.message);
        }
    };

    // Update vehicle status
    const updateVehicleStatus = async (id) => {
        let newStatus = prompt('Enter the new status:');
        if (newStatus) {
            // Trim and standardize the input
            newStatus = newStatus
                .trim()
                .toLowerCase()
                .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word

            try {
                await axios.put(`http://localhost:5000/api/vehicles/${id}`, { status: newStatus });
                fetchVehicles();
            } catch (err) {
                console.error('Error updating vehicle status:', err.message);
            }
        } else {
            alert('Status update canceled or empty input provided.');
        }
    };

    // Delete a vehicle
// Delete a vehicle
const deleteVehicle = async (id) => {
    console.log('Attempting to delete vehicle with ID:', id); // Debugging
    try {
        // First, check if the vehicle exists
        const response = await axios.get(`http://localhost:5000/api/vehicles/${id}`);
        if (response.status === 200) {
            // Vehicle exists, proceed with deletion
            await axios.delete(`http://localhost:5000/api/vehicles/${id}`);
            alert('Vehicle deleted successfully.');
            fetchVehicles(); // Refresh the list
        } else {
            // Vehicle does not exist
            alert('Error: Vehicle not found.');
        }
    } catch (err) {
        console.error('Error deleting vehicle:', err.message);
        alert(`Error deleting vehicle: ${err.response?.data?.message || 'Unknown error'}`);
    }
};



    useEffect(() => {
        fetchVehicles();
    }, []);

    return (
        <div className="dashboard-container">
            <h1>Vehicle Management Dashboard</h1>
            <div className="form-container">
                <input
                    type="text"
                    placeholder="Vehicle Name"
                    value={newVehicle.name}
                    onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                />
                <select
                    value={newVehicle.status}
                    onChange={(e) => setNewVehicle({ ...newVehicle, status: e.target.value })}
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="In Repair">In Repair</option>
                    <option value="Retired">Retired</option>
                </select>
                <button onClick={addVehicle}>Add Vehicle</button>
            </div>
            <table className="vehicle-table">
                <thead>
                    <tr>
                        <th>Vehicle Name</th>
                        <th>Status</th>
                        <th>Last Updated</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicles.map((vehicle) => (
                        <tr key={vehicle._id}>
                            <td>{vehicle.name}</td>
                            <td>{vehicle.status}</td>
                            <td>{new Date(vehicle.lastUpdated).toLocaleString()}</td>
                            <td>
                                <button onClick={() => updateVehicleStatus(vehicle._id)}>Update Status</button>
                                
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VehicleTable;
