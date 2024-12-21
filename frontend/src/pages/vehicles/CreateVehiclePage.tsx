import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Alert } from '../../components/ui/Alert';

const CLASSIFICATIONS = [
    { value: 'ECONOMY', label: 'Economy' },
    { value: 'STANDARD', label: 'Standard' },
    { value: 'LUXURY', label: 'Luxury' },
    { value: 'SUV', label: 'SUV' }
];

export const CreateVehiclePage: React.FC = () => {
    const [formData, setFormData] = useState({
        model: '',
        plate: '',
        year: new Date().getFullYear(),
        classification: 'STANDARD'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');

            await api.post('/vehicles', formData);
            navigate('/vehicles');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create vehicle');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Create New Vehicle</h1>

            <div className="bg-white rounded-lg shadow-md p-6">
                {error && <Alert type="error" message={error} className="mb-4" />}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Model"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Plate"
                        name="plate"
                        value={formData.plate}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        type="number"
                        label="Year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        min={1900}
                        max={new Date().getFullYear() + 1}
                        required
                    />

                    <Select
                        label="Classification"
                        name="classification"
                        value={formData.classification}
                        onChange={handleChange}
                        options={CLASSIFICATIONS}
                        required
                    />

                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="secondary"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                        >
                            Create Vehicle
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 